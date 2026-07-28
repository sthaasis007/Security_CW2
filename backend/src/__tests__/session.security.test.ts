import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { AuthController } from "../modules/auth/auth.controller";
import { AuthService } from "../modules/auth/auth.service";
import { AuthRepository } from "../modules/auth/auth.repository";
import { authOnly } from "../middleware/auth.middleware";
import csrfMiddleware from "../middleware/csrf.middleware";

const secureTestSecret = "test-only-jwt-secret-that-is-longer-than-32-characters";

const responseDouble = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  cookie: jest.fn().mockReturnThis(),
  clearCookie: jest.fn().mockReturnThis(),
});

describe("Phase 2 secure session management", () => {
  const originalSecret = process.env.JWT_SECRET;
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.JWT_SECRET = secureTestSecret;
    process.env.NODE_ENV = "production";
    jest.restoreAllMocks();
  });

  afterAll(() => {
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
  });

  it("sets authentication tokens only in secure HttpOnly cookies", async () => {
    jest.spyOn(AuthService, "login").mockResolvedValue({
      ok: true,
      status: 200,
      message: "Login successful",
      accessToken: "access-secret",
      refreshToken: "refresh-secret",
      csrfToken: "csrf-value",
      user: { id: "user-id", name: "User", email: "user@example.com", role: "user" },
    } as never);
    const req = { body: { email: "user@example.com", password: "Password!123" } } as never;
    const res = responseDouble();

    await AuthController.login(req, res as never);

    const accessCall = res.cookie.mock.calls.find(([name]) => name === "accessToken");
    const refreshCall = res.cookie.mock.calls.find(([name]) => name === "refreshToken");
    expect(accessCall?.[2]).toMatchObject({ httpOnly: true, secure: true, sameSite: "strict" });
    expect(refreshCall?.[2]).toMatchObject({ httpOnly: true, secure: true, sameSite: "strict" });
    const responseBody = res.json.mock.calls[res.json.mock.calls.length - 1]?.[0];
    expect(responseBody).not.toHaveProperty("accessToken");
    expect(responseBody).not.toHaveProperty("refreshToken");
    expect(responseBody).not.toHaveProperty("csrfToken");
  });

  it("accepts an access token from the HttpOnly cookie", async () => {
    const userId = new Types.ObjectId().toString();
    const token = jwt.sign({ sub: userId, sv: 2 }, secureTestSecret, { expiresIn: "15m" });
    jest.spyOn(AuthRepository, "findById").mockResolvedValue({
      _id: userId,
      email: "user@example.com",
      name: "User",
      role: "user",
      sessionVersion: 2,
    } as never);
    const req = { headers: { cookie: `accessToken=${token}` } } as never;
    const res = responseDouble();
    const next = jest.fn();

    await authOnly(req, res as never, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects expired access tokens", async () => {
    const userId = new Types.ObjectId().toString();
    const token = jwt.sign({ sub: userId, sv: 0 }, secureTestSecret, { expiresIn: -1 });
    const req = { headers: { cookie: `accessToken=${token}` } } as never;
    const res = responseDouble();
    const next = jest.fn();

    await authOnly(req, res as never, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects tokens after the session version changes", async () => {
    const userId = new Types.ObjectId().toString();
    const token = jwt.sign({ sub: userId, sv: 1 }, secureTestSecret);
    jest.spyOn(AuthRepository, "findById").mockResolvedValue({
      _id: userId,
      email: "user@example.com",
      role: "user",
      sessionVersion: 2,
    } as never);
    const req = { headers: { cookie: `accessToken=${token}` } } as never;
    const res = responseDouble();
    const next = jest.fn();

    await authOnly(req, res as never, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("requires a CSRF token for cookie-authenticated mutations", async () => {
    const userId = new Types.ObjectId().toString();
    const token = jwt.sign({ sub: userId, sv: 0 }, secureTestSecret);
    const req = {
      method: "POST",
      headers: { cookie: `accessToken=${token}` },
    } as never;
    const res = responseDouble();
    const next = jest.fn();

    await csrfMiddleware(req, res as never, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("invalidates the token family when a rotated refresh token is replayed", async () => {
    const userId = new Types.ObjectId().toString();
    const replayedToken = "previous-refresh-token";
    const replayedHash = crypto.createHash("sha256").update(replayedToken).digest("hex");
    jest.spyOn(AuthRepository, "findByRefreshTokenHash").mockResolvedValue(null);
    const previousSpy = jest.spyOn(AuthRepository, "findByPreviousRefreshTokenHash").mockResolvedValue({
      _id: userId,
    } as never);
    const invalidateSpy = jest.spyOn(AuthRepository, "invalidateSessions").mockResolvedValue(null);

    const result = await AuthService.rotateRefreshToken(replayedToken);

    expect(result.status).toBe(401);
    expect(previousSpy).toHaveBeenCalledWith(replayedHash);
    expect(invalidateSpy).toHaveBeenCalledWith(userId);
  });
});

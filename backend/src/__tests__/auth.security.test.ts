import { Types } from "mongoose";
import { requireSelfOrAdmin } from "../middleware/auth.middleware";
import sanitizeMiddleware from "../middleware/sanitize.middleware";
import { isPasswordStrong } from "../utils/security";

describe("requireSelfOrAdmin", () => {
  it("allows admins to access another user's resource", async () => {
    const req = {
      params: { id: new Types.ObjectId().toString() },
      user: { sub: new Types.ObjectId().toString(), role: "admin" },
    } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    const next = jest.fn();

    await requireSelfOrAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("denies non-admin users from accessing another user's resource", async () => {
    const req = {
      params: { id: new Types.ObjectId().toString() },
      user: { sub: new Types.ObjectId().toString(), role: "user" },
    } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    const next = jest.fn();

    await requireSelfOrAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("password strength policy", () => {
  it("accepts a strong password", () => {
    expect(isPasswordStrong("A!mplePassword123")).toBe(true);
  });

  it("rejects weak passwords", () => {
    expect(isPasswordStrong("password123")).toBe(false);
    expect(isPasswordStrong("short")).toBe(false);
  });
});

describe("sanitizeMiddleware", () => {
  it("strips NoSQL operators from request data", () => {
    const req = {
      body: { email: "user@example.com", $where: "sleep(1)" },
      query: {},
      params: {},
    } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    const next = jest.fn();

    sanitizeMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body).toEqual({ email: "user@example.com" });
  });
});

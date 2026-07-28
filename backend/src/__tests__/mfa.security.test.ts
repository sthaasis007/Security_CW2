import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { AuthService } from "../modules/auth/auth.service";
import { AuthRepository } from "../modules/auth/auth.repository";
import { ActivityService } from "../modules/activity/activity.service";
import { sendMfaCode } from "../utils/mailer";
import { hashSecret } from "../utils/security";

jest.mock("../utils/mailer", () => ({
  sendMfaCode: jest.fn(),
}));

const secureTestSecret = "test-only-jwt-secret-that-is-longer-than-32-characters";

describe("Phase 3 email MFA", () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = secureTestSecret;
    jest.restoreAllMocks();
    (sendMfaCode as jest.Mock).mockReset().mockResolvedValue(undefined);
    jest.spyOn(ActivityService, "log").mockResolvedValue({} as never);
  });

  afterAll(() => {
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  });

  it("does not issue a full session before MFA verification", async () => {
    const userId = new Types.ObjectId();
    const password = "StrongPassword!123";
    const user = {
      _id: userId,
      email: "user@example.com",
      name: "User",
      role: "user",
      password: await bcrypt.hash(password, 4),
      passwordChangedAt: new Date(),
      emailVerified: true,
      mfaEnabled: true,
      sessionVersion: 0,
    };
    jest.spyOn(AuthRepository, "findByEmail").mockResolvedValue(user as never);
    jest.spyOn(AuthRepository, "resetLoginAttempts").mockResolvedValue(user as never);
    jest.spyOn(AuthRepository, "setMfaChallenge").mockResolvedValue(user as never);
    const sessionSpy = jest.spyOn(AuthRepository, "setRefreshToken").mockResolvedValue(user as never);

    const result: any = await AuthService.login({ email: user.email, password });

    expect(result.status).toBe(202);
    expect(result.mfaRequired).toBe(true);
    expect(result).not.toHaveProperty("accessToken");
    expect(result).not.toHaveProperty("refreshToken");
    expect(sessionSpy).not.toHaveBeenCalled();
    expect(sendMfaCode).toHaveBeenCalledTimes(1);
    const payload = jwt.verify(result.challengeToken, secureTestSecret) as any;
    expect(payload.scope).toBe("mfa_login");
    expect(payload.exp - payload.iat).toBe(300);
  });

  it("accepts a valid code once and then creates the session", async () => {
    const userId = new Types.ObjectId();
    let challengeHash = "";
    let deliveredCode = "";
    const user: any = {
      _id: userId,
      email: "user@example.com",
      name: "User",
      role: "user",
      password: await bcrypt.hash("StrongPassword!123", 4),
      passwordChangedAt: new Date(),
      emailVerified: true,
      mfaEnabled: true,
      sessionVersion: 0,
      mfaChallengeExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      mfaChallengeAttempts: 0,
      mfaChallengePurpose: "login",
      mfaRecoveryCodeHashes: [],
    };
    jest.spyOn(AuthRepository, "findByEmail").mockResolvedValue(user);
    jest.spyOn(AuthRepository, "resetLoginAttempts").mockResolvedValue(user);
    jest.spyOn(AuthRepository, "setMfaChallenge").mockImplementation(((_id: string, hash: string) => {
      challengeHash = hash;
      return Promise.resolve(user);
    }) as any);
    (sendMfaCode as jest.Mock).mockImplementation(async (_email, code) => {
      deliveredCode = code;
    });

    const login: any = await AuthService.login({ email: user.email, password: "StrongPassword!123" });
    user.mfaChallengeHash = challengeHash;
    jest.spyOn(AuthRepository, "findById").mockResolvedValue(user);
    const clearSpy = jest.spyOn(AuthRepository, "clearMfaChallenge").mockResolvedValue(user);
    jest.spyOn(AuthRepository, "setRefreshToken").mockResolvedValue(user);
    jest.spyOn(AuthRepository, "setCsrfToken").mockResolvedValue(user);

    const verified: any = await AuthService.verifyLoginMfa(login.challengeToken, deliveredCode);

    expect(verified.status).toBe(200);
    expect(verified.accessToken).toBeTruthy();
    expect(verified.refreshToken).toBeTruthy();
    expect(clearSpy).toHaveBeenCalledWith(userId.toString());
  });

  it("counts an invalid code and does not create a session", async () => {
    const userId = new Types.ObjectId();
    const challengeId = "challenge-id";
    const user: any = {
      _id: userId,
      email: "user@example.com",
      role: "user",
      sessionVersion: 0,
      mfaEnabled: true,
      mfaChallengeHash: hashSecret(`${challengeId}:123456`),
      mfaChallengeExpiresAt: new Date(Date.now() + 60_000),
      mfaChallengeAttempts: 0,
      mfaChallengePurpose: "login",
      mfaRecoveryCodeHashes: [],
    };
    const token = jwt.sign(
      { sub: userId.toString(), scope: "mfa_login", cid: challengeId, sv: 0 },
      secureTestSecret,
      { expiresIn: "5m" },
    );
    jest.spyOn(AuthRepository, "findById").mockResolvedValue(user);
    const attemptSpy = jest.spyOn(AuthRepository, "incrementMfaAttempts").mockResolvedValue({
      ...user,
      mfaChallengeAttempts: 1,
    } as never);
    const sessionSpy = jest.spyOn(AuthRepository, "setRefreshToken").mockResolvedValue(user);

    const result = await AuthService.verifyLoginMfa(token, "999999");

    expect(result.status).toBe(401);
    expect(attemptSpy).toHaveBeenCalledWith(userId.toString());
    expect(sessionSpy).not.toHaveBeenCalled();
  });

  it("consumes a recovery code so it cannot be reused", async () => {
    const userId = new Types.ObjectId();
    const recoveryCode = "ABCD-1234";
    const recoveryHash = hashSecret(recoveryCode);
    const user: any = {
      _id: userId,
      email: "user@example.com",
      role: "user",
      sessionVersion: 0,
      mfaEnabled: true,
      mfaRecoveryCodeHashes: [recoveryHash],
    };
    const token = jwt.sign(
      { sub: userId.toString(), scope: "mfa_login", cid: "challenge", sv: 0 },
      secureTestSecret,
      { expiresIn: "5m" },
    );
    jest.spyOn(AuthRepository, "findById").mockResolvedValue(user);
    const consumeSpy = jest.spyOn(AuthRepository, "consumeRecoveryCode").mockResolvedValue(user);
    jest.spyOn(AuthRepository, "setRefreshToken").mockResolvedValue(user);
    jest.spyOn(AuthRepository, "setCsrfToken").mockResolvedValue(user);

    const result = await AuthService.verifyLoginMfa(token, recoveryCode);

    expect(result.status).toBe(200);
    expect(consumeSpy).toHaveBeenCalledWith(userId.toString(), recoveryHash);
  });
});

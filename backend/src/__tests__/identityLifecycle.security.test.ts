import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { AuthService } from "../modules/auth/auth.service";
import { AuthRepository } from "../modules/auth/auth.repository";
import { hashSecret } from "../utils/security";
import { sendPasswordReset } from "../utils/mailer";

jest.mock("../utils/mailer", () => ({
  sendMfaCode: jest.fn(),
  sendEmailVerification: jest.fn().mockResolvedValue(undefined),
  sendPasswordReset: jest.fn().mockResolvedValue(undefined),
  sendPasswordChangedNotice: jest.fn().mockResolvedValue(undefined),
  sendSuspiciousLoginNotice: jest.fn().mockResolvedValue(undefined),
}));

describe("Phase 5 password and identity lifecycle", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    (sendPasswordReset as jest.Mock).mockReset().mockResolvedValue(undefined);
  });

  it("returns the same forgot-password response for existing and unknown accounts", async () => {
    const user = { _id: new Types.ObjectId(), email: "known@example.com" };
    jest.spyOn(AuthRepository, "findByEmail").mockResolvedValueOnce(user as never).mockResolvedValueOnce(null);
    const setToken = jest.spyOn(AuthRepository, "setResetToken").mockResolvedValue(user as never);

    const known = await AuthService.forgotPassword({ email: "known@example.com" });
    const unknown = await AuthService.forgotPassword({ email: "unknown@example.com" });

    expect(known).toEqual(unknown);
    expect(setToken).toHaveBeenCalledTimes(1);
    const storedHash = setToken.mock.calls[0]![1];
    const deliveredToken = (sendPasswordReset as jest.Mock).mock.calls[0]![1];
    expect(storedHash).toBe(hashSecret(deliveredToken));
    expect(storedHash).not.toBe(deliveredToken);
  });

  it("rejects expired reset tokens", async () => {
    jest.spyOn(AuthRepository, "findByResetToken").mockResolvedValue({
      _id: new Types.ObjectId(),
      resetPasswordUsed: false,
      resetPasswordExpires: new Date(Date.now() - 1),
    } as never);
    const result = await AuthService.resetPassword({ token: "a".repeat(64), password: "NewPassword!123" });
    expect(result.status).toBe(400);
    expect(result.message).toBe("Invalid or expired reset link");
  });

  it("rejects reset-token reuse after a successful reset", async () => {
    const user = {
      _id: new Types.ObjectId(),
      email: "user@example.com",
      password: await bcrypt.hash("OldPassword!123", 4),
      passwordHistory: [],
      resetPasswordUsed: false,
      resetPasswordExpires: new Date(Date.now() + 60_000),
    };
    jest.spyOn(AuthRepository, "findByResetToken").mockResolvedValueOnce(user as never).mockResolvedValueOnce(null);
    jest.spyOn(AuthRepository, "updatePassword").mockResolvedValue(user as never);
    const invalidate = jest.spyOn(AuthRepository, "invalidateSessions").mockResolvedValue(user as never);

    expect((await AuthService.resetPassword({ token: "b".repeat(64), password: "NewPassword!123" })).status).toBe(200);
    expect(invalidate).toHaveBeenCalledWith(user._id.toString());
    expect((await AuthService.resetPassword({ token: "b".repeat(64), password: "AnotherPassword!123" })).status).toBe(400);
  });

  it("prevents password-history bypass through the centralized change path", async () => {
    const historical = await bcrypt.hash("PreviousPassword!123", 4);
    const user = {
      _id: new Types.ObjectId(),
      email: "user@example.com",
      password: await bcrypt.hash("CurrentPassword!123", 4),
      passwordHistory: [{ hash: historical }],
    };
    const update = jest.spyOn(AuthRepository, "updatePassword").mockResolvedValue(user as never);

    const result = await AuthService.changePassword(user, "PreviousPassword!123");

    expect(result.status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });

  it("enforces password expiry instead of issuing a session", async () => {
    const password = "CurrentPassword!123";
    const user = {
      _id: new Types.ObjectId(),
      email: "user@example.com",
      password: await bcrypt.hash(password, 4),
      passwordChangedAt: new Date(Date.now() - 91 * 24 * 60 * 60 * 1000),
      emailVerified: true,
      lockUntil: null,
    };
    jest.spyOn(AuthRepository, "findByEmail").mockResolvedValue(user as never);
    jest.spyOn(AuthRepository, "resetLoginAttempts").mockResolvedValue(user as never);
    const session = jest.spyOn(AuthRepository, "setRefreshToken").mockResolvedValue(user as never);

    const result: any = await AuthService.login({ email: user.email, password });

    expect(result.code).toBe("PASSWORD_EXPIRED");
    expect(result.status).toBe(403);
    expect(session).not.toHaveBeenCalled();
  });

  it("does not silently verify an unverified account during login", async () => {
    const password = "CurrentPassword!123";
    const user = {
      _id: new Types.ObjectId(),
      email: "user@example.com",
      password: await bcrypt.hash(password, 4),
      passwordChangedAt: new Date(),
      emailVerified: false,
      lockUntil: null,
    };
    jest.spyOn(AuthRepository, "findByEmail").mockResolvedValue(user as never);
    const verify = jest.spyOn(AuthRepository, "verifyEmail").mockResolvedValue(user as never);
    const session = jest.spyOn(AuthRepository, "setRefreshToken").mockResolvedValue(user as never);

    const result: any = await AuthService.login({ email: user.email, password });

    expect(result.code).toBe("EMAIL_NOT_VERIFIED");
    expect(verify).not.toHaveBeenCalled();
    expect(session).not.toHaveBeenCalled();
  });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const auth_service_1 = require("../modules/auth/auth.service");
const auth_repository_1 = require("../modules/auth/auth.repository");
const security_1 = require("../utils/security");
const mailer_1 = require("../utils/mailer");
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
        mailer_1.sendPasswordReset.mockReset().mockResolvedValue(undefined);
    });
    it("returns the same forgot-password response for existing and unknown accounts", async () => {
        const user = { _id: new mongoose_1.Types.ObjectId(), email: "known@example.com" };
        jest.spyOn(auth_repository_1.AuthRepository, "findByEmail").mockResolvedValueOnce(user).mockResolvedValueOnce(null);
        const setToken = jest.spyOn(auth_repository_1.AuthRepository, "setResetToken").mockResolvedValue(user);
        const known = await auth_service_1.AuthService.forgotPassword({ email: "known@example.com" });
        const unknown = await auth_service_1.AuthService.forgotPassword({ email: "unknown@example.com" });
        expect(known).toEqual(unknown);
        expect(setToken).toHaveBeenCalledTimes(1);
        const storedHash = setToken.mock.calls[0][1];
        const deliveredToken = mailer_1.sendPasswordReset.mock.calls[0][1];
        expect(storedHash).toBe((0, security_1.hashSecret)(deliveredToken));
        expect(storedHash).not.toBe(deliveredToken);
    });
    it("rejects expired reset tokens", async () => {
        jest.spyOn(auth_repository_1.AuthRepository, "findByResetToken").mockResolvedValue({
            _id: new mongoose_1.Types.ObjectId(),
            resetPasswordUsed: false,
            resetPasswordExpires: new Date(Date.now() - 1),
        });
        const result = await auth_service_1.AuthService.resetPassword({ token: "a".repeat(64), password: "NewPassword!123" });
        expect(result.status).toBe(400);
        expect(result.message).toBe("Invalid or expired reset link");
    });
    it("rejects reset-token reuse after a successful reset", async () => {
        const user = {
            _id: new mongoose_1.Types.ObjectId(),
            email: "user@example.com",
            password: await bcryptjs_1.default.hash("OldPassword!123", 4),
            passwordHistory: [],
            resetPasswordUsed: false,
            resetPasswordExpires: new Date(Date.now() + 60000),
        };
        jest.spyOn(auth_repository_1.AuthRepository, "findByResetToken").mockResolvedValueOnce(user).mockResolvedValueOnce(null);
        jest.spyOn(auth_repository_1.AuthRepository, "updatePassword").mockResolvedValue(user);
        const invalidate = jest.spyOn(auth_repository_1.AuthRepository, "invalidateSessions").mockResolvedValue(user);
        expect((await auth_service_1.AuthService.resetPassword({ token: "b".repeat(64), password: "NewPassword!123" })).status).toBe(200);
        expect(invalidate).toHaveBeenCalledWith(user._id.toString());
        expect((await auth_service_1.AuthService.resetPassword({ token: "b".repeat(64), password: "AnotherPassword!123" })).status).toBe(400);
    });
    it("prevents password-history bypass through the centralized change path", async () => {
        const historical = await bcryptjs_1.default.hash("PreviousPassword!123", 4);
        const user = {
            _id: new mongoose_1.Types.ObjectId(),
            email: "user@example.com",
            password: await bcryptjs_1.default.hash("CurrentPassword!123", 4),
            passwordHistory: [{ hash: historical }],
        };
        const update = jest.spyOn(auth_repository_1.AuthRepository, "updatePassword").mockResolvedValue(user);
        const result = await auth_service_1.AuthService.changePassword(user, "PreviousPassword!123");
        expect(result.status).toBe(400);
        expect(update).not.toHaveBeenCalled();
    });
    it("enforces password expiry instead of issuing a session", async () => {
        const password = "CurrentPassword!123";
        const user = {
            _id: new mongoose_1.Types.ObjectId(),
            email: "user@example.com",
            password: await bcryptjs_1.default.hash(password, 4),
            passwordChangedAt: new Date(Date.now() - 91 * 24 * 60 * 60 * 1000),
            emailVerified: true,
            lockUntil: null,
        };
        jest.spyOn(auth_repository_1.AuthRepository, "findByEmail").mockResolvedValue(user);
        jest.spyOn(auth_repository_1.AuthRepository, "resetLoginAttempts").mockResolvedValue(user);
        const session = jest.spyOn(auth_repository_1.AuthRepository, "setRefreshToken").mockResolvedValue(user);
        const result = await auth_service_1.AuthService.login({ email: user.email, password });
        expect(result.code).toBe("PASSWORD_EXPIRED");
        expect(result.status).toBe(403);
        expect(session).not.toHaveBeenCalled();
    });
    it("does not silently verify an unverified account during login", async () => {
        const password = "CurrentPassword!123";
        const user = {
            _id: new mongoose_1.Types.ObjectId(),
            email: "user@example.com",
            password: await bcryptjs_1.default.hash(password, 4),
            passwordChangedAt: new Date(),
            emailVerified: false,
            lockUntil: null,
        };
        jest.spyOn(auth_repository_1.AuthRepository, "findByEmail").mockResolvedValue(user);
        const verify = jest.spyOn(auth_repository_1.AuthRepository, "verifyEmail").mockResolvedValue(user);
        const session = jest.spyOn(auth_repository_1.AuthRepository, "setRefreshToken").mockResolvedValue(user);
        const result = await auth_service_1.AuthService.login({ email: user.email, password });
        expect(result.code).toBe("EMAIL_NOT_VERIFIED");
        expect(verify).not.toHaveBeenCalled();
        expect(session).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=identityLifecycle.security.test.js.map
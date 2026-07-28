"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const auth_service_1 = require("../modules/auth/auth.service");
const auth_repository_1 = require("../modules/auth/auth.repository");
const activity_service_1 = require("../modules/activity/activity.service");
const mailer_1 = require("../utils/mailer");
const security_1 = require("../utils/security");
jest.mock("../utils/mailer", () => ({
    sendMfaCode: jest.fn(),
}));
const secureTestSecret = "test-only-jwt-secret-that-is-longer-than-32-characters";
describe("Phase 3 email MFA", () => {
    const originalSecret = process.env.JWT_SECRET;
    beforeEach(() => {
        process.env.JWT_SECRET = secureTestSecret;
        jest.restoreAllMocks();
        mailer_1.sendMfaCode.mockReset().mockResolvedValue(undefined);
        jest.spyOn(activity_service_1.ActivityService, "log").mockResolvedValue({});
    });
    afterAll(() => {
        if (originalSecret === undefined)
            delete process.env.JWT_SECRET;
        else
            process.env.JWT_SECRET = originalSecret;
    });
    it("does not issue a full session before MFA verification", async () => {
        const userId = new mongoose_1.Types.ObjectId();
        const password = "StrongPassword!123";
        const user = {
            _id: userId,
            email: "user@example.com",
            name: "User",
            role: "user",
            password: await bcryptjs_1.default.hash(password, 4),
            passwordChangedAt: new Date(),
            emailVerified: true,
            mfaEnabled: true,
            sessionVersion: 0,
        };
        jest.spyOn(auth_repository_1.AuthRepository, "findByEmail").mockResolvedValue(user);
        jest.spyOn(auth_repository_1.AuthRepository, "resetLoginAttempts").mockResolvedValue(user);
        jest.spyOn(auth_repository_1.AuthRepository, "setMfaChallenge").mockResolvedValue(user);
        const sessionSpy = jest.spyOn(auth_repository_1.AuthRepository, "setRefreshToken").mockResolvedValue(user);
        const result = await auth_service_1.AuthService.login({ email: user.email, password });
        expect(result.status).toBe(202);
        expect(result.mfaRequired).toBe(true);
        expect(result).not.toHaveProperty("accessToken");
        expect(result).not.toHaveProperty("refreshToken");
        expect(sessionSpy).not.toHaveBeenCalled();
        expect(mailer_1.sendMfaCode).toHaveBeenCalledTimes(1);
        const payload = jsonwebtoken_1.default.verify(result.challengeToken, secureTestSecret);
        expect(payload.scope).toBe("mfa_login");
        expect(payload.exp - payload.iat).toBe(300);
    });
    it("accepts a valid code once and then creates the session", async () => {
        const userId = new mongoose_1.Types.ObjectId();
        let challengeHash = "";
        let deliveredCode = "";
        const user = {
            _id: userId,
            email: "user@example.com",
            name: "User",
            role: "user",
            password: await bcryptjs_1.default.hash("StrongPassword!123", 4),
            passwordChangedAt: new Date(),
            emailVerified: true,
            mfaEnabled: true,
            sessionVersion: 0,
            mfaChallengeExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
            mfaChallengeAttempts: 0,
            mfaChallengePurpose: "login",
            mfaRecoveryCodeHashes: [],
        };
        jest.spyOn(auth_repository_1.AuthRepository, "findByEmail").mockResolvedValue(user);
        jest.spyOn(auth_repository_1.AuthRepository, "resetLoginAttempts").mockResolvedValue(user);
        jest.spyOn(auth_repository_1.AuthRepository, "setMfaChallenge").mockImplementation(((_id, hash) => {
            challengeHash = hash;
            return Promise.resolve(user);
        }));
        mailer_1.sendMfaCode.mockImplementation(async (_email, code) => {
            deliveredCode = code;
        });
        const login = await auth_service_1.AuthService.login({ email: user.email, password: "StrongPassword!123" });
        user.mfaChallengeHash = challengeHash;
        jest.spyOn(auth_repository_1.AuthRepository, "findById").mockResolvedValue(user);
        const clearSpy = jest.spyOn(auth_repository_1.AuthRepository, "clearMfaChallenge").mockResolvedValue(user);
        jest.spyOn(auth_repository_1.AuthRepository, "setRefreshToken").mockResolvedValue(user);
        jest.spyOn(auth_repository_1.AuthRepository, "setCsrfToken").mockResolvedValue(user);
        const verified = await auth_service_1.AuthService.verifyLoginMfa(login.challengeToken, deliveredCode);
        expect(verified.status).toBe(200);
        expect(verified.accessToken).toBeTruthy();
        expect(verified.refreshToken).toBeTruthy();
        expect(clearSpy).toHaveBeenCalledWith(userId.toString());
    });
    it("counts an invalid code and does not create a session", async () => {
        const userId = new mongoose_1.Types.ObjectId();
        const challengeId = "challenge-id";
        const user = {
            _id: userId,
            email: "user@example.com",
            role: "user",
            sessionVersion: 0,
            mfaEnabled: true,
            mfaChallengeHash: (0, security_1.hashSecret)(`${challengeId}:123456`),
            mfaChallengeExpiresAt: new Date(Date.now() + 60000),
            mfaChallengeAttempts: 0,
            mfaChallengePurpose: "login",
            mfaRecoveryCodeHashes: [],
        };
        const token = jsonwebtoken_1.default.sign({ sub: userId.toString(), scope: "mfa_login", cid: challengeId, sv: 0 }, secureTestSecret, { expiresIn: "5m" });
        jest.spyOn(auth_repository_1.AuthRepository, "findById").mockResolvedValue(user);
        const attemptSpy = jest.spyOn(auth_repository_1.AuthRepository, "incrementMfaAttempts").mockResolvedValue({
            ...user,
            mfaChallengeAttempts: 1,
        });
        const sessionSpy = jest.spyOn(auth_repository_1.AuthRepository, "setRefreshToken").mockResolvedValue(user);
        const result = await auth_service_1.AuthService.verifyLoginMfa(token, "999999");
        expect(result.status).toBe(401);
        expect(attemptSpy).toHaveBeenCalledWith(userId.toString());
        expect(sessionSpy).not.toHaveBeenCalled();
    });
    it("consumes a recovery code so it cannot be reused", async () => {
        const userId = new mongoose_1.Types.ObjectId();
        const recoveryCode = "ABCD-1234";
        const recoveryHash = (0, security_1.hashSecret)(recoveryCode);
        const user = {
            _id: userId,
            email: "user@example.com",
            role: "user",
            sessionVersion: 0,
            mfaEnabled: true,
            mfaRecoveryCodeHashes: [recoveryHash],
        };
        const token = jsonwebtoken_1.default.sign({ sub: userId.toString(), scope: "mfa_login", cid: "challenge", sv: 0 }, secureTestSecret, { expiresIn: "5m" });
        jest.spyOn(auth_repository_1.AuthRepository, "findById").mockResolvedValue(user);
        const consumeSpy = jest.spyOn(auth_repository_1.AuthRepository, "consumeRecoveryCode").mockResolvedValue(user);
        jest.spyOn(auth_repository_1.AuthRepository, "setRefreshToken").mockResolvedValue(user);
        jest.spyOn(auth_repository_1.AuthRepository, "setCsrfToken").mockResolvedValue(user);
        const result = await auth_service_1.AuthService.verifyLoginMfa(token, recoveryCode);
        expect(result.status).toBe(200);
        expect(consumeSpy).toHaveBeenCalledWith(userId.toString(), recoveryHash);
    });
});
//# sourceMappingURL=mfa.security.test.js.map
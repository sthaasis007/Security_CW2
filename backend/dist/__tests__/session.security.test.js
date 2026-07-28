"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const auth_controller_1 = require("../modules/auth/auth.controller");
const auth_service_1 = require("../modules/auth/auth.service");
const auth_repository_1 = require("../modules/auth/auth.repository");
const auth_middleware_1 = require("../middleware/auth.middleware");
const csrf_middleware_1 = __importDefault(require("../middleware/csrf.middleware"));
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
        if (originalSecret === undefined)
            delete process.env.JWT_SECRET;
        else
            process.env.JWT_SECRET = originalSecret;
        if (originalNodeEnv === undefined)
            delete process.env.NODE_ENV;
        else
            process.env.NODE_ENV = originalNodeEnv;
    });
    it("sets authentication tokens only in secure HttpOnly cookies", async () => {
        jest.spyOn(auth_service_1.AuthService, "login").mockResolvedValue({
            ok: true,
            status: 200,
            message: "Login successful",
            accessToken: "access-secret",
            refreshToken: "refresh-secret",
            csrfToken: "csrf-value",
            user: { id: "user-id", name: "User", email: "user@example.com", role: "user" },
        });
        const req = { body: { email: "user@example.com", password: "Password!123" } };
        const res = responseDouble();
        await auth_controller_1.AuthController.login(req, res);
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
        const userId = new mongoose_1.Types.ObjectId().toString();
        const token = jsonwebtoken_1.default.sign({ sub: userId, sv: 2 }, secureTestSecret, { expiresIn: "15m" });
        jest.spyOn(auth_repository_1.AuthRepository, "findById").mockResolvedValue({
            _id: userId,
            email: "user@example.com",
            name: "User",
            role: "user",
            sessionVersion: 2,
        });
        const req = { headers: { cookie: `accessToken=${token}` } };
        const res = responseDouble();
        const next = jest.fn();
        await (0, auth_middleware_1.authOnly)(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
    });
    it("rejects expired access tokens", async () => {
        const userId = new mongoose_1.Types.ObjectId().toString();
        const token = jsonwebtoken_1.default.sign({ sub: userId, sv: 0 }, secureTestSecret, { expiresIn: -1 });
        const req = { headers: { cookie: `accessToken=${token}` } };
        const res = responseDouble();
        const next = jest.fn();
        await (0, auth_middleware_1.authOnly)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
    it("rejects tokens after the session version changes", async () => {
        const userId = new mongoose_1.Types.ObjectId().toString();
        const token = jsonwebtoken_1.default.sign({ sub: userId, sv: 1 }, secureTestSecret);
        jest.spyOn(auth_repository_1.AuthRepository, "findById").mockResolvedValue({
            _id: userId,
            email: "user@example.com",
            role: "user",
            sessionVersion: 2,
        });
        const req = { headers: { cookie: `accessToken=${token}` } };
        const res = responseDouble();
        const next = jest.fn();
        await (0, auth_middleware_1.authOnly)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
    it("requires a CSRF token for cookie-authenticated mutations", async () => {
        const userId = new mongoose_1.Types.ObjectId().toString();
        const token = jsonwebtoken_1.default.sign({ sub: userId, sv: 0 }, secureTestSecret);
        const req = {
            method: "POST",
            headers: { cookie: `accessToken=${token}` },
        };
        const res = responseDouble();
        const next = jest.fn();
        await (0, csrf_middleware_1.default)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });
    it("invalidates the token family when a rotated refresh token is replayed", async () => {
        const userId = new mongoose_1.Types.ObjectId().toString();
        const replayedToken = "previous-refresh-token";
        const replayedHash = crypto_1.default.createHash("sha256").update(replayedToken).digest("hex");
        jest.spyOn(auth_repository_1.AuthRepository, "findByRefreshTokenHash").mockResolvedValue(null);
        const previousSpy = jest.spyOn(auth_repository_1.AuthRepository, "findByPreviousRefreshTokenHash").mockResolvedValue({
            _id: userId,
        });
        const invalidateSpy = jest.spyOn(auth_repository_1.AuthRepository, "invalidateSessions").mockResolvedValue(null);
        const result = await auth_service_1.AuthService.rotateRefreshToken(replayedToken);
        expect(result.status).toBe(401);
        expect(previousSpy).toHaveBeenCalledWith(replayedHash);
        expect(invalidateSpy).toHaveBeenCalledWith(userId);
    });
});
//# sourceMappingURL=session.security.test.js.map
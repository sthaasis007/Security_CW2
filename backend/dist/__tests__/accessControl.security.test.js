"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = require("mongoose");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const auth_controller_1 = require("../modules/auth/auth.controller");
const auth_repository_1 = require("../modules/auth/auth.repository");
const auth_dto_1 = require("../modules/auth/auth.dto");
const security_1 = require("../config/security");
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
jest.mock("../modules/auth/auth.repository", () => ({
    AuthRepository: {
        findById: jest.fn(),
    },
}));
const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
});
describe("Phase 1 access-control regression tests", () => {
    const originalSecret = process.env.JWT_SECRET;
    const secureTestSecret = "test-only-jwt-secret-that-is-longer-than-32-characters";
    beforeEach(() => {
        process.env.JWT_SECRET = secureTestSecret;
        jest.clearAllMocks();
    });
    afterAll(() => {
        if (originalSecret === undefined)
            delete process.env.JWT_SECRET;
        else
            process.env.JWT_SECRET = originalSecret;
    });
    it("rejects role injection during public registration validation", () => {
        const result = auth_dto_1.registerDto.safeParse({
            name: "User",
            email: "user@example.com",
            password: "StrongPassword!123",
            role: "admin",
        });
        expect(result.success).toBe(false);
    });
    it("does not expose the former unauthenticated account-creation route", async () => {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use("/api/auth", auth_route_1.default);
        const response = await (0, supertest_1.default)(app)
            .post("/api/auth/user")
            .send({
            name: "Attacker",
            email: "attacker@example.com",
            password: "StrongPassword!123",
            role: "admin",
        });
        expect(response.status).toBe(404);
        expect(auth_repository_1.AuthRepository.findById).not.toHaveBeenCalled();
    });
    it("rejects profile mass assignment before updating the database", async () => {
        const req = {
            params: { id: new mongoose_1.Types.ObjectId().toString() },
            body: { name: "User", role: "admin" },
        };
        const res = mockResponse();
        await auth_controller_1.AuthController.updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(auth_repository_1.AuthRepository.findById).not.toHaveBeenCalled();
    });
    it("uses the database role instead of an elevated JWT role", async () => {
        const userId = new mongoose_1.Types.ObjectId().toString();
        const token = jsonwebtoken_1.default.sign({ sub: userId, role: "admin" }, secureTestSecret);
        auth_repository_1.AuthRepository.findById.mockResolvedValue({
            _id: userId,
            name: "User",
            email: "user@example.com",
            role: "user",
        });
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = mockResponse();
        const next = jest.fn();
        await (0, auth_middleware_1.authOnly)(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(req.user.role).toBe("user");
    });
    it("denies admin access when only the JWT claims administrator privileges", async () => {
        const userId = new mongoose_1.Types.ObjectId().toString();
        const token = jsonwebtoken_1.default.sign({ sub: userId, role: "admin" }, secureTestSecret);
        auth_repository_1.AuthRepository.findById.mockResolvedValue({
            _id: userId,
            email: "user@example.com",
            role: "user",
        });
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = mockResponse();
        const next = jest.fn();
        await (0, admin_middleware_1.adminOnly)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });
    it("rejects a valid old token after its user has been deleted", async () => {
        const userId = new mongoose_1.Types.ObjectId().toString();
        const token = jsonwebtoken_1.default.sign({ sub: userId, role: "user" }, secureTestSecret);
        auth_repository_1.AuthRepository.findById.mockResolvedValue(null);
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = mockResponse();
        const next = jest.fn();
        await (0, auth_middleware_1.authOnly)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
    it("refuses missing, short and known placeholder JWT secrets", () => {
        delete process.env.JWT_SECRET;
        expect(() => (0, security_1.getJwtSecret)()).toThrow();
        process.env.JWT_SECRET = "short";
        expect(() => (0, security_1.getJwtSecret)()).toThrow();
        process.env.JWT_SECRET = "change_me_local_secret";
        expect(() => (0, security_1.getJwtSecret)()).toThrow();
    });
});
//# sourceMappingURL=accessControl.security.test.js.map
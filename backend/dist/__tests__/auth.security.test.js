"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const auth_middleware_1 = require("../middleware/auth.middleware");
const sanitize_middleware_1 = __importDefault(require("../middleware/sanitize.middleware"));
const security_1 = require("../utils/security");
describe("requireSelfOrAdmin", () => {
    it("allows admins to access another user's resource", async () => {
        const req = {
            params: { id: new mongoose_1.Types.ObjectId().toString() },
            user: { sub: new mongoose_1.Types.ObjectId().toString(), role: "admin" },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        await (0, auth_middleware_1.requireSelfOrAdmin)(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });
    it("denies non-admin users from accessing another user's resource", async () => {
        const req = {
            params: { id: new mongoose_1.Types.ObjectId().toString() },
            user: { sub: new mongoose_1.Types.ObjectId().toString(), role: "user" },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        await (0, auth_middleware_1.requireSelfOrAdmin)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });
});
describe("password strength policy", () => {
    it("accepts a strong password", () => {
        expect((0, security_1.isPasswordStrong)("A!mplePassword123")).toBe(true);
    });
    it("rejects weak passwords", () => {
        expect((0, security_1.isPasswordStrong)("password123")).toBe(false);
        expect((0, security_1.isPasswordStrong)("short")).toBe(false);
    });
});
describe("sanitizeMiddleware", () => {
    it("strips NoSQL operators from request data", () => {
        const req = {
            body: { email: "user@example.com", $where: "sleep(1)" },
            query: {},
            params: {},
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        (0, sanitize_middleware_1.default)(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(req.body).toEqual({ email: "user@example.com" });
    });
});
//# sourceMappingURL=auth.security.test.js.map
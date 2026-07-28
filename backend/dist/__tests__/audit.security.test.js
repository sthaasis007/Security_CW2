"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const activity_route_1 = __importDefault(require("../modules/activity/activity.route"));
const activity_repository_1 = require("../modules/activity/activity.repository");
const activity_service_1 = require("../modules/activity/activity.service");
const auth_repository_1 = require("../modules/auth/auth.repository");
const mailer_1 = require("../utils/mailer");
jest.mock("../utils/mailer", () => ({
    sendMfaCode: jest.fn(),
    sendEmailVerification: jest.fn(),
    sendPasswordReset: jest.fn(),
    sendPasswordChangedNotice: jest.fn(),
    sendSuspiciousLoginNotice: jest.fn(),
    sendSecurityAlert: jest.fn().mockResolvedValue(undefined),
}));
const secret = "audit-test-jwt-secret-that-is-longer-than-32-characters";
describe("Phase 7 audit logging and monitoring", () => {
    const originalEnv = process.env;
    beforeEach(() => {
        process.env = { ...originalEnv, NODE_ENV: "test", JWT_SECRET: secret, AUDIT_LOG_HMAC_KEY: "audit-test-hmac-key-that-is-at-least-32-characters" };
        jest.restoreAllMocks();
        jest.spyOn(activity_repository_1.ActivityRepository, "countRecent").mockResolvedValue(0);
    });
    afterAll(() => {
        process.env = originalEnv;
    });
    it("recursively redacts credentials, cookies, JWTs, OTPs, reset tokens and payment IDs", async () => {
        const create = jest.spyOn(activity_repository_1.ActivityRepository, "create").mockImplementation(async (data) => data);
        await activity_service_1.ActivityService.log("account_updated", "Bearer hidden-value", {
            password: "Password!123",
            nested: { resetToken: "reset", otpCode: "123456", cookie: "session", pidx: "payment-ref" },
            authorization: "Bearer abc",
        });
        const payload = create.mock.calls[0][0];
        expect(JSON.stringify(payload)).not.toContain("Password!123");
        expect(JSON.stringify(payload)).not.toContain("123456");
        expect(JSON.stringify(payload)).not.toContain("payment-ref");
        expect(payload.metadata.password).toBe("[REDACTED]");
        expect((0, activity_service_1.redactAuditValue)({ jwt: "secret" }).jwt).toBe("[REDACTED]");
    });
    it("marks modified audit records as failing integrity verification", async () => {
        let created;
        jest.spyOn(activity_repository_1.ActivityRepository, "create").mockImplementation(async (data) => {
            created = data;
            return data;
        });
        await activity_service_1.ActivityService.log("login", "Login successful", { mfa: false });
        jest.spyOn(activity_repository_1.ActivityRepository, "list").mockResolvedValue({
            page: 1, limit: 25, total: 1, pages: 1,
            activities: [{ ...created, description: "Modified after creation" }],
        });
        const result = await activity_service_1.ActivityService.list({}, 1, 25);
        expect(result.activities[0].integrityValid).toBe(false);
        expect(result.activities[0].integrityHash).toBeUndefined();
    });
    it("creates near-real-time alerts for repeated login failures", async () => {
        jest.spyOn(activity_repository_1.ActivityRepository, "countRecent").mockResolvedValue(2);
        jest.spyOn(activity_repository_1.ActivityRepository, "create").mockImplementation(async (data) => data);
        const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
        await activity_service_1.ActivityService.log("failed_login", "Login failed", {}, { id: new mongoose_1.Types.ObjectId().toString() });
        expect(mailer_1.sendSecurityAlert).toHaveBeenCalledWith("failed_login", "Login failed");
        expect(warn).toHaveBeenCalled();
    });
    it("denies audit-log access to unauthenticated and non-admin users", async () => {
        const app = (0, express_1.default)();
        app.use("/api/activity", activity_route_1.default);
        expect((await (0, supertest_1.default)(app).get("/api/activity")).status).toBe(401);
        const userId = new mongoose_1.Types.ObjectId().toString();
        const token = jsonwebtoken_1.default.sign({ sub: userId, sv: 0 }, secret);
        jest.spyOn(auth_repository_1.AuthRepository, "findById").mockResolvedValue({
            _id: userId, email: "user@example.com", role: "user", sessionVersion: 0,
        });
        expect((await (0, supertest_1.default)(app).get("/api/activity").set("Authorization", `Bearer ${token}`)).status).toBe(403);
    });
});
//# sourceMappingURL=audit.security.test.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const rateLimit_middleware_1 = __importStar(require("../middleware/rateLimit.middleware"));
describe("Phase 4 abuse protection", () => {
    const originalEnv = process.env;
    beforeEach(() => {
        process.env = { ...originalEnv, NODE_ENV: "test" };
        (0, rateLimit_middleware_1.resetRateLimitStore)();
    });
    afterAll(() => {
        process.env = originalEnv;
    });
    it("blocks after the configured number of failed attempts and supplies Retry-After", async () => {
        const app = (0, express_1.default)();
        app.post("/login", (0, rateLimit_middleware_1.default)({
            windowMs: 60000,
            max: 2,
            keyPrefix: "test-login",
            progressiveDelayMs: 1000,
            countFailuresOnly: true,
        }), (_req, res) => res.status(401).json({ ok: false }));
        expect((await (0, supertest_1.default)(app).post("/login")).status).toBe(401);
        expect((await (0, supertest_1.default)(app).post("/login")).status).toBe(401);
        const blocked = await (0, supertest_1.default)(app).post("/login");
        expect(blocked.status).toBe(429);
        expect(blocked.headers["retry-after"]).toBe("1");
        expect(blocked.body).toMatchObject({ ok: false, retryAfter: 1 });
    });
    it("does not count successful authentication responses as failures", async () => {
        const app = (0, express_1.default)();
        app.post("/login", (0, rateLimit_middleware_1.default)({
            windowMs: 60000,
            max: 1,
            keyPrefix: "successful-login",
            countFailuresOnly: true,
        }), (_req, res) => res.status(200).json({ ok: true }));
        for (let i = 0; i < 5; i += 1) {
            expect((await (0, supertest_1.default)(app).post("/login")).status).toBe(200);
        }
    });
    it("recovers after the configured window", async () => {
        let now = 1000000;
        const nowSpy = jest.spyOn(Date, "now").mockImplementation(() => now);
        const app = (0, express_1.default)();
        app.get("/limited", (0, rateLimit_middleware_1.default)({ windowMs: 1000, max: 1, keyPrefix: "recovery" }), (_req, res) => res.sendStatus(204));
        expect((await (0, supertest_1.default)(app).get("/limited")).status).toBe(204);
        expect((await (0, supertest_1.default)(app).get("/limited")).status).toBe(429);
        now += 1001;
        expect((await (0, supertest_1.default)(app).get("/limited")).status).toBe(204);
        nowSpy.mockRestore();
    });
    it("enforces blocklist and allowlist controls", async () => {
        process.env.IP_BLOCKLIST = "::ffff:127.0.0.1";
        const blockedApp = (0, express_1.default)();
        blockedApp.get("/", (0, rateLimit_middleware_1.default)({ windowMs: 1000, max: 1 }), (_req, res) => res.sendStatus(204));
        expect((await (0, supertest_1.default)(blockedApp).get("/")).status).toBe(403);
        process.env.IP_ALLOWLIST = "::ffff:127.0.0.1";
        const allowedApp = (0, express_1.default)();
        allowedApp.get("/", (0, rateLimit_middleware_1.default)({ windowMs: 1000, max: 0 }), (_req, res) => res.sendStatus(204));
        expect((await (0, supertest_1.default)(allowedApp).get("/")).status).toBe(204);
    });
    it("never includes credentials in blocking events", async () => {
        const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.post("/login", (0, rateLimit_middleware_1.default)({ windowMs: 60000, max: 0, keyPrefix: "redaction" }), (_req, res) => res.sendStatus(204));
        await (0, supertest_1.default)(app).post("/login").send({ email: "student@example.com", password: "NeverLogThis!123" });
        const output = warn.mock.calls.flat().join(" ");
        expect(output).toContain("abuse_block");
        expect(output).not.toContain("NeverLogThis!123");
        expect(output).not.toContain("student@example.com");
        warn.mockRestore();
    });
});
//# sourceMappingURL=rateLimit.security.test.js.map
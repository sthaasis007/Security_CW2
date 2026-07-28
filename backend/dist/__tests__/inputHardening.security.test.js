"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const zod_1 = require("zod");
const validation_middleware_1 = require("../middleware/validation.middleware");
const sanitize_middleware_1 = __importDefault(require("../middleware/sanitize.middleware"));
const upload_middleware_1 = require("../middleware/upload.middleware");
const api_schemas_1 = require("../validation/api.schemas");
describe("Phase 9 input and upload hardening", () => {
    it("rejects malformed and unknown body properties", async () => {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.post("/cart", (0, validation_middleware_1.validate)({ body: api_schemas_1.cartAddBody }), (_req, res) => res.json({ ok: true }));
        const malformed = await (0, supertest_1.default)(app).post("/cart").send({ productId: "not-an-id", quantity: 0 });
        const massAssigned = await (0, supertest_1.default)(app).post("/cart").send({
            productId: "507f1f77bcf86cd799439011", quantity: 1, role: "admin",
        });
        expect(malformed.status).toBe(400);
        expect(massAssigned.status).toBe(400);
    });
    it("removes NoSQL and prototype-pollution keys", async () => {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(sanitize_middleware_1.default);
        app.post("/", (req, res) => res.json(req.body));
        const result = await (0, supertest_1.default)(app).post("/").send({
            email: { $ne: null },
            constructor: { prototype: { polluted: true } },
            safe: " value ",
        });
        expect(result.body).toEqual({ email: {}, safe: "value" });
        expect({}.polluted).toBeUndefined();
    });
    it("caps pagination and rejects unknown query parameters", () => {
        expect(api_schemas_1.activityQuery.safeParse({ page: "1", limit: "100" }).success).toBe(true);
        expect(api_schemas_1.activityQuery.safeParse({ page: "0", limit: "101" }).success).toBe(false);
        expect(api_schemas_1.activityQuery.safeParse({ page: "1", limit: "10", role: "admin" }).success).toBe(false);
    });
    it("validates Express 5 read-only query objects without replacing them", async () => {
        const app = (0, express_1.default)();
        app.get("/", (0, validation_middleware_1.validate)({ query: api_schemas_1.activityQuery }), (req, res) => res.json({ page: req.query.page }));
        const valid = await (0, supertest_1.default)(app).get("/?page=2&limit=10");
        const invalid = await (0, supertest_1.default)(app).get("/?page=0&limit=101");
        expect(valid.status).toBe(200);
        expect(valid.body.page).toBe("2");
        expect(invalid.status).toBe(400);
    });
    it("rejects oversized JSON bodies without exposing internals", async () => {
        const app = (0, express_1.default)();
        app.use(express_1.default.json({ limit: "1kb" }));
        app.post("/", (0, validation_middleware_1.validate)({ body: zod_1.z.object({ value: zod_1.z.string() }).strict() }), (_req, res) => res.json({ ok: true }));
        app.use((err, _req, res, _next) => res.status(err?.status === 413 ? 413 : 500).json({ ok: false, message: "Request body is too large" }));
        const result = await (0, supertest_1.default)(app).post("/").send({ value: "x".repeat(2048) });
        expect(result.status).toBe(413);
        expect(result.body).toEqual({ ok: false, message: "Request body is too large" });
    });
    it("uses server filenames and rejects image polyglots", () => {
        const name = (0, upload_middleware_1.generateImageFilename)(".png");
        expect(name).toMatch(/^[0-9a-f-]{36}\.png$/);
        expect(name).not.toContain("..");
        expect(name).not.toContain("evil");
        const polyglot = Buffer.concat([
            Buffer.from([0xff, 0xd8]),
            Buffer.from("<script>alert(1)</script>"),
            Buffer.from([0xff, 0xd9]),
        ]);
        expect((0, upload_middleware_1.imageType)(polyglot)?.mime).toBe("image/jpeg");
        expect((0, upload_middleware_1.containsPolyglotPayload)(polyglot)).toBe(true);
        expect((0, upload_middleware_1.imageType)(Buffer.from("not an image"))).toBeNull();
    });
});
//# sourceMappingURL=inputHardening.security.test.js.map
import express from "express";
import request from "supertest";
import { z } from "zod";
import { validate } from "../middleware/validation.middleware";
import sanitizeMiddleware from "../middleware/sanitize.middleware";
import { containsPolyglotPayload, generateImageFilename, imageType } from "../middleware/upload.middleware";
import { activityQuery, cartAddBody } from "../validation/api.schemas";

describe("Phase 9 input and upload hardening", () => {
  it("rejects malformed and unknown body properties", async () => {
    const app = express();
    app.use(express.json());
    app.post("/cart", validate({ body: cartAddBody }), (_req, res) => res.json({ ok: true }));
    const malformed = await request(app).post("/cart").send({ productId: "not-an-id", quantity: 0 });
    const massAssigned = await request(app).post("/cart").send({
      productId: "507f1f77bcf86cd799439011", quantity: 1, role: "admin",
    });
    expect(malformed.status).toBe(400);
    expect(massAssigned.status).toBe(400);
  });

  it("removes NoSQL and prototype-pollution keys", async () => {
    const app = express();
    app.use(express.json());
    app.use(sanitizeMiddleware);
    app.post("/", (req, res) => res.json(req.body));
    const result = await request(app).post("/").send({
      email: { $ne: null },
      constructor: { prototype: { polluted: true } },
      safe: " value ",
    });
    expect(result.body).toEqual({ email: {}, safe: "value" });
    expect(({} as any).polluted).toBeUndefined();
  });

  it("caps pagination and rejects unknown query parameters", () => {
    expect(activityQuery.safeParse({ page: "1", limit: "100" }).success).toBe(true);
    expect(activityQuery.safeParse({ page: "0", limit: "101" }).success).toBe(false);
    expect(activityQuery.safeParse({ page: "1", limit: "10", role: "admin" }).success).toBe(false);
  });

  it("validates Express 5 read-only query objects without replacing them", async () => {
    const app = express();
    app.get("/", validate({ query: activityQuery }), (req, res) => res.json({ page: req.query.page }));
    const valid = await request(app).get("/?page=2&limit=10");
    const invalid = await request(app).get("/?page=0&limit=101");
    expect(valid.status).toBe(200);
    expect(valid.body.page).toBe("2");
    expect(invalid.status).toBe(400);
  });

  it("rejects oversized JSON bodies without exposing internals", async () => {
    const app = express();
    app.use(express.json({ limit: "1kb" }));
    app.post("/", validate({ body: z.object({ value: z.string() }).strict() }), (_req, res) => res.json({ ok: true }));
    app.use((err: any, _req: any, res: any, _next: any) =>
      res.status(err?.status === 413 ? 413 : 500).json({ ok: false, message: "Request body is too large" }));
    const result = await request(app).post("/").send({ value: "x".repeat(2048) });
    expect(result.status).toBe(413);
    expect(result.body).toEqual({ ok: false, message: "Request body is too large" });
  });

  it("uses server filenames and rejects image polyglots", () => {
    const name = generateImageFilename(".png");
    expect(name).toMatch(/^[0-9a-f-]{36}\.png$/);
    expect(name).not.toContain("..");
    expect(name).not.toContain("evil");

    const polyglot = Buffer.concat([
      Buffer.from([0xff, 0xd8]),
      Buffer.from("<script>alert(1)</script>"),
      Buffer.from([0xff, 0xd9]),
    ]);
    expect(imageType(polyglot)?.mime).toBe("image/jpeg");
    expect(containsPolyglotPayload(polyglot)).toBe(true);
    expect(imageType(Buffer.from("not an image"))).toBeNull();
  });
});

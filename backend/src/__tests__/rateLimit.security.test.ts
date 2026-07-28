import express from "express";
import request from "supertest";
import rateLimit, { resetRateLimitStore } from "../middleware/rateLimit.middleware";

describe("Phase 4 abuse protection", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, NODE_ENV: "test" };
    resetRateLimitStore();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("blocks after the configured number of failed attempts and supplies Retry-After", async () => {
    const app = express();
    app.post("/login", rateLimit({
      windowMs: 60_000,
      max: 2,
      keyPrefix: "test-login",
      progressiveDelayMs: 1_000,
      countFailuresOnly: true,
    }), (_req, res) => res.status(401).json({ ok: false }));

    expect((await request(app).post("/login")).status).toBe(401);
    expect((await request(app).post("/login")).status).toBe(401);
    const blocked = await request(app).post("/login");
    expect(blocked.status).toBe(429);
    expect(blocked.headers["retry-after"]).toBe("1");
    expect(blocked.body).toMatchObject({ ok: false, retryAfter: 1 });
  });

  it("does not count successful authentication responses as failures", async () => {
    const app = express();
    app.post("/login", rateLimit({
      windowMs: 60_000,
      max: 1,
      keyPrefix: "successful-login",
      countFailuresOnly: true,
    }), (_req, res) => res.status(200).json({ ok: true }));

    for (let i = 0; i < 5; i += 1) {
      expect((await request(app).post("/login")).status).toBe(200);
    }
  });

  it("recovers after the configured window", async () => {
    let now = 1_000_000;
    const nowSpy = jest.spyOn(Date, "now").mockImplementation(() => now);
    const app = express();
    app.get("/limited", rateLimit({ windowMs: 1_000, max: 1, keyPrefix: "recovery" }), (_req, res) => res.sendStatus(204));

    expect((await request(app).get("/limited")).status).toBe(204);
    expect((await request(app).get("/limited")).status).toBe(429);
    now += 1_001;
    expect((await request(app).get("/limited")).status).toBe(204);
    nowSpy.mockRestore();
  });

  it("enforces blocklist and allowlist controls", async () => {
    process.env.IP_BLOCKLIST = "::ffff:127.0.0.1";
    const blockedApp = express();
    blockedApp.get("/", rateLimit({ windowMs: 1_000, max: 1 }), (_req, res) => res.sendStatus(204));
    expect((await request(blockedApp).get("/")).status).toBe(403);

    process.env.IP_ALLOWLIST = "::ffff:127.0.0.1";
    const allowedApp = express();
    allowedApp.get("/", rateLimit({ windowMs: 1_000, max: 0 }), (_req, res) => res.sendStatus(204));
    expect((await request(allowedApp).get("/")).status).toBe(204);
  });

  it("never includes credentials in blocking events", async () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    const app = express();
    app.use(express.json());
    app.post("/login", rateLimit({ windowMs: 60_000, max: 0, keyPrefix: "redaction" }), (_req, res) => res.sendStatus(204));

    await request(app).post("/login").send({ email: "student@example.com", password: "NeverLogThis!123" });
    const output = warn.mock.calls.flat().join(" ");
    expect(output).toContain("abuse_block");
    expect(output).not.toContain("NeverLogThis!123");
    expect(output).not.toContain("student@example.com");
    warn.mockRestore();
  });
});

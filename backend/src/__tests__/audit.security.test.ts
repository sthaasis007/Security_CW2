import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import activityRoutes from "../modules/activity/activity.route";
import { ActivityRepository } from "../modules/activity/activity.repository";
import { ActivityService, redactAuditValue } from "../modules/activity/activity.service";
import { AuthRepository } from "../modules/auth/auth.repository";
import { sendSecurityAlert } from "../utils/mailer";

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
    jest.spyOn(ActivityRepository, "countRecent").mockResolvedValue(0);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("recursively redacts credentials, cookies, JWTs, OTPs, reset tokens and payment IDs", async () => {
    const create = jest.spyOn(ActivityRepository, "create").mockImplementation(async data => data as never);
    await ActivityService.log("account_updated", "Bearer hidden-value", {
      password: "Password!123",
      nested: { resetToken: "reset", otpCode: "123456", cookie: "session", pidx: "payment-ref" },
      authorization: "Bearer abc",
    });
    const payload = create.mock.calls[0]![0];
    expect(JSON.stringify(payload)).not.toContain("Password!123");
    expect(JSON.stringify(payload)).not.toContain("123456");
    expect(JSON.stringify(payload)).not.toContain("payment-ref");
    expect(payload.metadata.password).toBe("[REDACTED]");
    expect(redactAuditValue({ jwt: "secret" }).jwt).toBe("[REDACTED]");
  });

  it("marks modified audit records as failing integrity verification", async () => {
    let created: any;
    jest.spyOn(ActivityRepository, "create").mockImplementation(async data => {
      created = data;
      return data as never;
    });
    await ActivityService.log("login", "Login successful", { mfa: false });
    jest.spyOn(ActivityRepository, "list").mockResolvedValue({
      page: 1, limit: 25, total: 1, pages: 1,
      activities: [{ ...created, description: "Modified after creation" }],
    });
    const result = await ActivityService.list({}, 1, 25);
    expect(result.activities[0].integrityValid).toBe(false);
    expect(result.activities[0].integrityHash).toBeUndefined();
  });

  it("creates near-real-time alerts for repeated login failures", async () => {
    jest.spyOn(ActivityRepository, "countRecent").mockResolvedValue(2);
    jest.spyOn(ActivityRepository, "create").mockImplementation(async data => data as never);
    const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    await ActivityService.log("failed_login", "Login failed", {}, { id: new Types.ObjectId().toString() });
    expect(sendSecurityAlert).toHaveBeenCalledWith("failed_login", "Login failed");
    expect(warn).toHaveBeenCalled();
  });

  it("denies audit-log access to unauthenticated and non-admin users", async () => {
    const app = express();
    app.use("/api/activity", activityRoutes);
    expect((await request(app).get("/api/activity")).status).toBe(401);

    const userId = new Types.ObjectId().toString();
    const token = jwt.sign({ sub: userId, sv: 0 }, secret);
    jest.spyOn(AuthRepository, "findById").mockResolvedValue({
      _id: userId, email: "user@example.com", role: "user", sessionVersion: 0,
    } as never);
    expect((await request(app).get("/api/activity").set("Authorization", `Bearer ${token}`)).status).toBe(403);
  });
});

import { PrivacyController } from "../modules/privacy/privacy.controller";
import { PrivacyService } from "../modules/privacy/privacy.service";
import { decryptField, encryptField } from "../utils/fieldEncryption";
import express from "express";
import request from "supertest";
import privacyRoutes from "../modules/privacy/privacy.route";

jest.mock("../modules/privacy/privacy.service", () => ({
  PrivacyService: {
    exportForUser: jest.fn(),
    importProfile: jest.fn(),
    deleteAccount: jest.fn(),
  },
}));
jest.mock("../modules/activity/activity.service", () => ({
  ActivityService: { log: jest.fn().mockResolvedValue({}) },
}));
jest.mock("../utils/file", () => ({ deleteUploadFile: jest.fn() }));

const response = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn();
  res.type = jest.fn().mockReturnValue(res);
  return res;
};

describe("Phase 8 privacy and encryption", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.FIELD_ENCRYPTION_KEY_VERSION = "v1";
    process.env.FIELD_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
  });

  it("exports only the authenticated user's records", async () => {
    (PrivacyService.exportForUser as jest.Mock).mockResolvedValue({ profile: { name: "A" } });
    const req: any = { user: { id: "authenticated-user" }, query: {} };
    const res = response();
    await PrivacyController.exportData(req, res);
    expect(PrivacyService.exportForUser).toHaveBeenCalledWith("authenticated-user");
    expect(res.json).toHaveBeenCalledWith({ profile: { name: "A" } });
  });

  it("rejects unauthenticated export access", async () => {
    const app = express();
    app.use("/api/privacy", privacyRoutes);
    expect((await request(app).get("/api/privacy/export")).status).toBe(401);
    expect(PrivacyService.exportForUser).not.toHaveBeenCalled();
  });

  it("rejects malformed imports", async () => {
    const req: any = { user: { id: "user-1" }, file: { buffer: Buffer.from("{bad") } };
    const res = response();
    await PrivacyController.importData(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(PrivacyService.importProfile).not.toHaveBeenCalled();
  });

  it("rejects role and security fields in imports", async () => {
    const malicious = { profile: { name: "A", role: "admin", mfaEnabled: false } };
    const req: any = { user: { id: "user-1" }, file: { buffer: Buffer.from(JSON.stringify(malicious)) } };
    const res = response();
    await PrivacyController.importData(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(PrivacyService.importProfile).not.toHaveBeenCalled();
  });

  it("detects AES-GCM ciphertext tampering", () => {
    const encrypted = encryptField("private device", "user.deviceInfo");
    expect(decryptField(encrypted, "user.deviceInfo")).toBe("private device");
    const parts = encrypted.split(":");
    parts[4] = Buffer.from("tampered").toString("base64");
    expect(() => decryptField(parts.join(":"), "user.deviceInfo")).toThrow();
  });
});

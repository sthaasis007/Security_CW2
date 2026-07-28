"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const privacy_controller_1 = require("../modules/privacy/privacy.controller");
const privacy_service_1 = require("../modules/privacy/privacy.service");
const fieldEncryption_1 = require("../utils/fieldEncryption");
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const privacy_route_1 = __importDefault(require("../modules/privacy/privacy.route"));
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
    const res = {};
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
        privacy_service_1.PrivacyService.exportForUser.mockResolvedValue({ profile: { name: "A" } });
        const req = { user: { id: "authenticated-user" }, query: {} };
        const res = response();
        await privacy_controller_1.PrivacyController.exportData(req, res);
        expect(privacy_service_1.PrivacyService.exportForUser).toHaveBeenCalledWith("authenticated-user");
        expect(res.json).toHaveBeenCalledWith({ profile: { name: "A" } });
    });
    it("rejects unauthenticated export access", async () => {
        const app = (0, express_1.default)();
        app.use("/api/privacy", privacy_route_1.default);
        expect((await (0, supertest_1.default)(app).get("/api/privacy/export")).status).toBe(401);
        expect(privacy_service_1.PrivacyService.exportForUser).not.toHaveBeenCalled();
    });
    it("rejects malformed imports", async () => {
        const req = { user: { id: "user-1" }, file: { buffer: Buffer.from("{bad") } };
        const res = response();
        await privacy_controller_1.PrivacyController.importData(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(privacy_service_1.PrivacyService.importProfile).not.toHaveBeenCalled();
    });
    it("rejects role and security fields in imports", async () => {
        const malicious = { profile: { name: "A", role: "admin", mfaEnabled: false } };
        const req = { user: { id: "user-1" }, file: { buffer: Buffer.from(JSON.stringify(malicious)) } };
        const res = response();
        await privacy_controller_1.PrivacyController.importData(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(privacy_service_1.PrivacyService.importProfile).not.toHaveBeenCalled();
    });
    it("detects AES-GCM ciphertext tampering", () => {
        const encrypted = (0, fieldEncryption_1.encryptField)("private device", "user.deviceInfo");
        expect((0, fieldEncryption_1.decryptField)(encrypted, "user.deviceInfo")).toBe("private device");
        const parts = encrypted.split(":");
        parts[4] = Buffer.from("tampered").toString("base64");
        expect(() => (0, fieldEncryption_1.decryptField)(parts.join(":"), "user.deviceInfo")).toThrow();
    });
});
//# sourceMappingURL=privacy.security.test.js.map
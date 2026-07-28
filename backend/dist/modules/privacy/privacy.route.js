"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const csrf_middleware_1 = __importDefault(require("../../middleware/csrf.middleware"));
const rateLimit_middleware_1 = __importDefault(require("../../middleware/rateLimit.middleware"));
const privacy_controller_1 = require("./privacy.controller");
const router = (0, express_1.Router)();
const privacyLimit = (0, rateLimit_middleware_1.default)({ windowMs: 60 * 60 * 1000, max: 10, keyPrefix: "privacy" });
const jsonUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 64 * 1024, files: 1 },
    fileFilter: (_req, file, cb) => {
        const valid = file.mimetype === "application/json" && file.originalname.toLowerCase().endsWith(".json");
        if (!valid)
            return cb(new Error("Only JSON files are accepted"));
        cb(null, true);
    },
}).single("file");
const safeJsonUpload = (req, res, next) => jsonUpload(req, res, (error) => error
    ? res.status(400).json({ ok: false, message: error.code === "LIMIT_FILE_SIZE" ? "Import file is too large" : "Invalid import file" })
    : next());
router.get("/export", privacyLimit, auth_middleware_1.default, privacy_controller_1.PrivacyController.exportData);
router.post("/import", privacyLimit, auth_middleware_1.default, csrf_middleware_1.default, safeJsonUpload, privacy_controller_1.PrivacyController.importData);
router.delete("/account", privacyLimit, auth_middleware_1.default, csrf_middleware_1.default, privacy_controller_1.PrivacyController.deleteAccount);
exports.default = router;
//# sourceMappingURL=privacy.route.js.map
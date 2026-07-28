"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingle = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const security_1 = require("../utils/security");
const uploadDir = path_1.default.join(process.cwd(), "backend", "uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const safeExt = allowedExtensions.includes(ext) ? ext : ".bin";
        const baseName = path_1.default.basename(file.originalname, ext).replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 50);
        const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${baseName || "upload"}${safeExt}`;
        cb(null, name);
    },
});
const fileFilter = (_req, file, cb) => {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    const isValidMime = allowedMimeTypes.has(file.mimetype);
    const isValidExt = allowedExtensions.includes(ext);
    const originalName = (file.originalname || "").toLowerCase();
    const hasSuspiciousName = /[<>:"/\\|?*]/.test(originalName) || originalName.includes("..") || originalName.startsWith(".") || !(0, security_1.isSafeFilename)(path_1.default.basename(file.originalname));
    if (!isValidMime || !isValidExt || hasSuspiciousName) {
        cb(new Error("Unsupported file type"));
        return;
    }
    cb(null, true);
};
const uploadSingle = (fieldName = "image") => (0, multer_1.default)({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter,
}).single(fieldName);
exports.uploadSingle = uploadSingle;
exports.default = exports.uploadSingle;
//# sourceMappingURL=upload.middleware.js.map
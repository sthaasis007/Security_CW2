"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingle = exports.generateImageFilename = exports.containsPolyglotPayload = exports.imageType = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const uploadDir = path_1.default.resolve(process.cwd(), "backend", "uploads");
fs_1.default.mkdirSync(uploadDir, { recursive: true });
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const imageType = (buffer) => {
    if (buffer.length < 12)
        return null;
    if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        && buffer.subarray(-8, -4).toString("ascii") === "IEND") {
        return { mime: "image/png", extension: ".png" };
    }
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[buffer.length - 2] === 0xff && buffer[buffer.length - 1] === 0xd9) {
        return { mime: "image/jpeg", extension: ".jpg" };
    }
    const gifHeader = buffer.subarray(0, 6).toString("ascii");
    if ((gifHeader === "GIF87a" || gifHeader === "GIF89a") && buffer[buffer.length - 1] === 0x3b) {
        return { mime: "image/gif", extension: ".gif" };
    }
    if (buffer.subarray(0, 4).toString("ascii") === "RIFF"
        && buffer.subarray(8, 12).toString("ascii") === "WEBP"
        && buffer.readUInt32LE(4) + 8 === buffer.length) {
        return { mime: "image/webp", extension: ".webp" };
    }
    return null;
};
exports.imageType = imageType;
const containsPolyglotPayload = (buffer) => {
    const text = buffer.toString("latin1").toLowerCase();
    return buffer.subarray(0, 2).toString("ascii") === "MZ"
        || ["<script", "<?php", "<html", "<!doctype", "%pdf-"].some((marker) => text.includes(marker));
};
exports.containsPolyglotPayload = containsPolyglotPayload;
const generateImageFilename = (extension) => `${crypto_1.default.randomUUID()}${extension}`;
exports.generateImageFilename = generateImageFilename;
const parser = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE, files: 1, fields: 12, parts: 13 },
}).single("image");
const uploadSingle = (_fieldName = "image") => (req, res, next) => {
    parser(req, res, (error) => {
        if (error) {
            return res.status(400).json({ ok: false, message: error.code === "LIMIT_FILE_SIZE" ? "Upload is too large" : "Invalid upload" });
        }
        if (!req.file)
            return next();
        const detected = (0, exports.imageType)(req.file.buffer);
        if (!detected || detected.mime !== req.file.mimetype || (0, exports.containsPolyglotPayload)(req.file.buffer)) {
            return res.status(400).json({ ok: false, message: "Invalid image content" });
        }
        const filename = (0, exports.generateImageFilename)(detected.extension);
        const destination = path_1.default.resolve(uploadDir, filename);
        if (path_1.default.dirname(destination) !== uploadDir) {
            return res.status(400).json({ ok: false, message: "Invalid upload path" });
        }
        fs_1.default.writeFileSync(destination, req.file.buffer, { flag: "wx" });
        req.file.filename = filename;
        req.file.path = destination;
        delete req.file.buffer;
        next();
    });
};
exports.uploadSingle = uploadSingle;
exports.default = exports.uploadSingle;
//# sourceMappingURL=upload.middleware.js.map
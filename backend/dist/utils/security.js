"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasswordExpiryDays = exports.isSafeFilename = exports.hashSecret = exports.getClientIp = exports.isValidObjectId = exports.sanitizeHtml = exports.sanitizeText = exports.isPasswordStrong = exports.PASSWORD_POLICY = void 0;
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = require("mongoose");
exports.PASSWORD_POLICY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;
const isPasswordStrong = (password) => exports.PASSWORD_POLICY.test(password);
exports.isPasswordStrong = isPasswordStrong;
const sanitizeText = (value) => {
    if (typeof value !== "string")
        return null;
    return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/[<>]/g, "")
        .trim();
};
exports.sanitizeText = sanitizeText;
const sanitizeHtml = (value) => {
    if (typeof value !== "string")
        return "";
    return value
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+=/gi, "")
        .trim();
};
exports.sanitizeHtml = sanitizeHtml;
const isValidObjectId = (value) => typeof value === "string" && mongoose_1.Types.ObjectId.isValid(value);
exports.isValidObjectId = isValidObjectId;
const getClientIp = (req) => {
    const header = req.headers["x-forwarded-for"];
    if (typeof header === "string")
        return header.split(",")[0]?.trim() || "unknown";
    if (Array.isArray(header))
        return header[0] || "unknown";
    return req.ip || req.socket.remoteAddress || "unknown";
};
exports.getClientIp = getClientIp;
const hashSecret = (value) => crypto_1.default.createHash("sha256").update(value).digest("hex");
exports.hashSecret = hashSecret;
const isSafeFilename = (value) => /^[a-zA-Z0-9._-]+$/.test(value) && !value.includes("..") && !value.startsWith(".");
exports.isSafeFilename = isSafeFilename;
const getPasswordExpiryDays = () => Number(process.env.PASSWORD_EXPIRY_DAYS || 90);
exports.getPasswordExpiryDays = getPasswordExpiryDays;
//# sourceMappingURL=security.js.map
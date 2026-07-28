"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = exports.redactAuditValue = void 0;
const crypto_1 = __importDefault(require("crypto"));
const security_1 = require("../../config/security");
const mailer_1 = require("../../utils/mailer");
const activity_repository_1 = require("./activity.repository");
const SECRET_KEY = /(password|passphrase|cookie|authorization|jwt|token|otp|code|secret|credential|api[_-]?key|pidx|payment[_-]?id)/i;
const BEARER_OR_JWT = /\bBearer\s+\S+|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/gi;
const retentionDays = () => Math.min(3650, Math.max(1, Number(process.env.AUDIT_RETENTION_DAYS || 180)));
const integrityKey = () => process.env.AUDIT_LOG_HMAC_KEY?.trim() || (0, security_1.getJwtSecret)();
const redactAuditValue = (value, key = "") => {
    if (SECRET_KEY.test(key))
        return "[REDACTED]";
    if (typeof value === "string")
        return value.replace(BEARER_OR_JWT, "[REDACTED]");
    if (Array.isArray(value))
        return value.map(item => (0, exports.redactAuditValue)(item));
    if (value && typeof value === "object") {
        return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, (0, exports.redactAuditValue)(child, childKey)]));
    }
    return value;
};
exports.redactAuditValue = redactAuditValue;
const stable = (value) => {
    if (value instanceof Date)
        return JSON.stringify(value.toISOString());
    if (value?._bsontype === "ObjectId")
        return JSON.stringify(value.toString());
    if (Array.isArray(value))
        return `[${value.map(stable).join(",")}]`;
    if (value && typeof value === "object") {
        return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
    }
    return JSON.stringify(value);
};
const sign = (payload) => crypto_1.default.createHmac("sha256", integrityKey()).update(stable(payload)).digest("hex");
const classification = (action) => {
    if (/payment/.test(action))
        return "payment";
    if (/admin|role/.test(action))
        return "administration";
    if (/login|logout|register|mfa|password|email/.test(action))
        return "authentication";
    if (/forbidden|unauthorized|authorization/.test(action))
        return "authorization";
    return "account";
};
const shouldAlert = async (action, metadata, userId) => {
    if (action === "failed_login") {
        const count = await activity_repository_1.ActivityRepository.countRecent(action, userId, new Date(Date.now() - 10 * 60 * 1000));
        return count >= 2;
    }
    return action === "admin_created" ||
        action === "payment_anomaly" ||
        (action === "role_changed" && metadata?.newRole === "admin");
};
exports.ActivityService = {
    async log(action, description, metadata = {}, user, req) {
        const timestamp = new Date();
        const cleanMetadata = (0, exports.redactAuditValue)(metadata);
        const userId = user?.id || null;
        const alert = await shouldAlert(action, cleanMetadata, userId);
        const outcome = /failed|denied|forbidden|unauthorized|anomaly/.test(action) ? "failure" : "success";
        const severity = alert ? "critical" : outcome === "failure" ? "warning" : "info";
        const unsigned = {
            action,
            category: classification(action),
            outcome,
            severity,
            description: (0, exports.redactAuditValue)(description || null),
            metadata: cleanMetadata,
            userId,
            username: user?.username || null,
            role: user?.role || null,
            userEmail: user?.email || null,
            ipAddress: req?.ip || req?.socket?.remoteAddress || null,
            userAgent: (0, exports.redactAuditValue)(req?.get?.("user-agent") || null),
            timestamp,
            alert,
            expiresAt: new Date(timestamp.getTime() + retentionDays() * 24 * 60 * 60 * 1000),
        };
        const record = await activity_repository_1.ActivityRepository.create({ ...unsigned, integrityHash: sign(unsigned) });
        if (alert) {
            console.warn(JSON.stringify({ event: "security_alert", action, severity, userId }));
            void (0, mailer_1.sendSecurityAlert)(action, description || "Security alert").catch(() => undefined);
        }
        return record;
    },
    async list(filters, page, limit) {
        const result = await activity_repository_1.ActivityRepository.list(filters, page, limit);
        result.activities = result.activities.map((record) => {
            const { integrityHash, _id, __v, createdAt, updatedAt, ...unsigned } = record;
            const actual = Buffer.from(typeof integrityHash === "string" ? integrityHash : "");
            const expected = Buffer.from(sign(unsigned));
            const integrityValid = actual.length === expected.length && crypto_1.default.timingSafeEqual(actual, expected);
            return { ...record, integrityHash: undefined, integrityValid };
        });
        return result;
    },
};
//# sourceMappingURL=activity.service.js.map
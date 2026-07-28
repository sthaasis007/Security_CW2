"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetRateLimitStore = resetRateLimitStore;
exports.default = rateLimit;
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = __importStar(require("mongoose"));
const memoryStore = new Map();
const abuseSchema = new mongoose_1.Schema({
    key: { type: String, required: true, unique: true, index: true },
    count: { type: Number, required: true },
    firstSeen: { type: Date, required: true },
    blockedUntil: { type: Date, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, { versionKey: false });
const AbuseRecord = mongoose_1.default.models.AbuseRateLimit || mongoose_1.default.model("AbuseRateLimit", abuseSchema);
const csv = (name) => new Set((process.env[name] || "").split(",").map(v => v.trim()).filter(Boolean));
const digest = (value) => crypto_1.default.createHash("sha256").update(value).digest("hex");
const normalizedIp = (req) => req.ip || req.socket.remoteAddress || "unknown";
async function verifyCaptcha(token, ip) {
    const secret = process.env.CAPTCHA_SECRET?.trim();
    if (!secret || !token)
        return false;
    const endpoint = process.env.CAPTCHA_VERIFY_URL || "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const response = await fetch(endpoint, { method: "POST", body, signal: AbortSignal.timeout(5000) });
    if (!response.ok)
        return false;
    const result = await response.json();
    return result.success === true;
}
async function increment(key, now, windowMs) {
    if (process.env.NODE_ENV !== "production" || mongoose_1.default.connection.readyState !== 1) {
        const old = memoryStore.get(key);
        const entry = !old || now - old.firstSeen >= windowMs
            ? { count: 1, firstSeen: now, blockedUntil: 0 }
            : { ...old, count: old.count + 1 };
        memoryStore.set(key, entry);
        return entry;
    }
    const existing = await AbuseRecord.findOne({ key }).lean();
    if (!existing || now - new Date(existing.firstSeen).getTime() >= windowMs) {
        const reset = await AbuseRecord.findOneAndUpdate({ key }, { $set: { count: 1, firstSeen: new Date(now), blockedUntil: new Date(0), expiresAt: new Date(now + windowMs * 2) } }, { upsert: true, new: true, lean: true });
        return { count: reset.count, firstSeen: +reset.firstSeen, blockedUntil: +reset.blockedUntil };
    }
    const updated = await AbuseRecord.findOneAndUpdate({ key }, { $inc: { count: 1 }, $set: { expiresAt: new Date(now + windowMs * 2) } }, { new: true, lean: true });
    return { count: updated.count, firstSeen: +updated.firstSeen, blockedUntil: +updated.blockedUntil };
}
async function current(key, now, windowMs) {
    if (process.env.NODE_ENV !== "production" || mongoose_1.default.connection.readyState !== 1) {
        const entry = memoryStore.get(key);
        return !entry || now - entry.firstSeen >= windowMs
            ? { count: 0, firstSeen: now, blockedUntil: 0 }
            : entry;
    }
    const entry = await AbuseRecord.findOne({ key }).lean();
    return !entry || now - new Date(entry.firstSeen).getTime() >= windowMs
        ? { count: 0, firstSeen: now, blockedUntil: 0 }
        : { count: entry.count, firstSeen: +entry.firstSeen, blockedUntil: +entry.blockedUntil };
}
async function setBlockedUntil(key, blockedUntil) {
    if (process.env.NODE_ENV !== "production" || mongoose_1.default.connection.readyState !== 1) {
        const entry = memoryStore.get(key);
        if (entry)
            entry.blockedUntil = blockedUntil;
        return;
    }
    await AbuseRecord.updateOne({ key }, { $set: { blockedUntil: new Date(blockedUntil) } });
}
function resetRateLimitStore() {
    memoryStore.clear();
}
function rateLimit(options) {
    const { windowMs, max, keyPrefix = "rl", progressiveDelayMs = 1000, captchaAfter = Number.MAX_SAFE_INTEGER, countFailuresOnly = false } = options;
    return async (req, res, next) => {
        try {
            const ip = normalizedIp(req);
            if (csv("IP_ALLOWLIST").has(ip))
                return next();
            if (csv("IP_BLOCKLIST").has(ip)) {
                console.warn(JSON.stringify({ event: "abuse_block", policy: keyPrefix, ip, reason: "ip_blocklist" }));
                return res.status(403).json({ ok: false, message: "Request blocked by security policy." });
            }
            const key = digest(`${keyPrefix}:${ip}:${req.path}`);
            const now = Date.now();
            const entry = countFailuresOnly ? await current(key, now, windowMs) : await increment(key, now, windowMs);
            const captchaEnabled = process.env.NODE_ENV === "production" || Boolean(process.env.CAPTCHA_SECRET?.trim());
            const requiresCaptcha = captchaEnabled && entry.count >= captchaAfter;
            if (requiresCaptcha) {
                const token = String(req.header("X-Captcha-Token") || "");
                if (!await verifyCaptcha(token, ip)) {
                    console.warn(JSON.stringify({ event: "abuse_block", policy: keyPrefix, ip, reason: "captcha_required" }));
                    return res.status(403).json({ ok: false, message: "CAPTCHA verification required.", captchaRequired: true });
                }
            }
            const overLimit = countFailuresOnly ? entry.count >= max : entry.count > max;
            if (entry.blockedUntil > now || overLimit) {
                const excess = Math.max(1, entry.count - max + (countFailuresOnly ? 1 : 0));
                const delay = Math.min(windowMs, progressiveDelayMs * (2 ** Math.min(excess - 1, 8)));
                const blockedUntil = Math.max(entry.blockedUntil, now + delay);
                await setBlockedUntil(key, blockedUntil);
                const retryAfter = Math.max(1, Math.ceil((blockedUntil - now) / 1000));
                res.setHeader("Retry-After", String(retryAfter));
                console.warn(JSON.stringify({ event: "abuse_block", policy: keyPrefix, ip, reason: "rate_limit", retryAfter }));
                return res.status(429).json({ ok: false, message: "Too many requests, please try again later.", retryAfter });
            }
            res.setHeader("RateLimit-Limit", String(max));
            res.setHeader("RateLimit-Remaining", String(Math.max(0, max - entry.count)));
            if (countFailuresOnly) {
                res.once("finish", () => {
                    if (res.statusCode >= 400 && res.statusCode !== 429) {
                        void increment(key, Date.now(), windowMs).catch(() => undefined);
                    }
                });
            }
            return next();
        }
        catch (error) {
            console.error(JSON.stringify({ event: "rate_limit_error", policy: keyPrefix }));
            return res.status(503).json({ ok: false, message: "Security service temporarily unavailable." });
        }
    };
}
//# sourceMappingURL=rateLimit.middleware.js.map
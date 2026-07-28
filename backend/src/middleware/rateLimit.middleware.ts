import crypto from "crypto";
import mongoose, { Schema } from "mongoose";
import { NextFunction, Request, Response } from "express";

type Entry = { count: number; firstSeen: number; blockedUntil: number };
type Options = {
  windowMs: number;
  max: number;
  keyPrefix?: string;
  progressiveDelayMs?: number;
  captchaAfter?: number;
  countFailuresOnly?: boolean;
};

const memoryStore = new Map<string, Entry>();
const abuseSchema = new Schema({
  key: { type: String, required: true, unique: true, index: true },
  count: { type: Number, required: true },
  firstSeen: { type: Date, required: true },
  blockedUntil: { type: Date, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, { versionKey: false });
const AbuseRecord: mongoose.Model<any> =
  (mongoose.models.AbuseRateLimit as mongoose.Model<any>) || mongoose.model("AbuseRateLimit", abuseSchema);

const csv = (name: string) => new Set((process.env[name] || "").split(",").map(v => v.trim()).filter(Boolean));
const digest = (value: string) => crypto.createHash("sha256").update(value).digest("hex");
const normalizedIp = (req: Request) => req.ip || req.socket.remoteAddress || "unknown";

async function verifyCaptcha(token: string, ip: string) {
  const secret = process.env.CAPTCHA_SECRET?.trim();
  if (!secret || !token) return false;
  const endpoint = process.env.CAPTCHA_VERIFY_URL || "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const body = new URLSearchParams({ secret, response: token, remoteip: ip });
  const response = await fetch(endpoint, { method: "POST", body, signal: AbortSignal.timeout(5000) });
  if (!response.ok) return false;
  const result = await response.json() as { success?: boolean };
  return result.success === true;
}

async function increment(key: string, now: number, windowMs: number): Promise<Entry> {
  if (process.env.NODE_ENV !== "production" || mongoose.connection.readyState !== 1) {
    const old = memoryStore.get(key);
    const entry = !old || now - old.firstSeen >= windowMs
      ? { count: 1, firstSeen: now, blockedUntil: 0 }
      : { ...old, count: old.count + 1 };
    memoryStore.set(key, entry);
    return entry;
  }

  const existing = await AbuseRecord.findOne({ key }).lean() as any;
  if (!existing || now - new Date(existing.firstSeen).getTime() >= windowMs) {
    const reset = await AbuseRecord.findOneAndUpdate(
      { key },
      { $set: { count: 1, firstSeen: new Date(now), blockedUntil: new Date(0), expiresAt: new Date(now + windowMs * 2) } },
      { upsert: true, new: true, lean: true }
    ) as any;
    return { count: reset.count, firstSeen: +reset.firstSeen, blockedUntil: +reset.blockedUntil };
  }
  const updated = await AbuseRecord.findOneAndUpdate(
    { key },
    { $inc: { count: 1 }, $set: { expiresAt: new Date(now + windowMs * 2) } },
    { new: true, lean: true }
  ) as any;
  return { count: updated.count, firstSeen: +updated.firstSeen, blockedUntil: +updated.blockedUntil };
}

async function current(key: string, now: number, windowMs: number): Promise<Entry> {
  if (process.env.NODE_ENV !== "production" || mongoose.connection.readyState !== 1) {
    const entry = memoryStore.get(key);
    return !entry || now - entry.firstSeen >= windowMs
      ? { count: 0, firstSeen: now, blockedUntil: 0 }
      : entry;
  }
  const entry = await AbuseRecord.findOne({ key }).lean() as any;
  return !entry || now - new Date(entry.firstSeen).getTime() >= windowMs
    ? { count: 0, firstSeen: now, blockedUntil: 0 }
    : { count: entry.count, firstSeen: +entry.firstSeen, blockedUntil: +entry.blockedUntil };
}

async function setBlockedUntil(key: string, blockedUntil: number) {
  if (process.env.NODE_ENV !== "production" || mongoose.connection.readyState !== 1) {
    const entry = memoryStore.get(key);
    if (entry) entry.blockedUntil = blockedUntil;
    return;
  }
  await AbuseRecord.updateOne({ key }, { $set: { blockedUntil: new Date(blockedUntil) } });
}

export function resetRateLimitStore() {
  memoryStore.clear();
}

export default function rateLimit(options: Options) {
  const { windowMs, max, keyPrefix = "rl", progressiveDelayMs = 1000, captchaAfter = Number.MAX_SAFE_INTEGER, countFailuresOnly = false } = options;
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = normalizedIp(req);
      if (csv("IP_ALLOWLIST").has(ip)) return next();
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
    } catch (error) {
      console.error(JSON.stringify({ event: "rate_limit_error", policy: keyPrefix }));
      return res.status(503).json({ ok: false, message: "Security service temporarily unavailable." });
    }
  };
}

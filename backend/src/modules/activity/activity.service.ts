import crypto from "crypto";
import { getJwtSecret } from "../../config/security";
import { sendSecurityAlert } from "../../utils/mailer";
import { ActivityRepository } from "./activity.repository";

const SECRET_KEY = /(password|passphrase|cookie|authorization|jwt|token|otp|code|secret|credential|api[_-]?key|pidx|payment[_-]?id)/i;
const BEARER_OR_JWT = /\bBearer\s+\S+|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/gi;
const retentionDays = () => Math.min(3650, Math.max(1, Number(process.env.AUDIT_RETENTION_DAYS || 180)));
const integrityKey = () => process.env.AUDIT_LOG_HMAC_KEY?.trim() || getJwtSecret();

export const redactAuditValue = (value: any, key = ""): any => {
  if (SECRET_KEY.test(key)) return "[REDACTED]";
  if (typeof value === "string") return value.replace(BEARER_OR_JWT, "[REDACTED]");
  if (Array.isArray(value)) return value.map(item => redactAuditValue(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, redactAuditValue(child, childKey)]));
  }
  return value;
};

const stable = (value: any): string => {
  if (value instanceof Date) return JSON.stringify(value.toISOString());
  if (value?._bsontype === "ObjectId") return JSON.stringify(value.toString());
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
};

const sign = (payload: Record<string, any>) =>
  crypto.createHmac("sha256", integrityKey()).update(stable(payload)).digest("hex");

const classification = (action: string) => {
  if (/payment/.test(action)) return "payment";
  if (/admin|role/.test(action)) return "administration";
  if (/login|logout|register|mfa|password|email/.test(action)) return "authentication";
  if (/forbidden|unauthorized|authorization/.test(action)) return "authorization";
  return "account";
};

const shouldAlert = async (action: string, metadata: any, userId: string | null) => {
  if (action === "failed_login") {
    const count = await ActivityRepository.countRecent(action, userId, new Date(Date.now() - 10 * 60 * 1000));
    return count >= 2;
  }
  return action === "admin_created" ||
    action === "payment_anomaly" ||
    (action === "role_changed" && metadata?.newRole === "admin");
};

export const ActivityService = {
  async log(action: string, description?: string, metadata: Record<string, any> = {}, user?: { id?: string | null; email?: string | null; username?: string | null; role?: string | null }, req?: any) {
    const timestamp = new Date();
    const cleanMetadata = redactAuditValue(metadata);
    const userId = user?.id || null;
    const alert = await shouldAlert(action, cleanMetadata, userId);
    const outcome = /failed|denied|forbidden|unauthorized|anomaly/.test(action) ? "failure" : "success";
    const severity = alert ? "critical" : outcome === "failure" ? "warning" : "info";
    const unsigned = {
      action,
      category: classification(action),
      outcome,
      severity,
      description: redactAuditValue(description || null),
      metadata: cleanMetadata,
      userId,
      username: user?.username || null,
      role: user?.role || null,
      userEmail: user?.email || null,
      ipAddress: req?.ip || req?.socket?.remoteAddress || null,
      userAgent: redactAuditValue(req?.get?.("user-agent") || null),
      timestamp,
      alert,
      expiresAt: new Date(timestamp.getTime() + retentionDays() * 24 * 60 * 60 * 1000),
    };
    const record = await ActivityRepository.create({ ...unsigned, integrityHash: sign(unsigned) });
    if (alert) {
      console.warn(JSON.stringify({ event: "security_alert", action, severity, userId }));
      void sendSecurityAlert(action, description || "Security alert").catch(() => undefined);
    }
    return record;
  },

  async list(filters: Record<string, any>, page: number, limit: number) {
    const result = await ActivityRepository.list(filters, page, limit);
    result.activities = result.activities.map((record: any) => {
      const { integrityHash, _id, __v, createdAt, updatedAt, ...unsigned } = record;
      const actual = Buffer.from(typeof integrityHash === "string" ? integrityHash : "");
      const expected = Buffer.from(sign(unsigned));
      const integrityValid = actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
      return { ...record, integrityHash: undefined, integrityValid };
    });
    return result;
  },
};

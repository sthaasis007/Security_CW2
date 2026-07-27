import crypto from "crypto";
import { Request } from "express";
import { Types } from "mongoose";

export const PASSWORD_POLICY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

export const isPasswordStrong = (password: string) => PASSWORD_POLICY.test(password);

export const sanitizeText = (value: unknown) => {
  if (typeof value !== "string") return null;
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/[<>]/g, "")
    .trim();
};

export const sanitizeHtml = (value: unknown) => {
  if (typeof value !== "string") return "";
  return value
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
};

export const isValidObjectId = (value: unknown): value is string => typeof value === "string" && Types.ObjectId.isValid(value);

export const getClientIp = (req: Request) => {
  const header = req.headers["x-forwarded-for"];
  if (typeof header === "string") return header.split(",")[0]?.trim() || "unknown";
  if (Array.isArray(header)) return header[0] || "unknown";
  return req.ip || req.socket.remoteAddress || "unknown";
};

export const hashSecret = (value: string) => crypto.createHash("sha256").update(value).digest("hex");

export const isSafeFilename = (value: string) => /^[a-zA-Z0-9._-]+$/.test(value) && !value.includes("..") && !value.startsWith(".");

export const getPasswordExpiryDays = () => Number(process.env.PASSWORD_EXPIRY_DAYS || 90);

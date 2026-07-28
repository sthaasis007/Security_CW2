import { z } from "zod";

const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

export const registerDto = z.object({
  name: z.string().trim().min(1, "Name is required").max(80, "Name is too long"),
  email: z.string().trim().email("Invalid email").max(254, "Email is too long"),
  password: z.string().min(12, "Password must be at least 12 characters").regex(passwordPolicy, "Password must include uppercase, lowercase, number, and special character"),
  confirmPassword: z.string().optional(),
}).strict();

export const loginDto = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
}).strict();

export const forgotPasswordDto = z.object({
  email: z.string().trim().email("Invalid email"),
}).strict();

export const resetPasswordDto = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(12, "Password must be at least 12 characters").regex(passwordPolicy, "Password must include uppercase, lowercase, number, and special character"),
}).strict();

export const tokenDto = z.object({
  token: z.string().trim().min(32, "Invalid token").max(256, "Invalid token"),
}).strict();

export const mfaVerifyDto = z.object({
  challengeToken: z.string().min(1).max(2048),
  code: z.string().trim().min(6).max(20),
}).strict();

export const mfaDisableDto = z.object({
  password: z.string().min(1),
}).strict();

export type RegisterDto = z.infer<typeof registerDto>;
export type LoginDto = z.infer<typeof loginDto>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordDto>;
export type ResetPasswordDto = z.infer<typeof resetPasswordDto>;

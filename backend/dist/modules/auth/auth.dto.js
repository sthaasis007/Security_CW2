"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mfaDisableDto = exports.mfaVerifyDto = exports.resetPasswordDto = exports.forgotPasswordDto = exports.loginDto = exports.registerDto = void 0;
const zod_1 = require("zod");
const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;
exports.registerDto = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, "Name is required").max(80, "Name is too long"),
    email: zod_1.z.string().trim().email("Invalid email").max(254, "Email is too long"),
    password: zod_1.z.string().min(12, "Password must be at least 12 characters").regex(passwordPolicy, "Password must include uppercase, lowercase, number, and special character"),
    confirmPassword: zod_1.z.string().optional(),
}).strict();
exports.loginDto = zod_1.z.object({
    email: zod_1.z.string().trim().email("Invalid email"),
    password: zod_1.z.string().min(1, "Password is required"),
}).strict();
exports.forgotPasswordDto = zod_1.z.object({
    email: zod_1.z.string().trim().email("Invalid email"),
}).strict();
exports.resetPasswordDto = zod_1.z.object({
    token: zod_1.z.string().min(1, "Reset token is required"),
    password: zod_1.z.string().min(12, "Password must be at least 12 characters").regex(passwordPolicy, "Password must include uppercase, lowercase, number, and special character"),
}).strict();
exports.mfaVerifyDto = zod_1.z.object({
    challengeToken: zod_1.z.string().min(1).max(2048),
    code: zod_1.z.string().trim().min(6).max(20),
}).strict();
exports.mfaDisableDto = zod_1.z.object({
    password: zod_1.z.string().min(1),
}).strict();
//# sourceMappingURL=auth.dto.js.map
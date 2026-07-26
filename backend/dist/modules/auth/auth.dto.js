"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordDto = exports.forgotPasswordDto = exports.loginDto = exports.registerDto = void 0;
const zod_1 = require("zod");
const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
exports.registerDto = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, "Name is required"),
    email: zod_1.z.string().trim().email("Invalid email"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters").regex(passwordPolicy, "Password must include uppercase, lowercase, number, and special character"),
});
exports.loginDto = zod_1.z.object({
    email: zod_1.z.string().trim().email("Invalid email"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.forgotPasswordDto = zod_1.z.object({
    email: zod_1.z.string().trim().email("Invalid email"),
});
exports.resetPasswordDto = zod_1.z.object({
    token: zod_1.z.string().min(1, "Reset token is required"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters").regex(passwordPolicy, "Password must include uppercase, lowercase, number, and special character"),
});
//# sourceMappingURL=auth.dto.js.map
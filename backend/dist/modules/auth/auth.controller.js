"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_dto_1 = require("./auth.dto");
const auth_service_1 = require("./auth.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_repository_1 = require("./auth.repository");
const file_1 = require("../../utils/file");
exports.AuthController = {
    async register(req, res) {
        const parsed = auth_dto_1.registerDto.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }
        const result = await auth_service_1.AuthService.register(parsed.data);
        return res.status(result.status).json(result);
    },
    async login(req, res) {
        const parsed = auth_dto_1.loginDto.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }
        const result = await auth_service_1.AuthService.login(parsed.data);
        return res.status(result.status).json(result);
    },
    async forgotPassword(req, res) {
        const parsed = auth_dto_1.forgotPasswordDto.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }
        const result = await auth_service_1.AuthService.requestPasswordReset(parsed.data);
        return res.status(result.status).json(result);
    },
    async resetPassword(req, res) {
        const parsed = auth_dto_1.resetPasswordDto.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }
        const result = await auth_service_1.AuthService.resetPassword(parsed.data);
        return res.status(result.status).json(result);
    },
    async createUser(req, res) {
        try {
            const { name, email, password, role } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ ok: false, message: "Missing fields" });
            }
            const existing = await auth_repository_1.AuthRepository.findByEmail(email);
            if (existing)
                return res.status(409).json({ ok: false, message: "Email exists" });
            const hashed = await bcryptjs_1.default.hash(password, 10);
            const image = req.file ? req.file.filename : undefined;
            const user = await auth_repository_1.AuthRepository.createUser({
                name,
                email,
                password: hashed,
                role: role || "user",
                ...(image ? { image } : {}),
            });
            return res.status(201).json({ ok: true, message: "User created", user: { id: user._id, email: user.email, role: user.role } });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    async getUser(req, res) {
        try {
            const { id } = req.params;
            const user = await auth_repository_1.AuthRepository.findById(id);
            if (!user)
                return res.status(404).json({ ok: false, message: "User not found" });
            return res.status(200).json({ ok: true, user });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const body = req.body;
            const existing = await auth_repository_1.AuthRepository.findById(id);
            if (req.file) {
                body.image = req.file.filename;
            }
            if (body.password) {
                body.password = await bcryptjs_1.default.hash(body.password, 10);
            }
            const updated = await auth_repository_1.AuthRepository.updateUser(id, body);
            if (!updated)
                return res.status(404).json({ ok: false, message: "User not found" });
            if (body.image && existing?.image && existing.image !== body.image) {
                await (0, file_1.deleteUploadFile)(existing.image);
            }
            return res.status(200).json({ ok: true, user: updated });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const currentUser = req.user;
            if (!currentUser?.sub) {
                return res.status(401).json({ ok: false, message: "Unauthorized" });
            }
            if (currentUser.role !== "admin" && currentUser.sub !== id) {
                return res.status(403).json({ ok: false, message: "Forbidden" });
            }
            const deleted = await auth_repository_1.AuthRepository.deleteUser(id);
            if (!deleted)
                return res.status(404).json({ ok: false, message: "User not found" });
            if (deleted.image) {
                await (0, file_1.deleteUploadFile)(deleted.image);
            }
            return res.status(200).json({ ok: true, message: "User deleted" });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
};
//# sourceMappingURL=auth.controller.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_repository_1 = require("../auth/auth.repository");
const file_1 = require("../../utils/file");
const security_1 = require("../../utils/security");
const cookie_1 = require("../../utils/cookie");
exports.AdminController = {
    async create(req, res) {
        try {
            const { name, email, password, role } = req.body;
            const allowedFields = new Set(["name", "email", "password", "role"]);
            if (Object.keys(req.body || {}).some((field) => !allowedFields.has(field))) {
                return res.status(400).json({ ok: false, message: "Unsupported user fields" });
            }
            const normalizedName = typeof name === "string" ? name.trim() : "";
            const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
            if (!normalizedName || normalizedName.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
                return res.status(400).json({ ok: false, message: "Invalid name or email" });
            }
            if (typeof password !== "string" || !(0, security_1.isPasswordStrong)(password)) {
                return res.status(400).json({ ok: false, message: "Password does not meet complexity requirements" });
            }
            if (role !== undefined && role !== "user" && role !== "admin") {
                return res.status(400).json({ ok: false, message: "Invalid role" });
            }
            const existing = await auth_repository_1.AuthRepository.findByEmail(normalizedEmail);
            if (existing)
                return res.status(409).json({ ok: false, message: "Email exists" });
            const hashed = await bcryptjs_1.default.hash(password, 12);
            const image = req.file ? req.file.filename : undefined;
            const user = await auth_repository_1.AuthRepository.createUser({
                name: normalizedName,
                email: normalizedEmail,
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
    async list(_req, res) {
        const users = (await auth_repository_1.AuthRepository.findAll()) ?? [];
        return res.status(200).json({ ok: true, users });
    },
    async get(req, res) {
        const { id } = req.params;
        if (!id || !(0, security_1.isValidObjectId)(id)) {
            return res.status(400).json({ ok: false, message: "Invalid user id" });
        }
        const user = await auth_repository_1.AuthRepository.findById(id);
        if (!user)
            return res.status(404).json({ ok: false, message: "User not found" });
        return res.status(200).json({ ok: true, user });
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            if (!id || !(0, security_1.isValidObjectId)(id)) {
                return res.status(400).json({ ok: false, message: "Invalid user id" });
            }
            const allowedFields = new Set(["name", "email", "password", "role"]);
            if (Object.keys(req.body || {}).some((field) => !allowedFields.has(field))) {
                return res.status(400).json({ ok: false, message: "Unsupported user fields" });
            }
            const body = {};
            if (req.body?.name !== undefined) {
                if (typeof req.body.name !== "string" || !req.body.name.trim() || req.body.name.trim().length > 80) {
                    return res.status(400).json({ ok: false, message: "Invalid name" });
                }
                body.name = req.body.name.trim();
            }
            if (req.body?.email !== undefined) {
                const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
                    return res.status(400).json({ ok: false, message: "Invalid email" });
                }
                body.email = email;
            }
            if (req.body?.role !== undefined) {
                if (req.body.role !== "user" && req.body.role !== "admin") {
                    return res.status(400).json({ ok: false, message: "Invalid role" });
                }
                body.role = req.body.role;
            }
            const existing = await auth_repository_1.AuthRepository.findById(id);
            if (req.file) {
                body.image = req.file.filename;
            }
            // don't allow password update here unless explicitly provided
            if (req.body?.password !== undefined) {
                if (typeof req.body.password !== "string" || !(0, security_1.isPasswordStrong)(req.body.password)) {
                    return res.status(400).json({ ok: false, message: "Password does not meet complexity requirements" });
                }
                body.password = await bcryptjs_1.default.hash(req.body.password, 12);
            }
            const updated = await auth_repository_1.AuthRepository.updateUser(id, body);
            if (!updated)
                return res.status(404).json({ ok: false, message: "User not found" });
            if (body.password || (body.role && body.role !== existing?.role)) {
                await auth_repository_1.AuthRepository.invalidateSessions(id);
                if (req.user?.id === id)
                    (0, cookie_1.clearSessionCookies)(res);
            }
            if (body.image && existing?.image && existing.image !== body.image) {
                await (0, file_1.deleteUploadFile)(existing.image);
            }
            return res.status(200).json({ ok: true, user: updated });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    async remove(req, res) {
        const { id } = req.params;
        if (!id || !(0, security_1.isValidObjectId)(id)) {
            return res.status(400).json({ ok: false, message: "Invalid user id" });
        }
        const deleted = await auth_repository_1.AuthRepository.deleteUser(id);
        if (!deleted)
            return res.status(404).json({ ok: false, message: "User not found" });
        if (deleted.image) {
            await (0, file_1.deleteUploadFile)(deleted.image);
        }
        return res.status(200).json({ ok: true, message: "User deleted" });
    },
};
exports.default = exports.AdminController;
//# sourceMappingURL=admin.controller.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_repository_1 = require("../auth/auth.repository");
const file_1 = require("../../utils/file");
exports.AdminController = {
    async create(req, res) {
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
    async list(_req, res) {
        const users = await auth_repository_1.AuthRepository.findAll();
        return res.status(200).json({ ok: true, users });
    },
    async get(req, res) {
        const { id } = req.params;
        const user = await auth_repository_1.AuthRepository.findById(id);
        if (!user)
            return res.status(404).json({ ok: false, message: "User not found" });
        return res.status(200).json({ ok: true, user });
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            const body = req.body;
            const existing = await auth_repository_1.AuthRepository.findById(id);
            if (req.file) {
                body.image = req.file.filename;
            }
            // don't allow password update here unless explicitly provided
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
    async remove(req, res) {
        const { id } = req.params;
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
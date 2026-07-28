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
const activity_service_1 = require("../activity/activity.service");
const security_1 = require("../../utils/security");
exports.AuthController = {
    async register(req, res) {
        const parsed = auth_dto_1.registerDto.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }
        const { confirmPassword, ...safeData } = parsed.data;
        if (confirmPassword !== undefined && confirmPassword !== safeData.password) {
            return res.status(400).json({ ok: false, message: "Passwords do not match" });
        }
        const result = await auth_service_1.AuthService.register(safeData);
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
        // Set refresh token as secure httpOnly cookie for session management (backwards compatible: still return tokens in body)
        if (result.ok && result.refreshToken) {
            const secureFlag = process.env.NODE_ENV === "production";
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: secureFlag,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            if (result.csrfToken) {
                // set readable csrf cookie for double-submit pattern
                res.cookie("XSRF-TOKEN", result.csrfToken, { httpOnly: false, secure: secureFlag, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 });
            }
        }
        return res.status(result.status).json(result);
    },
    async logout(req, res) {
        try {
            const currentUser = req.user;
            if (!currentUser?.id && !currentUser?.sub) {
                return res.status(401).json({ ok: false, message: "Unauthorized" });
            }
            const result = await auth_service_1.AuthService.logout((currentUser.id || currentUser.sub), req);
            // clear refresh token cookie on logout
            const secureFlag = process.env.NODE_ENV === 'production';
            res.clearCookie('refreshToken', { httpOnly: true, secure: secureFlag, sameSite: 'strict' });
            res.clearCookie('XSRF-TOKEN', { httpOnly: false, secure: secureFlag, sameSite: 'strict' });
            return res.status(result.status).json(result);
        }
        catch (err) {
            console.error('AuthController.logout error', err);
            return res.status(500).json({ ok: false, message: "Server error" });
        }
    },
    async refreshToken(req, res) {
        try {
            // read refresh token from cookie if present, otherwise fall back to body
            const cookieHeader = req.headers.cookie || "";
            const parseCookie = (header, name) => {
                if (!header)
                    return null;
                const parts = header.split(';').map(p => p.trim());
                for (const p of parts) {
                    const [k, v] = p.split('=');
                    if (k === name)
                        return decodeURIComponent(v || '');
                }
                return null;
            };
            const raw = parseCookie(cookieHeader, 'refreshToken') || (req.body && req.body.refreshToken) || null;
            const result = await auth_service_1.AuthService.rotateRefreshToken(raw);
            if (!result.ok) {
                return res.status(result.status).json(result);
            }
            // set new refresh token in secure httpOnly cookie
            const secureFlag = process.env.NODE_ENV === 'production';
            res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: secureFlag, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
            if (result.csrfToken) {
                res.cookie('XSRF-TOKEN', result.csrfToken, { httpOnly: false, secure: secureFlag, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
            }
            // return access token and user
            return res.status(200).json({ ok: true, accessToken: result.accessToken, user: result.user });
        }
        catch (err) {
            console.error('AuthController.refreshToken error', err);
            return res.status(500).json({ ok: false, message: 'Server error' });
        }
    },
    async createUser(req, res) {
        try {
            const { name, email, password, role } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ ok: false, message: "Missing fields" });
            }
            if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
                return res.status(400).json({ ok: false, message: "Invalid fields" });
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ ok: false, message: "Invalid email format" });
            }
            if (!(0, security_1.isPasswordStrong)(password)) {
                return res.status(400).json({ ok: false, message: "Password does not meet complexity requirements" });
            }
            const existing = await auth_repository_1.AuthRepository.findByEmail(email);
            if (existing)
                return res.status(409).json({ ok: false, message: "Email exists" });
            const hashed = await bcryptjs_1.default.hash(password, 12);
            const image = req.file ? req.file.filename : undefined;
            if (image && !(0, security_1.isSafeFilename)(image)) {
                return res.status(400).json({ ok: false, message: "Invalid upload filename" });
            }
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
            console.error('AuthController.createUser error', err);
            return res.status(500).json({ ok: false, message: "Server error" });
        }
    },
    async getUser(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== "string") {
                return res.status(400).json({ ok: false, message: "Invalid user id" });
            }
            const user = await auth_repository_1.AuthRepository.findById(id);
            if (!user)
                return res.status(404).json({ ok: false, message: "User not found" });
            const safeUser = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
            };
            return res.status(200).json({ ok: true, user: safeUser });
        }
        catch (err) {
            console.error('AuthController.getUser error', err);
            return res.status(500).json({ ok: false, message: "Server error" });
        }
    },
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== "string" || !(0, security_1.isValidObjectId)(id)) {
                return res.status(400).json({ ok: false, message: "Invalid user id" });
            }
            const body = { ...req.body };
            if (body.password) {
                if (!(0, security_1.isPasswordStrong)(body.password)) {
                    return res.status(400).json({ ok: false, message: "Password does not meet complexity requirements" });
                }
            }
            const existing = await auth_repository_1.AuthRepository.findById(id);
            if (req.file) {
                body.image = req.file.filename;
            }
            if (body.password) {
                // Prevent reuse of recent passwords
                const existingUser = await auth_repository_1.AuthRepository.findById(id);
                if (existingUser) {
                    const history = existingUser.passwordHistory || [];
                    // compare new password against current and history
                    const reuseChecks = [];
                    reuseChecks.push(bcryptjs_1.default.compare(body.password, existingUser.password));
                    for (const h of history.slice(0, 5)) {
                        if (h && h.hash)
                            reuseChecks.push(bcryptjs_1.default.compare(body.password, h.hash));
                    }
                    const results = await Promise.all(reuseChecks);
                    if (results.some((r) => r)) {
                        return res.status(400).json({ ok: false, message: "New password must not match recent passwords" });
                    }
                }
                body.password = await bcryptjs_1.default.hash(body.password, 12);
            }
            const updated = await auth_repository_1.AuthRepository.updateUser(id, body);
            if (!updated)
                return res.status(404).json({ ok: false, message: "User not found" });
            const safeUser = {
                id: updated._id,
                name: updated.name,
                email: updated.email,
                role: updated.role,
                image: updated.image,
            };
            await activity_service_1.ActivityService.log("profile_update", "User profile updated", { updatedFields: Object.keys(body) }, {
                id: updated._id?.toString() || null,
                email: updated.email || null,
                username: updated.name || null,
                role: updated.role || null,
            }, req);
            if (body.image && existing?.image && existing.image !== body.image) {
                await (0, file_1.deleteUploadFile)(existing.image);
            }
            return res.status(200).json({ ok: true, user: safeUser });
        }
        catch (err) {
            console.error('AuthController.updateUser error', err);
            return res.status(500).json({ ok: false, message: "Server error" });
        }
    },
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const currentUser = req.user;
            if (!id || typeof id !== "string" || !(0, security_1.isValidObjectId)(id)) {
                return res.status(400).json({ ok: false, message: "Invalid user id" });
            }
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
            console.error('AuthController.deleteUser error', err);
            return res.status(500).json({ ok: false, message: "Server error" });
        }
    },
};
//# sourceMappingURL=auth.controller.js.map
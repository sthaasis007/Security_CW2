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
const cookie_1 = require("../../utils/cookie");
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
        if (result.ok && result.accessToken && result.refreshToken && result.csrfToken) {
            if (!result.accessToken || !result.refreshToken || !result.csrfToken) {
                (0, cookie_1.clearSessionCookies)(res);
                return res.status(500).json({ ok: false, message: "Session creation failed" });
            }
            (0, cookie_1.setSessionCookies)(res, {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                csrfToken: result.csrfToken,
            });
        }
        return res.status(result.status).json({
            ok: result.ok,
            message: result.message,
            user: result.user,
        });
    },
    async logout(req, res) {
        try {
            const currentUser = req.user;
            if (!currentUser?.id && !currentUser?.sub) {
                return res.status(401).json({ ok: false, message: "Unauthorized" });
            }
            const result = await auth_service_1.AuthService.logout((currentUser.id || currentUser.sub), req);
            (0, cookie_1.clearSessionCookies)(res);
            return res.status(result.status).json(result);
        }
        catch (err) {
            console.error('AuthController.logout error', err);
            return res.status(500).json({ ok: false, message: "Server error" });
        }
    },
    async refreshToken(req, res) {
        try {
            const raw = (0, cookie_1.readCookie)(req, cookie_1.REFRESH_COOKIE);
            const result = await auth_service_1.AuthService.rotateRefreshToken(raw);
            if (!result.ok) {
                (0, cookie_1.clearSessionCookies)(res);
                return res.status(result.status).json(result);
            }
            if (!result.accessToken || !result.refreshToken || !result.csrfToken) {
                (0, cookie_1.clearSessionCookies)(res);
                return res.status(500).json({ ok: false, message: "Session creation failed" });
            }
            (0, cookie_1.setSessionCookies)(res, {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                csrfToken: result.csrfToken,
            });
            return res.status(200).json({ ok: true, user: result.user });
        }
        catch (err) {
            console.error('AuthController.refreshToken error', err);
            return res.status(500).json({ ok: false, message: 'Server error' });
        }
    },
    async session(req, res) {
        res.setHeader("Cache-Control", "no-store");
        const currentUser = req.user;
        return res.status(200).json({
            ok: true,
            user: {
                id: currentUser.id,
                name: currentUser.username,
                email: currentUser.email,
                role: currentUser.role,
            },
        });
    },
    async logoutAll(req, res) {
        const currentUser = req.user;
        const userId = currentUser.id || currentUser.sub;
        if (!userId)
            return res.status(401).json({ ok: false, message: "Unauthorized" });
        await auth_repository_1.AuthRepository.invalidateSessions(userId);
        (0, cookie_1.clearSessionCookies)(res);
        return res.status(200).json({ ok: true, message: "All sessions invalidated" });
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
            const submittedFields = Object.keys(req.body || {});
            const allowedFields = new Set(["name", "email", "password"]);
            if (submittedFields.some((field) => !allowedFields.has(field))) {
                return res.status(400).json({ ok: false, message: "Unsupported profile fields" });
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
            if (req.body?.password !== undefined) {
                if (typeof req.body.password !== "string") {
                    return res.status(400).json({ ok: false, message: "Invalid password" });
                }
                body.password = req.body.password;
            }
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
            if (body.password) {
                await auth_repository_1.AuthRepository.invalidateSessions(id);
                (0, cookie_1.clearSessionCookies)(res);
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
            if (currentUser.sub === id)
                (0, cookie_1.clearSessionCookies)(res);
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
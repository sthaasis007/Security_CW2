"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_dto_1 = require("./auth.dto");
const auth_service_1 = require("./auth.service");
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
        if (result.mfaRequired) {
            return res.status(result.status).json({
                ok: true,
                mfaRequired: true,
                challengeToken: result.challengeToken,
                message: result.message,
            });
        }
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
            code: result.code,
            user: result.user,
        });
    },
    async forgotPassword(req, res) {
        const parsed = auth_dto_1.forgotPasswordDto.safeParse(req.body);
        if (!parsed.success)
            return res.status(202).json({ ok: true, message: "If the address is eligible, an email will be sent shortly." });
        const result = await auth_service_1.AuthService.forgotPassword(parsed.data);
        return res.status(result.status).json(result);
    },
    async resetPassword(req, res) {
        const parsed = auth_dto_1.resetPasswordDto.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ ok: false, message: "Invalid reset request" });
        const result = await auth_service_1.AuthService.resetPassword(parsed.data);
        if (result.ok)
            (0, cookie_1.clearSessionCookies)(res);
        return res.status(result.status).json(result);
    },
    async verifyEmail(req, res) {
        const parsed = auth_dto_1.tokenDto.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ ok: false, message: "Invalid verification link" });
        const result = await auth_service_1.AuthService.verifyEmail(parsed.data.token);
        return res.status(result.status).json(result);
    },
    async resendVerification(req, res) {
        const parsed = auth_dto_1.forgotPasswordDto.safeParse(req.body);
        if (!parsed.success)
            return res.status(202).json({ ok: true, message: "If the address is eligible, an email will be sent shortly." });
        const result = await auth_service_1.AuthService.resendVerification(parsed.data);
        return res.status(result.status).json(result);
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
    async verifyLoginMfa(req, res) {
        const parsed = auth_dto_1.mfaVerifyDto.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ ok: false, message: "Invalid MFA request" });
        const result = await auth_service_1.AuthService.verifyLoginMfa(parsed.data.challengeToken, parsed.data.code);
        if (!result.ok || !result.accessToken || !result.refreshToken || !result.csrfToken) {
            return res.status(result.status).json({ ok: false, message: result.message });
        }
        (0, cookie_1.setSessionCookies)(res, result);
        return res.status(200).json({ ok: true, message: result.message, user: result.user });
    },
    async beginMfaSetup(req, res) {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ ok: false, message: "Unauthorized" });
        const result = await auth_service_1.AuthService.beginMfaSetup(userId);
        return res.status(result.status).json(result);
    },
    async confirmMfaSetup(req, res) {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ ok: false, message: "Unauthorized" });
        const parsed = auth_dto_1.mfaVerifyDto.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ ok: false, message: "Invalid MFA request" });
        const result = await auth_service_1.AuthService.confirmMfaSetup(userId, parsed.data.challengeToken, parsed.data.code);
        return res.status(result.status).json(result);
    },
    async disableMfa(req, res) {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ ok: false, message: "Unauthorized" });
        const parsed = auth_dto_1.mfaDisableDto.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ ok: false, message: "Password is required" });
        const result = await auth_service_1.AuthService.disableMfa(userId, parsed.data.password);
        if (result.ok)
            (0, cookie_1.clearSessionCookies)(res);
        return res.status(result.status).json(result);
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
                mfaEnabled: Boolean(user.mfaEnabled),
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
            if (!existing)
                return res.status(404).json({ ok: false, message: "User not found" });
            if (req.file) {
                body.image = req.file.filename;
            }
            if (body.password) {
                const passwordResult = await auth_service_1.AuthService.changePassword(existing, body.password);
                if (!passwordResult.ok)
                    return res.status(passwordResult.status).json(passwordResult);
                delete body.password;
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
                mfaEnabled: Boolean(updated.mfaEnabled),
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
            if (req.body?.password) {
                (0, cookie_1.clearSessionCookies)(res);
            }
            if (body.email && body.email !== existing?.email) {
                await auth_repository_1.AuthRepository.markEmailUnverified(id);
                await auth_repository_1.AuthRepository.invalidateSessions(id);
                (0, cookie_1.clearSessionCookies)(res);
                void auth_service_1.AuthService.resendVerification({ email: body.email });
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
            await activity_service_1.ActivityService.log("account_deleted", "Account deleted", { targetUserId: id }, {
                id: currentUser.sub,
                role: currentUser.role || null,
            }, req);
            return res.status(200).json({ ok: true, message: "User deleted" });
        }
        catch (err) {
            console.error('AuthController.deleteUser error', err);
            return res.status(500).json({ ok: false, message: "Server error" });
        }
    },
};
//# sourceMappingURL=auth.controller.js.map
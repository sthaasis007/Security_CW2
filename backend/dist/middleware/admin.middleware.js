"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_repository_1 = require("../modules/auth/auth.repository");
const security_1 = require("../utils/security");
const security_2 = require("../config/security");
const cookie_1 = require("../utils/cookie");
const activity_service_1 = require("../modules/activity/activity.service");
const deny = async (req, res, status, reason, user) => {
    await activity_service_1.ActivityService.log("authorization_denied", "Administrative access denied", { reason, method: req.method, path: req.path }, user ? { id: user._id?.toString(), email: user.email, username: user.name, role: user.role } : undefined, req).catch(() => undefined);
    return res.status(status).json({ ok: false, message: status === 403 ? "Forbidden: admin only" : "Unauthorized" });
};
const adminOnly = async (req, res, next) => {
    const auth = req.headers.authorization;
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : (0, cookie_1.readCookie)(req, cookie_1.ACCESS_COOKIE);
    if (!token) {
        return deny(req, res, 401, "missing_session");
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, (0, security_2.getJwtSecret)());
        if (!payload.sub || !(0, security_1.isValidObjectId)(payload.sub)) {
            return deny(req, res, 401, "invalid_subject");
        }
        const user = await auth_repository_1.AuthRepository.findById(payload.sub);
        if (!user) {
            return deny(req, res, 401, "unknown_user");
        }
        if ((payload.sv || 0) !== (user.sessionVersion || 0)) {
            return deny(req, res, 401, "invalidated_session", user);
        }
        if (user.role !== "admin") {
            return deny(req, res, 403, "insufficient_role", user);
        }
        req.user = {
            id: payload.sub,
            sub: payload.sub,
            email: user.email,
            username: user.name || null,
            role: user.role,
        };
        next();
    }
    catch (_err) {
        return deny(req, res, 401, "invalid_session");
    }
};
exports.adminOnly = adminOnly;
exports.default = exports.adminOnly;
//# sourceMappingURL=admin.middleware.js.map
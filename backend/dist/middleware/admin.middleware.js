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
const adminOnly = async (req, res, next) => {
    const auth = req.headers.authorization;
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : (0, cookie_1.readCookie)(req, cookie_1.ACCESS_COOKIE);
    if (!token) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, (0, security_2.getJwtSecret)());
        if (!payload.sub || !(0, security_1.isValidObjectId)(payload.sub)) {
            return res.status(401).json({ ok: false, message: "Unauthorized" });
        }
        const user = await auth_repository_1.AuthRepository.findById(payload.sub);
        if (!user) {
            return res.status(401).json({ ok: false, message: "Unauthorized" });
        }
        if ((payload.sv || 0) !== (user.sessionVersion || 0)) {
            return res.status(401).json({ ok: false, message: "Unauthorized" });
        }
        if (user.role !== "admin") {
            return res.status(403).json({ ok: false, message: "Forbidden: admin only" });
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
        return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
};
exports.adminOnly = adminOnly;
exports.default = exports.adminOnly;
//# sourceMappingURL=admin.middleware.js.map
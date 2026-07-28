"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSelfOrAdmin = exports.authOnly = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_repository_1 = require("../modules/auth/auth.repository");
const security_1 = require("../utils/security");
const getJwtSecret = () => (process.env.JWT_SECRET || "change_me_local_secret");
const authOnly = async (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
    const token = auth.split(" ")[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, getJwtSecret());
        if (!payload.sub || !(0, security_1.isValidObjectId)(payload.sub)) {
            return res.status(401).json({ ok: false, message: "Unauthorized" });
        }
        const user = await auth_repository_1.AuthRepository.findById(payload.sub);
        req.user = {
            ...payload,
            id: payload.sub,
            sub: payload.sub,
            username: user?.name || null,
            role: payload.role || user?.role || "user",
        };
        next();
    }
    catch (_err) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
};
exports.authOnly = authOnly;
const requireSelfOrAdmin = async (req, res, next) => {
    const currentUser = req.user;
    const targetId = req.params?.id;
    if (!currentUser?.sub && !currentUser?.id) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
    if (!targetId || !(0, security_1.isValidObjectId)(targetId)) {
        return res.status(400).json({ ok: false, message: "Invalid target id" });
    }
    const requesterId = currentUser?.sub || currentUser?.id;
    if (currentUser?.role === "admin" || requesterId === targetId) {
        return next();
    }
    return res.status(403).json({ ok: false, message: "Forbidden" });
};
exports.requireSelfOrAdmin = requireSelfOrAdmin;
exports.default = exports.authOnly;
//# sourceMappingURL=auth.middleware.js.map
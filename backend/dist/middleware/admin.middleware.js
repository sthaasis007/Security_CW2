"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getJwtSecret = () => (process.env.JWT_SECRET || "change_me_local_secret");
const adminOnly = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
    const token = auth.split(" ")[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, getJwtSecret());
        if (payload.role !== "admin") {
            return res.status(403).json({ ok: false, message: "Forbidden: admin only" });
        }
        // attach user info to request for downstream usage
        req.user = payload;
        next();
    }
    catch (_err) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
};
exports.adminOnly = adminOnly;
exports.default = exports.adminOnly;
//# sourceMappingURL=admin.middleware.js.map
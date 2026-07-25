"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authOnly = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authOnly = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
    const token = auth.split(" ")[1];
    try {
        const secret = (process.env.JWT_SECRET || "change_me_local_secret");
        const payload = jsonwebtoken_1.default.verify(token, secret);
        req.user = payload;
        next();
    }
    catch (_err) {
        return res.status(401).json({ ok: false, message: "Invalid token" });
    }
};
exports.authOnly = authOnly;
exports.default = exports.authOnly;
//# sourceMappingURL=auth.middleware.js.map
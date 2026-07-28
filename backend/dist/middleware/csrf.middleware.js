"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = csrfMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_repository_1 = require("../modules/auth/auth.repository");
// Validate CSRF token for authenticated state-changing requests.
async function csrfMiddleware(req, res, next) {
    const method = req.method.toUpperCase();
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(method))
        return next();
    const token = req.headers["x-csrf-token"] || req.headers["x-xsrf-token"] || null;
    // determine user id from Authorization header if present
    const auth = req.headers.authorization;
    let userId = null;
    try {
        if (auth && auth.startsWith("Bearer ")) {
            const raw = auth.split(" ")[1];
            const secret = (process.env.JWT_SECRET || "change_me_local_secret");
            if (raw) {
                const payload = jsonwebtoken_1.default.verify(raw, secret);
                userId = payload.sub || payload.id || null;
            }
        }
    }
    catch (e) {
        return res.status(401).json({ ok: false, message: "Invalid token" });
    }
    // If request is unauthenticated, skip CSRF validation (we protect authenticated state-changing requests)
    if (!userId)
        return next();
    if (!token)
        return res.status(403).json({ ok: false, message: "Missing CSRF token" });
    try {
        const user = await auth_repository_1.AuthRepository.findById(userId);
        if (!user)
            return res.status(401).json({ ok: false, message: "Unauthorized" });
        const stored = user.csrfTokenHash;
        const expiresAt = user.csrfTokenExpiresAt ? new Date(user.csrfTokenExpiresAt) : null;
        if (!stored || (expiresAt && expiresAt < new Date())) {
            return res.status(403).json({ ok: false, message: "CSRF token not set or expired" });
        }
        const hash = require("crypto").createHash("sha256").update(token).digest("hex");
        if (hash !== stored)
            return res.status(403).json({ ok: false, message: "Invalid CSRF token" });
        next();
    }
    catch (err) {
        console.error("csrfMiddleware error", err);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
}
//# sourceMappingURL=csrf.middleware.js.map
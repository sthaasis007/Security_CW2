"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOwnershipOrAdmin = void 0;
const security_1 = require("../utils/security");
const requireOwnershipOrAdmin = (req, res, next) => {
    const currentUser = req.user;
    const targetId = req.params?.id;
    if (!currentUser?.sub && !currentUser?.id) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
    if (!targetId || !(0, security_1.isValidObjectId)(targetId)) {
        return res.status(400).json({ ok: false, message: "Invalid resource id" });
    }
    const requesterId = currentUser.sub || currentUser.id;
    if (currentUser.role === "admin" || requesterId === targetId) {
        return next();
    }
    return res.status(403).json({ ok: false, message: "Forbidden" });
};
exports.requireOwnershipOrAdmin = requireOwnershipOrAdmin;
exports.default = exports.requireOwnershipOrAdmin;
//# sourceMappingURL=ownership.middleware.js.map
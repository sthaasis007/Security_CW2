"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const upload_middleware_1 = __importDefault(require("../../middleware/upload.middleware"));
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const ownership_middleware_1 = __importDefault(require("../../middleware/ownership.middleware"));
const csrf_middleware_1 = __importDefault(require("../../middleware/csrf.middleware"));
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.AuthController.register);
router.post("/login", auth_controller_1.AuthController.login);
router.post("/logout", auth_middleware_1.default, csrf_middleware_1.default, auth_controller_1.AuthController.logout);
router.post("/refresh", auth_controller_1.AuthController.refreshToken);
router.get("/session", auth_middleware_1.default, auth_controller_1.AuthController.session);
router.post("/logout-all", auth_middleware_1.default, csrf_middleware_1.default, auth_controller_1.AuthController.logoutAll);
// Update user (allow image upload)
router.put("/:id", auth_middleware_1.default, csrf_middleware_1.default, ownership_middleware_1.default, (0, upload_middleware_1.default)("image"), auth_controller_1.AuthController.updateUser);
// Delete user account
router.delete("/:id", auth_middleware_1.default, csrf_middleware_1.default, ownership_middleware_1.default, auth_controller_1.AuthController.deleteUser);
// Get user by id (for profile fetching)
router.get("/:id", auth_middleware_1.default, ownership_middleware_1.default, auth_controller_1.AuthController.getUser);
exports.default = router;
//# sourceMappingURL=auth.route.js.map
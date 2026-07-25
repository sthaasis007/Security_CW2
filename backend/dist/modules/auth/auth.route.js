"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const upload_middleware_1 = __importDefault(require("../../middleware/upload.middleware"));
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.AuthController.register);
router.post("/login", auth_controller_1.AuthController.login);
router.post("/forgot-password", auth_controller_1.AuthController.forgotPassword);
router.post("/reset-password", auth_controller_1.AuthController.resetPassword);
// Create user via FormData (used by admin frontend creation form)
router.post("/user", (0, upload_middleware_1.default)("image"), auth_controller_1.AuthController.createUser);
// Update user (allow image upload)
router.put("/:id", (0, upload_middleware_1.default)("image"), auth_controller_1.AuthController.updateUser);
// Delete user account
router.delete("/:id", auth_middleware_1.default, auth_controller_1.AuthController.deleteUser);
// Get user by id (for profile fetching)
router.get("/:id", auth_controller_1.AuthController.getUser);
exports.default = router;
//# sourceMappingURL=auth.route.js.map
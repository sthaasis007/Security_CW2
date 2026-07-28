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
const rateLimit_middleware_1 = __importDefault(require("../../middleware/rateLimit.middleware"));
const validation_middleware_1 = require("../../middleware/validation.middleware");
const api_schemas_1 = require("../../validation/api.schemas");
const auth_dto_1 = require("./auth.dto");
const router = (0, express_1.Router)();
const authAttemptRateLimit = (0, rateLimit_middleware_1.default)({ windowMs: 15 * 60 * 1000, max: 6, keyPrefix: "auth-attempt", progressiveDelayMs: 1000, captchaAfter: 4, countFailuresOnly: true });
const registrationRateLimit = (0, rateLimit_middleware_1.default)({ windowMs: 60 * 60 * 1000, max: 5, keyPrefix: "registration", progressiveDelayMs: 5000, captchaAfter: 2, countFailuresOnly: true });
const refreshRateLimit = (0, rateLimit_middleware_1.default)({ windowMs: 60 * 1000, max: 20, keyPrefix: "refresh" });
const identityMailRateLimit = (0, rateLimit_middleware_1.default)({ windowMs: 60 * 60 * 1000, max: 5, keyPrefix: "identity-mail", progressiveDelayMs: 5000 });
const tokenVerificationRateLimit = (0, rateLimit_middleware_1.default)({ windowMs: 15 * 60 * 1000, max: 10, keyPrefix: "identity-token" });
const profileUploadRateLimit = (0, rateLimit_middleware_1.default)({ windowMs: 60 * 60 * 1000, max: 10, keyPrefix: "profile-upload" });
const mfaRateLimit = (0, rateLimit_middleware_1.default)({ windowMs: 10 * 60 * 1000, max: 5, keyPrefix: "mfa" });
router.post("/register", registrationRateLimit, (0, validation_middleware_1.validate)({ body: auth_dto_1.registerDto, query: api_schemas_1.emptyQuery }), auth_controller_1.AuthController.register);
router.post("/login", authAttemptRateLimit, (0, validation_middleware_1.validate)({ body: auth_dto_1.loginDto, query: api_schemas_1.emptyQuery }), auth_controller_1.AuthController.login);
router.post("/forgot-password", identityMailRateLimit, (0, validation_middleware_1.validate)({ body: auth_dto_1.forgotPasswordDto, query: api_schemas_1.emptyQuery }), auth_controller_1.AuthController.forgotPassword);
router.post("/reset-password", tokenVerificationRateLimit, (0, validation_middleware_1.validate)({ body: auth_dto_1.resetPasswordDto, query: api_schemas_1.emptyQuery }), auth_controller_1.AuthController.resetPassword);
router.post("/verify-email", tokenVerificationRateLimit, (0, validation_middleware_1.validate)({ body: auth_dto_1.tokenDto, query: api_schemas_1.emptyQuery }), auth_controller_1.AuthController.verifyEmail);
router.post("/resend-verification", identityMailRateLimit, (0, validation_middleware_1.validate)({ body: auth_dto_1.forgotPasswordDto, query: api_schemas_1.emptyQuery }), auth_controller_1.AuthController.resendVerification);
router.post("/mfa/login/verify", mfaRateLimit, (0, validation_middleware_1.validate)({ body: auth_dto_1.mfaVerifyDto, query: api_schemas_1.emptyQuery }), auth_controller_1.AuthController.verifyLoginMfa);
router.post("/mfa/setup", mfaRateLimit, auth_middleware_1.default, csrf_middleware_1.default, (0, validation_middleware_1.validate)({ body: api_schemas_1.emptyObject, query: api_schemas_1.emptyQuery }), auth_controller_1.AuthController.beginMfaSetup);
router.post("/mfa/setup/verify", mfaRateLimit, auth_middleware_1.default, csrf_middleware_1.default, (0, validation_middleware_1.validate)({ body: auth_dto_1.mfaVerifyDto, query: api_schemas_1.emptyQuery }), auth_controller_1.AuthController.confirmMfaSetup);
router.post("/mfa/disable", mfaRateLimit, auth_middleware_1.default, csrf_middleware_1.default, (0, validation_middleware_1.validate)({ body: auth_dto_1.mfaDisableDto, query: api_schemas_1.emptyQuery }), auth_controller_1.AuthController.disableMfa);
router.post("/logout", auth_middleware_1.default, csrf_middleware_1.default, (0, validation_middleware_1.validate)({ body: api_schemas_1.emptyObject, query: api_schemas_1.emptyQuery }), auth_controller_1.AuthController.logout);
router.post("/refresh", refreshRateLimit, (0, validation_middleware_1.validate)({ body: api_schemas_1.emptyObject, query: api_schemas_1.emptyQuery }), auth_controller_1.AuthController.refreshToken);
router.get("/session", auth_middleware_1.default, (0, validation_middleware_1.validate)({ query: api_schemas_1.emptyQuery }), auth_controller_1.AuthController.session);
router.post("/logout-all", auth_middleware_1.default, csrf_middleware_1.default, (0, validation_middleware_1.validate)({ body: api_schemas_1.emptyObject, query: api_schemas_1.emptyQuery }), auth_controller_1.AuthController.logoutAll);
// Update user (allow image upload)
router.put("/:id", profileUploadRateLimit, auth_middleware_1.default, csrf_middleware_1.default, (0, validation_middleware_1.validate)({ params: api_schemas_1.idParams }), ownership_middleware_1.default, (0, upload_middleware_1.default)("image"), (0, validation_middleware_1.validate)({ body: api_schemas_1.profileUpdateBody, query: api_schemas_1.emptyQuery }), auth_controller_1.AuthController.updateUser);
// Delete user account
router.delete("/:id", auth_middleware_1.default, csrf_middleware_1.default, (0, validation_middleware_1.validate)({ params: api_schemas_1.idParams, body: api_schemas_1.emptyObject, query: api_schemas_1.emptyQuery }), ownership_middleware_1.default, auth_controller_1.AuthController.deleteUser);
// Get user by id (for profile fetching)
router.get("/:id", auth_middleware_1.default, (0, validation_middleware_1.validate)({ params: api_schemas_1.idParams, query: api_schemas_1.emptyQuery }), ownership_middleware_1.default, auth_controller_1.AuthController.getUser);
exports.default = router;
//# sourceMappingURL=auth.route.js.map
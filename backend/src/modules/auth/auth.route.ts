import { Router } from "express";
import { AuthController } from "./auth.controller";
import uploadSingle from "../../middleware/upload.middleware";
import authOnly from "../../middleware/auth.middleware";
import requireOwnershipOrAdmin from "../../middleware/ownership.middleware";
import csrfMiddleware from "../../middleware/csrf.middleware";
import rateLimit from "../../middleware/rateLimit.middleware";
import { validate } from "../../middleware/validation.middleware";
import { emptyObject, emptyQuery, idParams, profileUpdateBody } from "../../validation/api.schemas";
import { forgotPasswordDto, loginDto, mfaDisableDto, mfaVerifyDto, registerDto, resetPasswordDto, tokenDto } from "./auth.dto";

const router = Router();
const authAttemptRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 6, keyPrefix: "auth-attempt", progressiveDelayMs: 1000, captchaAfter: 4, countFailuresOnly: true });
const registrationRateLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, keyPrefix: "registration", progressiveDelayMs: 5000, captchaAfter: 2, countFailuresOnly: true });
const refreshRateLimit = rateLimit({ windowMs: 60 * 1000, max: 20, keyPrefix: "refresh" });
const identityMailRateLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, keyPrefix: "identity-mail", progressiveDelayMs: 5000 });
const tokenVerificationRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, keyPrefix: "identity-token" });
const profileUploadRateLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, keyPrefix: "profile-upload" });
const mfaRateLimit = rateLimit({ windowMs: 10 * 60 * 1000, max: 5, keyPrefix: "mfa" });

router.post("/register", registrationRateLimit, validate({ body: registerDto, query: emptyQuery }), AuthController.register);
router.post("/login", authAttemptRateLimit, validate({ body: loginDto, query: emptyQuery }), AuthController.login);
router.post("/forgot-password", identityMailRateLimit, validate({ body: forgotPasswordDto, query: emptyQuery }), AuthController.forgotPassword);
router.post("/reset-password", tokenVerificationRateLimit, validate({ body: resetPasswordDto, query: emptyQuery }), AuthController.resetPassword);
router.post("/verify-email", tokenVerificationRateLimit, validate({ body: tokenDto, query: emptyQuery }), AuthController.verifyEmail);
router.post("/resend-verification", identityMailRateLimit, validate({ body: forgotPasswordDto, query: emptyQuery }), AuthController.resendVerification);
router.post("/mfa/login/verify", mfaRateLimit, validate({ body: mfaVerifyDto, query: emptyQuery }), AuthController.verifyLoginMfa);
router.post("/mfa/setup", mfaRateLimit, authOnly, csrfMiddleware, validate({ body: emptyObject, query: emptyQuery }), AuthController.beginMfaSetup);
router.post("/mfa/setup/verify", mfaRateLimit, authOnly, csrfMiddleware, validate({ body: mfaVerifyDto, query: emptyQuery }), AuthController.confirmMfaSetup);
router.post("/mfa/disable", mfaRateLimit, authOnly, csrfMiddleware, validate({ body: mfaDisableDto, query: emptyQuery }), AuthController.disableMfa);
router.post("/logout", authOnly, csrfMiddleware, validate({ body: emptyObject, query: emptyQuery }), AuthController.logout);
router.post("/refresh", refreshRateLimit, validate({ body: emptyObject, query: emptyQuery }), AuthController.refreshToken);
router.get("/session", authOnly, validate({ query: emptyQuery }), AuthController.session);
router.post("/logout-all", authOnly, csrfMiddleware, validate({ body: emptyObject, query: emptyQuery }), AuthController.logoutAll);

// Update user (allow image upload)
router.put("/:id", profileUploadRateLimit, authOnly, csrfMiddleware, validate({ params: idParams }), requireOwnershipOrAdmin, uploadSingle("image"), validate({ body: profileUpdateBody, query: emptyQuery }), AuthController.updateUser);

// Delete user account
router.delete("/:id", authOnly, csrfMiddleware, validate({ params: idParams, body: emptyObject, query: emptyQuery }), requireOwnershipOrAdmin, AuthController.deleteUser);

// Get user by id (for profile fetching)
router.get("/:id", authOnly, validate({ params: idParams, query: emptyQuery }), requireOwnershipOrAdmin, AuthController.getUser);

export default router;

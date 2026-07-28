import { Router } from "express";
import { AuthController } from "./auth.controller";
import uploadSingle from "../../middleware/upload.middleware";
import authOnly from "../../middleware/auth.middleware";
import requireOwnershipOrAdmin from "../../middleware/ownership.middleware";
import csrfMiddleware from "../../middleware/csrf.middleware";
import rateLimit from "../../middleware/rateLimit.middleware";

const router = Router();
const authAttemptRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 6, keyPrefix: "auth-attempt" });
const mfaRateLimit = rateLimit({ windowMs: 10 * 60 * 1000, max: 5, keyPrefix: "mfa" });

router.post("/register", authAttemptRateLimit, AuthController.register);
router.post("/login", authAttemptRateLimit, AuthController.login);
router.post("/mfa/login/verify", mfaRateLimit, AuthController.verifyLoginMfa);
router.post("/mfa/setup", mfaRateLimit, authOnly, csrfMiddleware, AuthController.beginMfaSetup);
router.post("/mfa/setup/verify", mfaRateLimit, authOnly, csrfMiddleware, AuthController.confirmMfaSetup);
router.post("/mfa/disable", mfaRateLimit, authOnly, csrfMiddleware, AuthController.disableMfa);
router.post("/logout", authOnly, csrfMiddleware, AuthController.logout);
router.post("/refresh", AuthController.refreshToken);
router.get("/session", authOnly, AuthController.session);
router.post("/logout-all", authOnly, csrfMiddleware, AuthController.logoutAll);

// Update user (allow image upload)
router.put("/:id", authOnly, csrfMiddleware, requireOwnershipOrAdmin, uploadSingle("image"), AuthController.updateUser);

// Delete user account
router.delete("/:id", authOnly, csrfMiddleware, requireOwnershipOrAdmin, AuthController.deleteUser);

// Get user by id (for profile fetching)
router.get("/:id", authOnly, requireOwnershipOrAdmin, AuthController.getUser);

export default router;

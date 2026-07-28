import { Router } from "express";
import { AuthController } from "./auth.controller";
import uploadSingle from "../../middleware/upload.middleware";
import authOnly from "../../middleware/auth.middleware";
import requireOwnershipOrAdmin from "../../middleware/ownership.middleware";
import csrfMiddleware from "../../middleware/csrf.middleware";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
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

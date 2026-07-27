import { Router } from "express";
import { AuthController } from "./auth.controller";
import uploadSingle from "../../middleware/upload.middleware";
import authOnly from "../../middleware/auth.middleware";
import requireOwnershipOrAdmin from "../../middleware/ownership.middleware";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", authOnly, AuthController.logout);
router.post("/refresh", AuthController.refreshToken);

// Create user via FormData (used by admin frontend creation form)
router.post("/user", uploadSingle("image"), AuthController.createUser);

// Update user (allow image upload)
router.put("/:id", authOnly, requireOwnershipOrAdmin, uploadSingle("image"), AuthController.updateUser);

// Delete user account
router.delete("/:id", authOnly, requireOwnershipOrAdmin, AuthController.deleteUser);

// Get user by id (for profile fetching)
router.get("/:id", authOnly, requireOwnershipOrAdmin, AuthController.getUser);

export default router;

import { Router } from "express";
import { AuthController } from "./auth.controller";
import uploadSingle from "../../middleware/upload.middleware";
import authOnly from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

// Create user via FormData (used by admin frontend creation form)
router.post("/user", uploadSingle("image"), AuthController.createUser);

// Update user (allow image upload)
router.put("/:id", uploadSingle("image"), AuthController.updateUser);

// Delete user account
router.delete("/:id", authOnly, AuthController.deleteUser);

// Get user by id (for profile fetching)
router.get("/:id", AuthController.getUser);

export default router;

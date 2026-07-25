import { Router } from "express";
import { FavoriteController } from "./favorite.controller";
import authOnly from "../../middleware/auth.middleware";

const router = Router();

// Toggle favorite (add if not favorited, remove if favorited)
router.post("/toggle", authOnly, FavoriteController.toggleFavorite);

// Get all favorites for the logged-in user
router.get("/", authOnly, FavoriteController.getFavorites);

// Check if a product is favorited
router.get("/:productId", authOnly, FavoriteController.isFavorited);

// Add a product to favorites
router.post("/", authOnly, FavoriteController.addFavorite);

// Remove a product from favorites
router.delete("/:productId", authOnly, FavoriteController.removeFavorite);

export default router;

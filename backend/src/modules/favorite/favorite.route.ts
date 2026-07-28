import { Router } from "express";
import { FavoriteController } from "./favorite.controller";
import authOnly from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import { emptyObject, emptyQuery, favoriteBody, productParams } from "../../validation/api.schemas";

const router = Router();

// Toggle favorite (add if not favorited, remove if favorited)
router.post("/toggle", authOnly, validate({ body: favoriteBody, query: emptyQuery }), FavoriteController.toggleFavorite);

// Get all favorites for the logged-in user
router.get("/", authOnly, validate({ query: emptyQuery }), FavoriteController.getFavorites);

// Check if a product is favorited
router.get("/:productId", authOnly, validate({ params: productParams, query: emptyQuery }), FavoriteController.isFavorited);

// Add a product to favorites
router.post("/", authOnly, validate({ body: favoriteBody, query: emptyQuery }), FavoriteController.addFavorite);

// Remove a product from favorites
router.delete("/:productId", authOnly, validate({ params: productParams, body: emptyObject, query: emptyQuery }), FavoriteController.removeFavorite);

export default router;

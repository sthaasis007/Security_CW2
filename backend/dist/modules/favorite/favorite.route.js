"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favorite_controller_1 = require("./favorite.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Toggle favorite (add if not favorited, remove if favorited)
router.post("/toggle", auth_middleware_1.authMiddleware, favorite_controller_1.FavoriteController.toggleFavorite);
// Get all favorites for the logged-in user
router.get("/", auth_middleware_1.authMiddleware, favorite_controller_1.FavoriteController.getFavorites);
// Check if a product is favorited
router.get("/:productId", auth_middleware_1.authMiddleware, favorite_controller_1.FavoriteController.isFavorited);
// Add a product to favorites
router.post("/", auth_middleware_1.authMiddleware, favorite_controller_1.FavoriteController.addFavorite);
// Remove a product from favorites
router.delete("/:productId", auth_middleware_1.authMiddleware, favorite_controller_1.FavoriteController.removeFavorite);
exports.default = router;
//# sourceMappingURL=favorite.route.js.map
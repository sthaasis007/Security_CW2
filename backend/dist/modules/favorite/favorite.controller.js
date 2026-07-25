"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteController = void 0;
const favorite_repository_1 = require("./favorite.repository");
exports.FavoriteController = {
    // Get all favorites for the logged-in user
    async getFavorites(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ ok: false, message: "Unauthorized" });
            }
            const favorites = await favorite_repository_1.FavoriteRepository.getUserFavorites(userId);
            return res.status(200).json({ ok: true, favorites });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    // Add a product to favorites
    async addFavorite(req, res) {
        try {
            const userId = req.user?.id;
            const { productId } = req.body;
            if (!userId) {
                return res.status(401).json({ ok: false, message: "Unauthorized" });
            }
            if (!productId) {
                return res.status(400).json({ ok: false, message: "Product ID is required" });
            }
            // Check if already favorited
            const isFav = await favorite_repository_1.FavoriteRepository.isFavorited(userId, productId);
            if (isFav) {
                return res
                    .status(400)
                    .json({ ok: false, message: "Product already in favorites" });
            }
            const favorite = await favorite_repository_1.FavoriteRepository.addFavorite(userId, productId);
            return res.status(201).json({ ok: true, favorite });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Server error";
            return res.status(500).json({ ok: false, message, err });
        }
    },
    // Remove a product from favorites
    async removeFavorite(req, res) {
        try {
            const userId = req.user?.id;
            const { productId } = req.params;
            if (!userId) {
                return res.status(401).json({ ok: false, message: "Unauthorized" });
            }
            if (!productId) {
                return res.status(400).json({ ok: false, message: "Product ID is required" });
            }
            const result = await favorite_repository_1.FavoriteRepository.removeFavorite(userId, productId);
            return res.status(200).json({ ok: true, result });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    // Toggle favorite
    async toggleFavorite(req, res) {
        try {
            const userId = req.user?.id;
            const { productId } = req.body;
            if (!userId) {
                return res.status(401).json({ ok: false, message: "Unauthorized" });
            }
            if (!productId) {
                return res.status(400).json({ ok: false, message: "Product ID is required" });
            }
            const result = await favorite_repository_1.FavoriteRepository.toggleFavorite(userId, productId);
            return res.status(200).json({ ok: true, ...result });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Server error";
            return res.status(500).json({ ok: false, message, err });
        }
    },
    // Check if a product is favorited
    async isFavorited(req, res) {
        try {
            const userId = req.user?.id;
            const { productId } = req.params;
            if (!userId) {
                return res.status(401).json({ ok: false, message: "Unauthorized" });
            }
            const isFav = await favorite_repository_1.FavoriteRepository.isFavorited(userId, productId);
            return res.status(200).json({ ok: true, isFavorited: isFav });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
};
//# sourceMappingURL=favorite.controller.js.map
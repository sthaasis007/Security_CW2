"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteRepository = void 0;
const favorite_model_1 = require("./favorite.model");
const product_model_1 = require("../product/product.model");
exports.FavoriteRepository = {
    // Get all favorites for a user
    getUserFavorites: (userId) => favorite_model_1.FavoriteModel.find({ userId }).sort({ createdAt: -1 }).lean(),
    // Add a product to favorites
    addFavorite: async (userId, productId) => {
        const product = await product_model_1.ProductModel.findById(productId).lean();
        if (!product) {
            throw new Error("Product not found");
        }
        return favorite_model_1.FavoriteModel.create({
            userId,
            productId,
            productName: product.name,
            productPrice: product.price,
            productDescription: product.description,
            productImage: product.image,
        });
    },
    // Remove a product from favorites
    removeFavorite: (userId, productId) => favorite_model_1.FavoriteModel.deleteOne({ userId, productId }),
    // Check if a product is favorited by a user
    isFavorited: async (userId, productId) => {
        const favorite = await favorite_model_1.FavoriteModel.findOne({ userId, productId }).lean();
        return !!favorite;
    },
    // Toggle favorite
    toggleFavorite: async (userId, productId) => {
        const isFav = await exports.FavoriteRepository.isFavorited(userId, productId);
        if (isFav) {
            return {
                action: "removed",
                result: await exports.FavoriteRepository.removeFavorite(userId, productId),
            };
        }
        else {
            return {
                action: "added",
                result: await exports.FavoriteRepository.addFavorite(userId, productId),
            };
        }
    },
};
//# sourceMappingURL=favorite.repository.js.map
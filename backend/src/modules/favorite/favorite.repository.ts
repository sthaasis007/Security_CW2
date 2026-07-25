import { FavoriteModel } from "./favorite.model";
import { ProductModel } from "../product/product.model";

export const FavoriteRepository = {
  // Get all favorites for a user
  getUserFavorites: (userId: string) =>
    FavoriteModel.find({ userId }).sort({ createdAt: -1 }).lean(),

  // Add a product to favorites
  addFavorite: async (userId: string, productId: string) => {
    const product = await ProductModel.findById(productId).lean();
    if (!product) {
      throw new Error("Product not found");
    }

    return FavoriteModel.create({
      userId,
      productId,
      productName: product.name,
      productPrice: product.price,
      productDescription: product.description || null,
      productImage: product.image || null,
    });
  },

  // Remove a product from favorites
  removeFavorite: (userId: string, productId: string) =>
    FavoriteModel.deleteOne({ userId, productId }),

  // Check if a product is favorited by a user
  isFavorited: async (userId: string, productId: string) => {
    const favorite = await FavoriteModel.findOne({ userId, productId }).lean();
    return !!favorite;
  },

  // Toggle favorite
  toggleFavorite: async (userId: string, productId: string) => {
    const isFav = await FavoriteRepository.isFavorited(userId, productId);
    if (isFav) {
      return {
        action: "removed",
        result: await FavoriteRepository.removeFavorite(userId, productId),
      };
    } else {
      return {
        action: "added",
        result: await FavoriteRepository.addFavorite(userId, productId),
      };
    }
  },
};

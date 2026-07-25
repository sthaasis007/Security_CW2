import { Request, Response } from "express";
import { FavoriteRepository } from "./favorite.repository";

export const FavoriteController = {
  // Get all favorites for the logged-in user
  async getFavorites(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
      }

      const favorites = await FavoriteRepository.getUserFavorites(userId);
      return res.status(200).json({ ok: true, favorites });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  // Add a product to favorites
  async addFavorite(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { productId } = req.body;

      if (!userId) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
      }

      if (!productId) {
        return res.status(400).json({ ok: false, message: "Product ID is required" });
      }

      // Check if already favorited
      const isFav = await FavoriteRepository.isFavorited(userId, productId);
      if (isFav) {
        return res
          .status(400)
          .json({ ok: false, message: "Product already in favorites" });
      }

      const favorite = await FavoriteRepository.addFavorite(userId, productId);
      return res.status(201).json({ ok: true, favorite });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Server error";
      return res.status(500).json({ ok: false, message, err });
    }
  },

  // Remove a product from favorites
  async removeFavorite(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { productId } = req.params;

      if (!userId) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
      }

      if (!productId) {
        return res.status(400).json({ ok: false, message: "Product ID is required" });
      }

      const result = await FavoriteRepository.removeFavorite(userId, productId);
      return res.status(200).json({ ok: true, result });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  // Toggle favorite
  async toggleFavorite(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { productId } = req.body;

      if (!userId) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
      }

      if (!productId) {
        return res.status(400).json({ ok: false, message: "Product ID is required" });
      }

      const result = await FavoriteRepository.toggleFavorite(userId, productId);
      return res.status(200).json({ ok: true, ...result });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Server error";
      return res.status(500).json({ ok: false, message, err });
    }
  },

  // Check if a product is favorited
  async isFavorited(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { productId } = req.params;

      if (!userId) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
      }

      if (!productId) {
        return res.status(400).json({ ok: false, message: "Product ID is required" });
      }

      const isFav = await FavoriteRepository.isFavorited(userId, productId);
      return res.status(200).json({ ok: true, isFavorited: isFav });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },
};

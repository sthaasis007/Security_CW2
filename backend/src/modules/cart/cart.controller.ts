import { Request, Response } from "express";
import { CartRepository } from "./cart.repository";
import { ActivityService } from "../activity/activity.service";
import { ProductRepository } from "../product/product.repository";

export const CartController = {
  async getCart(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

      const cart = await CartRepository.getUserCart(userId);
      return res.status(200).json({ ok: true, cart });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async addItem(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { productId, quantity, selectedSize, selectedColor } = req.body;

      if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });
      if (!productId) return res.status(400).json({ ok: false, message: "Product ID is required" });

      const product = await ProductRepository.findById(productId);
      const cart = await CartRepository.addItem(userId, { productId, quantity, selectedSize, selectedColor });
      await ActivityService.log(
        "add_to_cart",
        `Added ${product?.name || "product"} to cart`,
        { productId, productName: product?.name, quantity },
        { id: userId, email: (req as any).user?.email, username: (req as any).user?.username, role: (req as any).user?.role },
        req
      );
      return res.status(200).json({ ok: true, cart });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Server error";
      return res.status(500).json({ ok: false, message, err });
    }
  },

  async updateItem(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { productId } = req.params;
      const { quantity, selectedSize, selectedColor } = req.body;

      if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });
      if (!productId) return res.status(400).json({ ok: false, message: "Product ID is required" });

      const product = await ProductRepository.findById(productId);
      const cart = await CartRepository.updateItem(userId, productId, { quantity, selectedSize, selectedColor });
      await ActivityService.log(
        "change_cart_quantity",
        `Updated ${product?.name || "product"} quantity to ${quantity}`,
        { productId, productName: product?.name, newQuantity: quantity },
        { id: userId, email: (req as any).user?.email, username: (req as any).user?.username, role: (req as any).user?.role },
        req
      );
      return res.status(200).json({ ok: true, cart });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async removeItem(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { productId } = req.params;

      if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });
      if (!productId) return res.status(400).json({ ok: false, message: "Product ID is required" });

      const product = await ProductRepository.findById(productId);
      const cart = await CartRepository.removeItem(userId, productId);
      await ActivityService.log(
        "remove_from_cart",
        `Removed ${product?.name || "product"} from cart`,
        { productId, productName: product?.name },
        { id: userId, email: (req as any).user?.email, username: (req as any).user?.username, role: (req as any).user?.role },
        req
      );
      return res.status(200).json({ ok: true, cart });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async clearCart(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

      const cart = await CartRepository.clearCart(userId);
      return res.status(200).json({ ok: true, cart });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },
};

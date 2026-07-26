import { CartModel } from "./cart.model";
import { ProductModel } from "../product/product.model";

export const CartRepository = {
  getUserCart: async (userId: string) => {
    const cart = await CartModel.findOne({ userId }).lean();
    return cart || { userId, items: [] };
  },

  addItem: async (userId: string, payload: { productId: string; quantity?: number; selectedSize?: string; selectedColor?: string }) => {
    const product = await ProductModel.findById(payload.productId).lean();
    if (!product) {
      throw new Error("Product not found");
    }

    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = new CartModel({ userId, items: [] });
    }

    const existingItem = cart.items.find((item: any) => item.productId.toString() === payload.productId);
    if (existingItem) {
      existingItem.quantity += payload.quantity || 1;
      existingItem.selectedSize = payload.selectedSize !== undefined ? payload.selectedSize : existingItem.selectedSize ?? null;
      existingItem.selectedColor = payload.selectedColor !== undefined ? payload.selectedColor : existingItem.selectedColor ?? null;
      existingItem.priceSnapshot = product.price;
      existingItem.productName = product.name;
      existingItem.productPrice = product.price;
      existingItem.productDescription = product.description || null;
      existingItem.productImage = product.image || null;
    } else {
      cart.items.push({
        productId: payload.productId,
        quantity: payload.quantity || 1,
        selectedSize: payload.selectedSize || null,
        selectedColor: payload.selectedColor || null,
        priceSnapshot: product.price,
        productName: product.name,
        productPrice: product.price,
        productDescription: product.description || null,
        productImage: product.image || null,
      });
    }

    await cart.save();
    return cart.toObject();
  },

  updateItem: async (userId: string, productId: string, payload: { quantity?: number; selectedSize?: string; selectedColor?: string }) => {
    const cart = await CartModel.findOne({ userId });
    if (!cart) return null;

    const item = cart.items.find((entry: any) => entry.productId.toString() === productId);
    if (!item) return null;

    if (payload.quantity !== undefined) item.quantity = payload.quantity;
    if (payload.selectedSize !== undefined) item.selectedSize = payload.selectedSize;
    if (payload.selectedColor !== undefined) item.selectedColor = payload.selectedColor;

    await cart.save();
    return cart.toObject();
  },

  removeItem: async (userId: string, productId: string) => {
    const cart = await CartModel.findOne({ userId });
    if (!cart) return null;

    const filteredItems = cart.items.filter((item: any) => item.productId.toString() !== productId);
    (cart as any).items = filteredItems;
    await cart.save();
    return cart.toObject();
  },

  clearCart: async (userId: string) => {
    const cart = await CartModel.findOne({ userId });
    if (!cart) return null;

    (cart as any).items = [];
    await cart.save();
    return cart.toObject();
  },
};

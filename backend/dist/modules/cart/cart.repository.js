"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRepository = void 0;
const cart_model_1 = require("./cart.model");
const product_model_1 = require("../product/product.model");
exports.CartRepository = {
    getUserCart: async (userId) => {
        const cart = await cart_model_1.CartModel.findOne({ userId }).lean();
        return cart || { userId, items: [] };
    },
    addItem: async (userId, payload) => {
        const product = await product_model_1.ProductModel.findById(payload.productId).lean();
        if (!product) {
            throw new Error("Product not found");
        }
        let cart = await cart_model_1.CartModel.findOne({ userId });
        if (!cart) {
            cart = new cart_model_1.CartModel({ userId, items: [] });
        }
        const existingItem = cart.items.find((item) => item.productId.toString() === payload.productId);
        if (existingItem) {
            existingItem.quantity += payload.quantity || 1;
            existingItem.selectedSize = payload.selectedSize !== undefined ? payload.selectedSize : existingItem.selectedSize ?? null;
            existingItem.selectedColor = payload.selectedColor !== undefined ? payload.selectedColor : existingItem.selectedColor ?? null;
            existingItem.priceSnapshot = product.price;
            existingItem.productName = product.name;
            existingItem.productPrice = product.price;
            existingItem.productDescription = product.description || null;
            existingItem.productImage = product.image || null;
        }
        else {
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
    updateItem: async (userId, productId, payload) => {
        const cart = await cart_model_1.CartModel.findOne({ userId });
        if (!cart)
            return null;
        const item = cart.items.find((entry) => entry.productId.toString() === productId);
        if (!item)
            return null;
        if (payload.quantity !== undefined)
            item.quantity = payload.quantity;
        if (payload.selectedSize !== undefined)
            item.selectedSize = payload.selectedSize;
        if (payload.selectedColor !== undefined)
            item.selectedColor = payload.selectedColor;
        await cart.save();
        return cart.toObject();
    },
    removeItem: async (userId, productId) => {
        const cart = await cart_model_1.CartModel.findOne({ userId });
        if (!cart)
            return null;
        const filteredItems = cart.items.filter((item) => item.productId.toString() !== productId);
        cart.items = filteredItems;
        await cart.save();
        return cart.toObject();
    },
    clearCart: async (userId) => {
        const cart = await cart_model_1.CartModel.findOne({ userId });
        if (!cart)
            return null;
        cart.items = [];
        await cart.save();
        return cart.toObject();
    },
};
//# sourceMappingURL=cart.repository.js.map
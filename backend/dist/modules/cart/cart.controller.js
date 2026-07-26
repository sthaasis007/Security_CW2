"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const cart_repository_1 = require("./cart.repository");
const activity_service_1 = require("../activity/activity.service");
const product_repository_1 = require("../product/product.repository");
exports.CartController = {
    async getCart(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId)
                return res.status(401).json({ ok: false, message: "Unauthorized" });
            const cart = await cart_repository_1.CartRepository.getUserCart(userId);
            return res.status(200).json({ ok: true, cart });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    async addItem(req, res) {
        try {
            const userId = req.user?.id;
            const { productId, quantity, selectedSize, selectedColor } = req.body;
            if (!userId)
                return res.status(401).json({ ok: false, message: "Unauthorized" });
            if (!productId)
                return res.status(400).json({ ok: false, message: "Product ID is required" });
            const product = await product_repository_1.ProductRepository.findById(productId);
            const cart = await cart_repository_1.CartRepository.addItem(userId, { productId, quantity, selectedSize, selectedColor });
            await activity_service_1.ActivityService.log("add_to_cart", `Added ${product?.name || "product"} to cart`, { productId, productName: product?.name, quantity }, { id: userId, email: req.user?.email, username: req.user?.username, role: req.user?.role }, req);
            return res.status(200).json({ ok: true, cart });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Server error";
            return res.status(500).json({ ok: false, message, err });
        }
    },
    async updateItem(req, res) {
        try {
            const userId = req.user?.id;
            const { productId } = req.params;
            const { quantity, selectedSize, selectedColor } = req.body;
            if (!userId)
                return res.status(401).json({ ok: false, message: "Unauthorized" });
            if (!productId)
                return res.status(400).json({ ok: false, message: "Product ID is required" });
            const product = await product_repository_1.ProductRepository.findById(productId);
            const cart = await cart_repository_1.CartRepository.updateItem(userId, productId, { quantity, selectedSize, selectedColor });
            await activity_service_1.ActivityService.log("change_cart_quantity", `Updated ${product?.name || "product"} quantity to ${quantity}`, { productId, productName: product?.name, newQuantity: quantity }, { id: userId, email: req.user?.email, username: req.user?.username, role: req.user?.role }, req);
            return res.status(200).json({ ok: true, cart });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    async removeItem(req, res) {
        try {
            const userId = req.user?.id;
            const { productId } = req.params;
            if (!userId)
                return res.status(401).json({ ok: false, message: "Unauthorized" });
            if (!productId)
                return res.status(400).json({ ok: false, message: "Product ID is required" });
            const product = await product_repository_1.ProductRepository.findById(productId);
            const cart = await cart_repository_1.CartRepository.removeItem(userId, productId);
            await activity_service_1.ActivityService.log("remove_from_cart", `Removed ${product?.name || "product"} from cart`, { productId, productName: product?.name }, { id: userId, email: req.user?.email, username: req.user?.username, role: req.user?.role }, req);
            return res.status(200).json({ ok: true, cart });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    async clearCart(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId)
                return res.status(401).json({ ok: false, message: "Unauthorized" });
            const cart = await cart_repository_1.CartRepository.clearCart(userId);
            return res.status(200).json({ ok: true, cart });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
};
//# sourceMappingURL=cart.controller.js.map
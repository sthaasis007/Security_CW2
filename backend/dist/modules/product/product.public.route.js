"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_model_1 = require("./product.model");
const router = (0, express_1.Router)();
router.get("/", async (_req, res) => {
    try {
        const products = await product_model_1.ProductModel.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
        return res.status(200).json({ ok: true, products });
    }
    catch (err) {
        return res.status(500).json({ ok: false, message: "Server error", err });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await product_model_1.ProductModel.findById(id).lean();
        if (!product) {
            return res.status(404).json({ ok: false, message: "Product not found" });
        }
        return res.status(200).json({ ok: true, product });
    }
    catch (err) {
        return res.status(500).json({ ok: false, message: "Server error", err });
    }
});
exports.default = router;
//# sourceMappingURL=product.public.route.js.map
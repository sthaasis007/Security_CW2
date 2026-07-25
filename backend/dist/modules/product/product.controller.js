"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_model_1 = require("./product.model");
const file_1 = require("../../utils/file");
const ProductController = {
    async create(req, res) {
        try {
            const { name, price, description, placements, placement, displayOrder, available } = req.body;
            if (!name || !price) {
                return res.status(400).json({ ok: false, message: "Missing required fields" });
            }
            const numericPrice = Number(price);
            if (Number.isNaN(numericPrice) || numericPrice <= 0) {
                return res.status(400).json({ ok: false, message: "Invalid price" });
            }
            const image = req.file ? req.file.filename : undefined;
            const normalizedPlacements = Array.isArray(placements)
                ? placements
                : typeof placements === "string"
                    ? placements.split(",").map((item) => item.trim()).filter(Boolean)
                    : placement
                        ? [placement]
                        : ["current"];
            const product = await product_model_1.ProductModel.create({
                name,
                price: numericPrice,
                description,
                placements: normalizedPlacements.length ? normalizedPlacements : ["current"],
                displayOrder: displayOrder ? Number(displayOrder) : 1,
                available: available === "false" ? false : true,
                ...(image ? { image } : {}),
            });
            return res.status(201).json({ ok: true, product });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    async list(_req, res) {
        try {
            const products = await product_model_1.ProductModel.find().sort({ createdAt: -1 }).lean();
            return res.status(200).json({ ok: true, products });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, price, description, placements, placement, displayOrder, available } = req.body;
            const updatePayload = {};
            const existing = await product_model_1.ProductModel.findById(id).lean();
            if (name !== undefined)
                updatePayload.name = name;
            if (price !== undefined) {
                const numericPrice = Number(price);
                if (Number.isNaN(numericPrice) || numericPrice <= 0) {
                    return res.status(400).json({ ok: false, message: "Invalid price" });
                }
                updatePayload.price = numericPrice;
            }
            if (description !== undefined)
                updatePayload.description = description;
            if (placements !== undefined || placement !== undefined) {
                const normalizedPlacements = Array.isArray(placements)
                    ? placements
                    : typeof placements === "string"
                        ? placements.split(",").map((item) => item.trim()).filter(Boolean)
                        : placement
                            ? [placement]
                            : [];
                updatePayload.placements = normalizedPlacements.length ? normalizedPlacements : ["current"];
            }
            if (displayOrder !== undefined)
                updatePayload.displayOrder = Number(displayOrder);
            if (available !== undefined)
                updatePayload.available = available === "false" ? false : Boolean(available);
            const image = req.file ? req.file.filename : undefined;
            if (image)
                updatePayload.image = image;
            const updated = await product_model_1.ProductModel.findByIdAndUpdate(id, updatePayload, { new: true }).lean();
            if (!updated)
                return res.status(404).json({ ok: false, message: "Product not found" });
            if (image && existing?.image && existing.image !== image) {
                await (0, file_1.deleteUploadFile)(existing.image);
            }
            return res.status(200).json({ ok: true, product: updated });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    async remove(req, res) {
        try {
            const { id } = req.params;
            const deleted = await product_model_1.ProductModel.findByIdAndDelete(id).lean();
            if (!deleted)
                return res.status(404).json({ ok: false, message: "Product not found" });
            if (deleted.image) {
                await (0, file_1.deleteUploadFile)(deleted.image);
            }
            return res.status(200).json({ ok: true, message: "Product deleted" });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
};
exports.default = ProductController;
//# sourceMappingURL=product.controller.js.map
import { Router } from "express";
import { ProductModel } from "./product.model";
import { validate } from "../../middleware/validation.middleware";
import { emptyQuery, idParams } from "../../validation/api.schemas";

const router = Router();

router.get("/", validate({ query: emptyQuery }), async (_req, res) => {
  try {
    const products = await ProductModel.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
    return res.status(200).json({ ok: true, products });
  } catch (_err) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

router.get("/:id", validate({ params: idParams, query: emptyQuery }), async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id).lean();
    if (!product) {
      return res.status(404).json({ ok: false, message: "Product not found" });
    }
    return res.status(200).json({ ok: true, product });
  } catch (_err) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;

import { Request, Response } from "express";
import { ProductModel } from "./product.model";
import { deleteUploadFile } from "../../utils/file";

const ProductController = {
  async create(req: Request, res: Response) {
    try {
      const { name, price, description, placements, placement, displayOrder, available } = req.body as any;

      if (!name || !price) {
        return res.status(400).json({ ok: false, message: "Missing required fields" });
      }

      const numericPrice = Number(price);
      if (Number.isNaN(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({ ok: false, message: "Invalid price" });
      }

      const image = (req as any).file ? (req as any).file.filename : undefined;

      const normalizedPlacements = Array.isArray(placements)
        ? placements
        : typeof placements === "string"
        ? placements.split(",").map((item) => item.trim()).filter(Boolean)
        : placement
        ? [placement]
        : ["current"];

      const product = await ProductModel.create({
        name,
        price: numericPrice,
        description,
        placements: normalizedPlacements.length ? normalizedPlacements : ["current"],
        displayOrder: displayOrder ? Number(displayOrder) : 1,
        available: available === "false" ? false : true,
        ...(image ? { image } : {}),
      });

      return res.status(201).json({ ok: true, product });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async list(_req: Request, res: Response) {
    try {
      const products = await ProductModel.find().sort({ createdAt: -1 }).lean();
      return res.status(200).json({ ok: true, products });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, price, description, placements, placement, displayOrder, available } = req.body as any;
      const updatePayload: Record<string, any> = {};

      const existing = await ProductModel.findById(id).lean();

      if (name !== undefined) updatePayload.name = name;
      if (price !== undefined) {
        const numericPrice = Number(price);
        if (Number.isNaN(numericPrice) || numericPrice <= 0) {
          return res.status(400).json({ ok: false, message: "Invalid price" });
        }
        updatePayload.price = numericPrice;
      }
      if (description !== undefined) updatePayload.description = description;
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
      if (displayOrder !== undefined) updatePayload.displayOrder = Number(displayOrder);
      if (available !== undefined) updatePayload.available = available === "false" ? false : Boolean(available);

      const image = (req as any).file ? (req as any).file.filename : undefined;
      if (image) updatePayload.image = image;

      const updated = await ProductModel.findByIdAndUpdate(id, updatePayload, { new: true }).lean();
      if (!updated) return res.status(404).json({ ok: false, message: "Product not found" });

      if (image && existing?.image && existing.image !== image) {
        await deleteUploadFile(existing.image);
      }

      return res.status(200).json({ ok: true, product: updated });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await ProductModel.findByIdAndDelete(id).lean();
      if (!deleted) return res.status(404).json({ ok: false, message: "Product not found" });

      if (deleted.image) {
        await deleteUploadFile(deleted.image);
      }

      return res.status(200).json({ ok: true, message: "Product deleted" });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },
};

export default ProductController;

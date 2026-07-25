import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    placements: {
      type: [String],
      enum: ["bestseller", "current"],
      default: ["current"],
    },
    displayOrder: { type: Number, default: 1, min: 1 },
    image: { type: String },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model("Product", productSchema);

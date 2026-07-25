import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: { type: String },
    productPrice: { type: Number },
    productDescription: { type: String },
    productImage: { type: String },
  },
  { timestamps: true }
);

// Create a compound unique index so a user can't favorite the same product twice
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const FavoriteModel = mongoose.model("Favorite", favoriteSchema);

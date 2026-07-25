"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const favoriteSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    productName: { type: String },
    productPrice: { type: Number },
    productDescription: { type: String },
    productImage: { type: String },
}, { timestamps: true });
// Create a compound unique index so a user can't favorite the same product twice
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });
exports.FavoriteModel = mongoose_1.default.model("Favorite", favoriteSchema);
//# sourceMappingURL=favorite.model.js.map
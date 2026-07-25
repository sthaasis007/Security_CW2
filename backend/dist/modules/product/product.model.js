"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
exports.ProductModel = mongoose_1.default.model("Product", productSchema);
//# sourceMappingURL=product.model.js.map
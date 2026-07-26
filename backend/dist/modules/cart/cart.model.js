"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartItemSchema = new mongoose_1.default.Schema({
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: { type: Number, default: 1, min: 1 },
    selectedSize: { type: String, default: null },
    selectedColor: { type: String, default: null },
    priceSnapshot: { type: Number, default: 0 },
    productName: { type: String },
    productPrice: { type: Number },
    productDescription: { type: String },
    productImage: { type: String },
}, { _id: false, timestamps: true });
const cartSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    items: [cartItemSchema],
}, { timestamps: true });
exports.CartModel = mongoose_1.default.model("Cart", cartSchema);
//# sourceMappingURL=cart.model.js.map
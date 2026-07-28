"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const orderItemSchema = new mongoose_1.default.Schema({
    productId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    unitPricePaisa: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, max: 100 },
    selectedSize: { type: String, default: null },
    selectedColor: { type: String, default: null },
}, { _id: false });
const orderSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: { type: [orderItemSchema], required: true },
    totalAmountPaisa: { type: Number, required: true, min: 1 },
    currency: { type: String, enum: ["NPR"], default: "NPR" },
    status: {
        type: String,
        enum: ["created", "payment_initiated", "paid", "failed", "cancelled", "refunded"],
        default: "created",
        index: true,
    },
    provider: { type: String, enum: ["khalti"], default: "khalti" },
    providerPaymentId: { type: String, unique: true, sparse: true, index: true },
    providerTransactionId: { type: String, unique: true, sparse: true },
    providerStatus: { type: String, default: null },
    paidAt: { type: Date, default: null },
}, { timestamps: true });
exports.OrderModel = mongoose_1.default.models.Order || mongoose_1.default.model("Order", orderSchema);
//# sourceMappingURL=order.model.js.map
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  unitPricePaisa: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1, max: 100 },
  selectedSize: { type: String, default: null },
  selectedColor: { type: String, default: null },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
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

export const OrderModel: mongoose.Model<any> =
  (mongoose.models.Order as mongoose.Model<any>) || mongoose.model("Order", orderSchema);

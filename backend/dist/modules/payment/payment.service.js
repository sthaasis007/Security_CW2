"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = exports.buildOrderSnapshot = exports.canTransition = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cart_model_1 = require("../cart/cart.model");
const product_model_1 = require("../product/product.model");
const order_model_1 = require("./order.model");
const mockEnabled = () => process.env.KHALTI_TEST_MODE === "true" && process.env.NODE_ENV !== "production";
const apiBase = () => process.env.KHALTI_API_BASE_URL ||
    (process.env.NODE_ENV === "production" ? "https://khalti.com/api/v2" : "https://dev.khalti.com/api/v2");
const secret = () => process.env.KHALTI_SECRET_KEY?.trim();
const providerRequest = async (path, body) => {
    if (!secret())
        throw new Error("payment_provider_unavailable");
    const response = await fetch(`${apiBase()}${path}`, {
        method: "POST",
        headers: { Authorization: `Key ${secret()}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
        throw new Error("payment_provider_rejected");
    return response.json();
};
const canTransition = (from, to) => ({
    created: ["payment_initiated", "failed"],
    payment_initiated: ["paid", "failed", "cancelled"],
    paid: ["refunded"],
    failed: [],
    cancelled: [],
    refunded: [],
}[from] || []).includes(to);
exports.canTransition = canTransition;
const buildOrderSnapshot = async (userId) => {
    const cart = await cart_model_1.CartModel.findOne({ userId }).lean();
    if (!cart?.items?.length)
        throw new Error("cart_empty");
    const ids = cart.items.map((item) => item.productId);
    const products = await product_model_1.ProductModel.find({ _id: { $in: ids }, available: true }).lean();
    const byId = new Map(products.map(product => [product._id.toString(), product]));
    const items = cart.items.map((item) => {
        const product = byId.get(item.productId.toString());
        const quantity = Number(item.quantity);
        if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 100)
            throw new Error("cart_invalid");
        return {
            productId: product._id,
            name: product.name,
            unitPricePaisa: Math.round(Number(product.price) * 100),
            quantity,
            selectedSize: item.selectedSize || null,
            selectedColor: item.selectedColor || null,
        };
    });
    const totalAmountPaisa = items.reduce((sum, item) => sum + item.unitPricePaisa * item.quantity, 0);
    if (!Number.isSafeInteger(totalAmountPaisa) || totalAmountPaisa < 1000)
        throw new Error("cart_invalid");
    return { items, totalAmountPaisa };
};
exports.buildOrderSnapshot = buildOrderSnapshot;
const initiateProvider = async (order, user) => {
    if (mockEnabled()) {
        const pidx = `mock_${order._id}_${Date.now()}`;
        return {
            pidx,
            payment_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/success?pidx=${encodeURIComponent(pidx)}`,
            expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            expires_in: 1800,
        };
    }
    return providerRequest("/epayment/initiate/", {
        return_url: process.env.KHALTI_RETURN_URL || `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/success`,
        website_url: process.env.KHALTI_WEBSITE_URL || process.env.FRONTEND_URL || "http://localhost:3000",
        amount: order.totalAmountPaisa,
        purchase_order_id: order._id.toString(),
        purchase_order_name: `EverBlue order ${order._id}`,
        customer_info: { name: user.username, email: user.email },
    });
};
const lookupProvider = async (order) => {
    if (mockEnabled()) {
        if (!String(order.providerPaymentId).startsWith(`mock_${order._id}_`))
            throw new Error("invalid_provider_id");
        return {
            pidx: order.providerPaymentId,
            total_amount: order.totalAmountPaisa,
            status: "Completed",
            transaction_id: `mock_txn_${order._id}`,
        };
    }
    return providerRequest("/epayment/lookup/", { pidx: order.providerPaymentId });
};
exports.PaymentService = {
    async listOrders(userId) {
        return order_model_1.OrderModel.find({ userId })
            .select("_id items totalAmountPaisa currency status providerTransactionId paidAt createdAt")
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();
    },
    async initiate(user) {
        const snapshot = await (0, exports.buildOrderSnapshot)(user.id);
        const order = await order_model_1.OrderModel.create({ userId: user.id, ...snapshot });
        try {
            const provider = await initiateProvider(order, user);
            if (!provider.pidx || !provider.payment_url)
                throw new Error("invalid_provider_response");
            order.providerPaymentId = provider.pidx;
            order.status = "payment_initiated";
            order.providerStatus = "Initiated";
            await order.save();
            return {
                orderId: order._id.toString(),
                paymentUrl: provider.payment_url,
                expiresAt: provider.expires_at,
            };
        }
        catch (error) {
            order.status = "failed";
            order.providerStatus = "Initiation failed";
            await order.save();
            throw error;
        }
    },
    async verify(userId, pidx) {
        let order = await order_model_1.OrderModel.findOne({ providerPaymentId: pidx, userId });
        if (!order)
            throw Object.assign(new Error("order_not_found"), { status: 404 });
        if (order.status === "paid")
            return { order, idempotent: true };
        if (order.status !== "payment_initiated")
            throw Object.assign(new Error("invalid_order_state"), { status: 409 });
        const provider = await lookupProvider(order);
        if (provider.pidx !== order.providerPaymentId)
            throw Object.assign(new Error("provider_mismatch"), { status: 400 });
        if (provider.status !== "Completed") {
            const next = provider.status === "User canceled" ? "cancelled" :
                ["Expired", "Failed"].includes(provider.status) ? "failed" : null;
            if (next && (0, exports.canTransition)(order.status, next)) {
                order.status = next;
                order.providerStatus = provider.status;
                await order.save();
            }
            throw Object.assign(new Error("payment_not_completed"), { status: 409 });
        }
        if (provider.total_amount !== order.totalAmountPaisa || !provider.transaction_id) {
            throw Object.assign(new Error("payment_details_mismatch"), { status: 400 });
        }
        const session = await mongoose_1.default.startSession();
        try {
            await session.withTransaction(async () => {
                const claimed = await order_model_1.OrderModel.updateOne({ _id: order._id, userId, status: "payment_initiated" }, {
                    $set: {
                        status: "paid",
                        providerStatus: provider.status,
                        providerTransactionId: provider.transaction_id,
                        paidAt: new Date(),
                    },
                }, { session });
                if (claimed.modifiedCount === 0)
                    return;
                await cart_model_1.CartModel.updateOne({ userId }, { $pull: { items: { productId: { $in: order.items.map((item) => item.productId) } } } }, { session });
            });
        }
        finally {
            await session.endSession();
        }
        order = await order_model_1.OrderModel.findOne({ _id: order._id, userId });
        if (!order || order.status !== "paid")
            throw Object.assign(new Error("payment_finalization_failed"), { status: 500 });
        return { order, idempotent: false };
    },
};
//# sourceMappingURL=payment.service.js.map
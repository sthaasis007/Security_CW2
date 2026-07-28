"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOrders = exports.verifyPayment = exports.initiatePayment = void 0;
const activity_service_1 = require("../activity/activity.service");
const payment_service_1 = require("./payment.service");
const safeOrder = (order) => ({
    orderId: order._id,
    status: order.status,
    amountPaisa: order.totalAmountPaisa,
    currency: order.currency,
    transactionId: order.providerTransactionId || null,
    paidAt: order.paidAt || null,
});
const initiatePayment = async (req, res) => {
    const user = req.user;
    if (!user?.id)
        return res.status(401).json({ ok: false, message: "Unauthorized" });
    if (Object.keys(req.body || {}).length > 0) {
        return res.status(400).json({ ok: false, message: "Payment amount and order details are calculated by the server." });
    }
    try {
        const result = await payment_service_1.PaymentService.initiate(user);
        await activity_service_1.ActivityService.log("payment_initiated", "Payment initiated", { orderId: result.orderId }, { id: user.id, email: user.email, role: user.role }, req);
        return res.status(201).json({ ok: true, orderId: result.orderId, paymentUrl: result.paymentUrl, expiresAt: result.expiresAt });
    }
    catch {
        return res.status(400).json({ ok: false, message: "Unable to initiate payment for this cart." });
    }
};
exports.initiatePayment = initiatePayment;
const verifyPayment = async (req, res) => {
    const user = req.user;
    if (!user?.id)
        return res.status(401).json({ ok: false, message: "Unauthorized" });
    const pidx = typeof req.body?.pidx === "string" ? req.body.pidx.trim() : "";
    if (!pidx || pidx.length > 200 || Object.keys(req.body || {}).some(key => key !== "pidx")) {
        return res.status(400).json({ ok: false, message: "Invalid payment reference." });
    }
    try {
        const result = await payment_service_1.PaymentService.verify(user.id, pidx);
        if (!result.idempotent) {
            await activity_service_1.ActivityService.log("payment_completed", "Payment completed", { orderId: result.order._id }, { id: user.id, email: user.email, role: user.role }, req);
        }
        return res.status(200).json({ ok: true, order: safeOrder(result.order), idempotent: result.idempotent });
    }
    catch (error) {
        const status = Number(error?.status);
        return res.status([400, 404, 409].includes(status) ? status : 502).json({
            ok: false,
            message: status === 404 ? "Payment reference not found." :
                status === 409 ? "Payment is not completed." : "Payment verification failed.",
        });
    }
};
exports.verifyPayment = verifyPayment;
const listOrders = async (req, res) => {
    const user = req.user;
    if (!user?.id)
        return res.status(401).json({ ok: false, message: "Unauthorized" });
    try {
        const orders = await payment_service_1.PaymentService.listOrders(user.id);
        return res.status(200).json({ ok: true, orders });
    }
    catch {
        return res.status(500).json({ ok: false, message: "Unable to load orders." });
    }
};
exports.listOrders = listOrders;
//# sourceMappingURL=payment.controller.js.map
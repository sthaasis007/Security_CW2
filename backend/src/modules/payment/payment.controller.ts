import { Request, Response } from "express";
import { ActivityService } from "../activity/activity.service";
import { PaymentService } from "./payment.service";

const safeOrder = (order: any) => ({
  orderId: order._id,
  status: order.status,
  amountPaisa: order.totalAmountPaisa,
  currency: order.currency,
  transactionId: order.providerTransactionId || null,
  paidAt: order.paidAt || null,
});

export const initiatePayment = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.id) return res.status(401).json({ ok: false, message: "Unauthorized" });
  if (Object.keys(req.body || {}).length > 0) {
    return res.status(400).json({ ok: false, message: "Payment amount and order details are calculated by the server." });
  }
  try {
    const result = await PaymentService.initiate(user);
    await ActivityService.log("payment_initiated", "Payment initiated", { orderId: result.orderId }, { id: user.id, email: user.email, role: user.role }, req);
    return res.status(201).json({ ok: true, orderId: result.orderId, paymentUrl: result.paymentUrl, expiresAt: result.expiresAt });
  } catch {
    return res.status(400).json({ ok: false, message: "Unable to initiate payment for this cart." });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.id) return res.status(401).json({ ok: false, message: "Unauthorized" });
  const pidx = typeof req.body?.pidx === "string" ? req.body.pidx.trim() : "";
  if (!pidx || pidx.length > 200 || Object.keys(req.body || {}).some(key => key !== "pidx")) {
    return res.status(400).json({ ok: false, message: "Invalid payment reference." });
  }
  try {
    const result = await PaymentService.verify(user.id, pidx);
    if (!result.idempotent) {
      await ActivityService.log("payment_completed", "Payment completed", { orderId: result.order._id }, { id: user.id, email: user.email, role: user.role }, req);
    }
    return res.status(200).json({ ok: true, order: safeOrder(result.order), idempotent: result.idempotent });
  } catch (error: any) {
    const status = Number(error?.status);
    await ActivityService.log("payment_anomaly", "Payment verification anomaly", {
      reason: typeof error?.message === "string" ? error.message : "verification_failed",
    }, { id: user.id, email: user.email, role: user.role }, req).catch(() => undefined);
    return res.status([400, 404, 409].includes(status) ? status : 502).json({
      ok: false,
      message: status === 404 ? "Payment reference not found." :
        status === 409 ? "Payment is not completed." : "Payment verification failed.",
    });
  }
};

export const listOrders = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.id) return res.status(401).json({ ok: false, message: "Unauthorized" });
  try {
    const orders = await PaymentService.listOrders(user.id);
    return res.status(200).json({ ok: true, orders });
  } catch {
    return res.status(500).json({ ok: false, message: "Unable to load orders." });
  }
};

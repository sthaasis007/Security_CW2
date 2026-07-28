import { Router } from "express";
import { initiatePayment, listOrders, verifyPayment } from "./payment.controller";
import rateLimit from "../../middleware/rateLimit.middleware";
import authOnly from "../../middleware/auth.middleware";

const router = Router();
const paymentRateLimit = rateLimit({ windowMs: 60 * 1000, max: 10, keyPrefix: "payment", progressiveDelayMs: 2000 });

// Payment routes
router.post("/initiate", paymentRateLimit, authOnly, initiatePayment);
router.post("/verify", paymentRateLimit, authOnly, verifyPayment);
router.get("/orders", paymentRateLimit, authOnly, listOrders);

export default router;

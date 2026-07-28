import { Router } from "express";
import { initiatePayment, verifyPayment } from "./payment.controller";
import rateLimit from "../../middleware/rateLimit.middleware";

const router = Router();
const paymentRateLimit = rateLimit({ windowMs: 60 * 1000, max: 10, keyPrefix: "payment", progressiveDelayMs: 2000 });

// Payment routes
router.post("/initiate", paymentRateLimit, initiatePayment);
router.post("/verify", paymentRateLimit, verifyPayment);

export default router;

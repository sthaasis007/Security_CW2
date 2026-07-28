import { Router } from "express";
import { initiatePayment, listOrders, verifyPayment } from "./payment.controller";
import rateLimit from "../../middleware/rateLimit.middleware";
import authOnly from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import { emptyObject, emptyQuery, paymentVerifyBody } from "../../validation/api.schemas";

const router = Router();
const paymentRateLimit = rateLimit({ windowMs: 60 * 1000, max: 10, keyPrefix: "payment", progressiveDelayMs: 2000 });

// Payment routes
router.post("/initiate", paymentRateLimit, authOnly, validate({ body: emptyObject, query: emptyQuery }), initiatePayment);
router.post("/verify", paymentRateLimit, authOnly, validate({ body: paymentVerifyBody, query: emptyQuery }), verifyPayment);
router.get("/orders", paymentRateLimit, authOnly, validate({ query: emptyQuery }), listOrders);

export default router;

import { Router } from "express";
import { initiatePayment, verifyPayment } from "./payment.controller";

const router = Router();

// Payment routes
router.post("/initiate", initiatePayment);
router.post("/verify", verifyPayment);

export default router;

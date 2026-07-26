"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
// Payment routes
router.post("/initiate", payment_controller_1.initiatePayment);
router.post("/verify", payment_controller_1.verifyPayment);
exports.default = router;
//# sourceMappingURL=payment.route.js.map
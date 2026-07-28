"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const rateLimit_middleware_1 = __importDefault(require("../../middleware/rateLimit.middleware"));
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const validation_middleware_1 = require("../../middleware/validation.middleware");
const api_schemas_1 = require("../../validation/api.schemas");
const router = (0, express_1.Router)();
const paymentRateLimit = (0, rateLimit_middleware_1.default)({ windowMs: 60 * 1000, max: 10, keyPrefix: "payment", progressiveDelayMs: 2000 });
// Payment routes
router.post("/initiate", paymentRateLimit, auth_middleware_1.default, (0, validation_middleware_1.validate)({ body: api_schemas_1.emptyObject, query: api_schemas_1.emptyQuery }), payment_controller_1.initiatePayment);
router.post("/verify", paymentRateLimit, auth_middleware_1.default, (0, validation_middleware_1.validate)({ body: api_schemas_1.paymentVerifyBody, query: api_schemas_1.emptyQuery }), payment_controller_1.verifyPayment);
router.get("/orders", paymentRateLimit, auth_middleware_1.default, (0, validation_middleware_1.validate)({ query: api_schemas_1.emptyQuery }), payment_controller_1.listOrders);
exports.default = router;
//# sourceMappingURL=payment.route.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const cart_model_1 = require("../modules/cart/cart.model");
const product_model_1 = require("../modules/product/product.model");
const payment_controller_1 = require("../modules/payment/payment.controller");
const order_model_1 = require("../modules/payment/order.model");
const payment_service_1 = require("../modules/payment/payment.service");
const payment_route_1 = __importDefault(require("../modules/payment/payment.route"));
const responseDouble = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
});
describe("Phase 6 secure transaction processing", () => {
    const originalEnv = process.env;
    beforeEach(() => {
        process.env = { ...originalEnv, NODE_ENV: "test", KHALTI_TEST_MODE: "true" };
        jest.restoreAllMocks();
    });
    afterAll(() => {
        process.env = originalEnv;
    });
    it("rejects client-supplied amount tampering", async () => {
        const req = { user: { id: new mongoose_1.Types.ObjectId().toString() }, body: { amount: 1 } };
        const res = responseDouble();
        await (0, payment_controller_1.initiatePayment)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });
    it("requires authentication for initiation and verification", async () => {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use("/api/payment", payment_route_1.default);
        expect((await (0, supertest_1.default)(app).post("/api/payment/initiate").send({})).status).toBe(401);
        expect((await (0, supertest_1.default)(app).post("/api/payment/verify").send({ pidx: "forged" })).status).toBe(401);
    });
    it("calculates the total from current product prices rather than cart snapshots", async () => {
        const productId = new mongoose_1.Types.ObjectId();
        jest.spyOn(cart_model_1.CartModel, "findOne").mockReturnValue({
            lean: jest.fn().mockResolvedValue({
                items: [{ productId, quantity: 2, priceSnapshot: 1 }],
            }),
        });
        jest.spyOn(product_model_1.ProductModel, "find").mockReturnValue({
            lean: jest.fn().mockResolvedValue([{ _id: productId, name: "Secure item", price: 25, available: true }]),
        });
        const snapshot = await (0, payment_service_1.buildOrderSnapshot)(new mongoose_1.Types.ObjectId().toString());
        expect(snapshot.totalAmountPaisa).toBe(5000);
        expect(snapshot.items[0]?.unitPricePaisa).toBe(2500);
    });
    it("does not disclose or verify another user's order", async () => {
        const ownerId = new mongoose_1.Types.ObjectId().toString();
        const attackerId = new mongoose_1.Types.ObjectId().toString();
        const lookup = jest.spyOn(order_model_1.OrderModel, "findOne").mockResolvedValue(null);
        await expect(payment_service_1.PaymentService.verify(attackerId, "owned-pidx")).rejects.toMatchObject({ status: 404 });
        expect(lookup).toHaveBeenCalledWith({ providerPaymentId: "owned-pidx", userId: attackerId });
        expect(ownerId).not.toBe(attackerId);
    });
    it("rejects forged payment identifiers before contacting the provider", async () => {
        jest.spyOn(order_model_1.OrderModel, "findOne").mockResolvedValue(null);
        await expect(payment_service_1.PaymentService.verify(new mongoose_1.Types.ObjectId().toString(), "forged-pidx")).rejects.toMatchObject({
            message: "order_not_found",
            status: 404,
        });
    });
    it("handles duplicate callbacks idempotently without clearing the cart again", async () => {
        const order = {
            _id: new mongoose_1.Types.ObjectId(),
            userId: new mongoose_1.Types.ObjectId(),
            status: "paid",
            providerPaymentId: "existing-pidx",
            totalAmountPaisa: 5000,
        };
        jest.spyOn(order_model_1.OrderModel, "findOne").mockResolvedValue(order);
        const clear = jest.spyOn(cart_model_1.CartModel, "updateOne");
        const result = await payment_service_1.PaymentService.verify(order.userId.toString(), order.providerPaymentId);
        expect(result.idempotent).toBe(true);
        expect(clear).not.toHaveBeenCalled();
    });
    it("rolls back fulfillment when cart clearing fails", async () => {
        const userId = new mongoose_1.Types.ObjectId();
        const order = {
            _id: new mongoose_1.Types.ObjectId(),
            userId,
            status: "payment_initiated",
            providerPaymentId: "",
            totalAmountPaisa: 5000,
            items: [{ productId: new mongoose_1.Types.ObjectId() }],
        };
        order.providerPaymentId = `mock_${order._id}_123`;
        jest.spyOn(order_model_1.OrderModel, "findOne").mockResolvedValue(order);
        jest.spyOn(order_model_1.OrderModel, "updateOne").mockResolvedValue({ modifiedCount: 1 });
        jest.spyOn(cart_model_1.CartModel, "updateOne").mockRejectedValue(new Error("cart write failed"));
        const endSession = jest.fn().mockResolvedValue(undefined);
        const withTransaction = jest.fn(async (callback) => callback());
        jest.spyOn(mongoose_1.default, "startSession").mockResolvedValue({ withTransaction, endSession });
        await expect(payment_service_1.PaymentService.verify(userId.toString(), order.providerPaymentId)).rejects.toThrow("cart write failed");
        expect(withTransaction).toHaveBeenCalledTimes(1);
        expect(endSession).toHaveBeenCalledTimes(1);
    });
    it("allows only defined forward payment-state transitions", () => {
        expect((0, payment_service_1.canTransition)("payment_initiated", "paid")).toBe(true);
        expect((0, payment_service_1.canTransition)("paid", "payment_initiated")).toBe(false);
        expect((0, payment_service_1.canTransition)("failed", "paid")).toBe(false);
    });
});
//# sourceMappingURL=payment.security.test.js.map
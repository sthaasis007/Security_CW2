import mongoose, { Types } from "mongoose";
import express from "express";
import request from "supertest";
import { CartModel } from "../modules/cart/cart.model";
import { ProductModel } from "../modules/product/product.model";
import { initiatePayment } from "../modules/payment/payment.controller";
import { OrderModel } from "../modules/payment/order.model";
import { buildOrderSnapshot, canTransition, PaymentService } from "../modules/payment/payment.service";
import paymentRoutes from "../modules/payment/payment.route";

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
    const req = { user: { id: new Types.ObjectId().toString() }, body: { amount: 1 } } as never;
    const res = responseDouble();
    await initiatePayment(req, res as never);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
  });

  it("requires authentication for initiation and verification", async () => {
    const app = express();
    app.use(express.json());
    app.use("/api/payment", paymentRoutes);
    expect((await request(app).post("/api/payment/initiate").send({})).status).toBe(401);
    expect((await request(app).post("/api/payment/verify").send({ pidx: "forged" })).status).toBe(401);
  });

  it("calculates the total from current product prices rather than cart snapshots", async () => {
    const productId = new Types.ObjectId();
    jest.spyOn(CartModel, "findOne").mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        items: [{ productId, quantity: 2, priceSnapshot: 1 }],
      }),
    } as never);
    jest.spyOn(ProductModel, "find").mockReturnValue({
      lean: jest.fn().mockResolvedValue([{ _id: productId, name: "Secure item", price: 25, available: true }]),
    } as never);

    const snapshot = await buildOrderSnapshot(new Types.ObjectId().toString());

    expect(snapshot.totalAmountPaisa).toBe(5000);
    expect(snapshot.items[0]?.unitPricePaisa).toBe(2500);
  });

  it("does not disclose or verify another user's order", async () => {
    const ownerId = new Types.ObjectId().toString();
    const attackerId = new Types.ObjectId().toString();
    const lookup = jest.spyOn(OrderModel, "findOne").mockResolvedValue(null);

    await expect(PaymentService.verify(attackerId, "owned-pidx")).rejects.toMatchObject({ status: 404 });
    expect(lookup).toHaveBeenCalledWith({ providerPaymentId: "owned-pidx", userId: attackerId });
    expect(ownerId).not.toBe(attackerId);
  });

  it("rejects forged payment identifiers before contacting the provider", async () => {
    jest.spyOn(OrderModel, "findOne").mockResolvedValue(null);
    await expect(PaymentService.verify(new Types.ObjectId().toString(), "forged-pidx")).rejects.toMatchObject({
      message: "order_not_found",
      status: 404,
    });
  });

  it("handles duplicate callbacks idempotently without clearing the cart again", async () => {
    const order = {
      _id: new Types.ObjectId(),
      userId: new Types.ObjectId(),
      status: "paid",
      providerPaymentId: "existing-pidx",
      totalAmountPaisa: 5000,
    };
    jest.spyOn(OrderModel, "findOne").mockResolvedValue(order);
    const clear = jest.spyOn(CartModel, "updateOne");

    const result = await PaymentService.verify(order.userId.toString(), order.providerPaymentId);

    expect(result.idempotent).toBe(true);
    expect(clear).not.toHaveBeenCalled();
  });

  it("rolls back fulfillment when cart clearing fails", async () => {
    const userId = new Types.ObjectId();
    const order: any = {
      _id: new Types.ObjectId(),
      userId,
      status: "payment_initiated",
      providerPaymentId: "",
      totalAmountPaisa: 5000,
      items: [{ productId: new Types.ObjectId() }],
    };
    order.providerPaymentId = `mock_${order._id}_123`;
    jest.spyOn(OrderModel, "findOne").mockResolvedValue(order);
    jest.spyOn(OrderModel, "updateOne").mockResolvedValue({ modifiedCount: 1 } as never);
    jest.spyOn(CartModel, "updateOne").mockRejectedValue(new Error("cart write failed"));
    const endSession = jest.fn().mockResolvedValue(undefined);
    const withTransaction = jest.fn(async (callback: () => Promise<void>) => callback());
    jest.spyOn(mongoose, "startSession").mockResolvedValue({ withTransaction, endSession } as never);

    await expect(PaymentService.verify(userId.toString(), order.providerPaymentId)).rejects.toThrow("cart write failed");
    expect(withTransaction).toHaveBeenCalledTimes(1);
    expect(endSession).toHaveBeenCalledTimes(1);
  });

  it("allows only defined forward payment-state transitions", () => {
    expect(canTransition("payment_initiated", "paid")).toBe(true);
    expect(canTransition("paid", "payment_initiated")).toBe(false);
    expect(canTransition("failed", "paid")).toBe(false);
  });
});

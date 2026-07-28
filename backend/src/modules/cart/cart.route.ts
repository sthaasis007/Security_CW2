import { Router } from "express";
import { CartController } from "./cart.controller";
import authOnly from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import { cartAddBody, cartUpdateBody, emptyObject, emptyQuery, productParams } from "../../validation/api.schemas";

const router = Router();

router.get("/", authOnly, validate({ query: emptyQuery }), CartController.getCart);
router.post("/add", authOnly, validate({ body: cartAddBody, query: emptyQuery }), CartController.addItem);
router.put("/update/:productId", authOnly, validate({ params: productParams, body: cartUpdateBody, query: emptyQuery }), CartController.updateItem);
router.delete("/remove/:productId", authOnly, validate({ params: productParams, body: emptyObject, query: emptyQuery }), CartController.removeItem);
router.delete("/clear", authOnly, validate({ body: emptyObject, query: emptyQuery }), CartController.clearCart);

export default router;

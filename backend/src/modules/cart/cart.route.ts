import { Router } from "express";
import { CartController } from "./cart.controller";
import authOnly from "../../middleware/auth.middleware";

const router = Router();

router.get("/", authOnly, CartController.getCart);
router.post("/add", authOnly, CartController.addItem);
router.put("/update/:productId", authOnly, CartController.updateItem);
router.delete("/remove/:productId", authOnly, CartController.removeItem);
router.delete("/clear", authOnly, CartController.clearCart);

export default router;

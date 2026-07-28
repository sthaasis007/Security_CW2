import { Router } from "express";
import adminOnly from "../../middleware/admin.middleware";
import uploadSingle from "../../middleware/upload.middleware";
import ProductController from "./product.controller";
import rateLimit from "../../middleware/rateLimit.middleware";

const router = Router();
const uploadRateLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, keyPrefix: "product-upload" });

router.post("/", uploadRateLimit, adminOnly, uploadSingle("image"), ProductController.create);
router.get("/", adminOnly, ProductController.list);
router.put("/:id", uploadRateLimit, adminOnly, uploadSingle("image"), ProductController.update);
router.delete("/:id", adminOnly, ProductController.remove);

export default router;

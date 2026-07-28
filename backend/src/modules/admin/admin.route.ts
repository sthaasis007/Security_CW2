import { Router } from "express";
import AdminController from "./admin.controller";
import adminOnly from "../../middleware/admin.middleware";
import uploadSingle from "../../middleware/upload.middleware";
import productRoutes from "../product/product.route";
import rateLimit from "../../middleware/rateLimit.middleware";

const router = Router();
const adminRateLimit = rateLimit({ windowMs: 60 * 1000, max: 30, keyPrefix: "admin" });
const uploadRateLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, keyPrefix: "upload" });

router.post("/users", adminRateLimit, uploadRateLimit, adminOnly, uploadSingle("image"), AdminController.create);
router.get("/users", adminRateLimit, adminOnly, AdminController.list);
router.get("/users/:id", adminRateLimit, adminOnly, AdminController.get);
router.put("/users/:id", adminRateLimit, uploadRateLimit, adminOnly, uploadSingle("image"), AdminController.update);
router.delete("/users/:id", adminRateLimit, adminOnly, AdminController.remove);

router.use("/products", productRoutes);

export default router;

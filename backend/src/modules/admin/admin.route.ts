import { Router } from "express";
import AdminController from "./admin.controller";
import adminOnly from "../../middleware/admin.middleware";
import uploadSingle from "../../middleware/upload.middleware";
import productRoutes from "../product/product.route";

const router = Router();

router.post("/users", adminOnly, uploadSingle("image"), AdminController.create);
router.get("/users", adminOnly, AdminController.list);
router.get("/users/:id", adminOnly, AdminController.get);
router.put("/users/:id", adminOnly, uploadSingle("image"), AdminController.update);
router.delete("/users/:id", adminOnly, AdminController.remove);

router.use("/products", productRoutes);

export default router;

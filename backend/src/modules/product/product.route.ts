import { Router } from "express";
import adminOnly from "../../middleware/admin.middleware";
import uploadSingle from "../../middleware/upload.middleware";
import ProductController from "./product.controller";

const router = Router();

router.post("/", adminOnly, uploadSingle("image"), ProductController.create);
router.get("/", adminOnly, ProductController.list);
router.put("/:id", adminOnly, uploadSingle("image"), ProductController.update);
router.delete("/:id", adminOnly, ProductController.remove);

export default router;

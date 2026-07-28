import { Router } from "express";
import adminOnly from "../../middleware/admin.middleware";
import uploadSingle from "../../middleware/upload.middleware";
import ProductController from "./product.controller";
import rateLimit from "../../middleware/rateLimit.middleware";
import { validate } from "../../middleware/validation.middleware";
import { emptyObject, emptyQuery, idParams, productCreateBody, productUpdateBody } from "../../validation/api.schemas";

const router = Router();
const uploadRateLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, keyPrefix: "product-upload" });

router.post("/", uploadRateLimit, adminOnly, uploadSingle("image"), validate({ body: productCreateBody, query: emptyQuery }), ProductController.create);
router.get("/", adminOnly, validate({ query: emptyQuery }), ProductController.list);
router.put("/:id", uploadRateLimit, adminOnly, validate({ params: idParams }), uploadSingle("image"), validate({ body: productUpdateBody, query: emptyQuery }), ProductController.update);
router.delete("/:id", adminOnly, validate({ params: idParams, body: emptyObject, query: emptyQuery }), ProductController.remove);

export default router;

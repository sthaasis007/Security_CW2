import { Router } from "express";
import AdminController from "./admin.controller";
import adminOnly from "../../middleware/admin.middleware";
import uploadSingle from "../../middleware/upload.middleware";
import productRoutes from "../product/product.route";
import rateLimit from "../../middleware/rateLimit.middleware";
import { validate } from "../../middleware/validation.middleware";
import { adminCreateBody, adminUpdateBody, emptyObject, emptyQuery, idParams } from "../../validation/api.schemas";

const router = Router();
const adminRateLimit = rateLimit({ windowMs: 60 * 1000, max: 30, keyPrefix: "admin" });
const uploadRateLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, keyPrefix: "upload" });

router.post("/users", adminRateLimit, uploadRateLimit, adminOnly, uploadSingle("image"), validate({ body: adminCreateBody, query: emptyQuery }), AdminController.create);
router.get("/users", adminRateLimit, adminOnly, validate({ query: emptyQuery }), AdminController.list);
router.get("/users/:id", adminRateLimit, adminOnly, validate({ params: idParams, query: emptyQuery }), AdminController.get);
router.put("/users/:id", adminRateLimit, uploadRateLimit, adminOnly, validate({ params: idParams }), uploadSingle("image"), validate({ body: adminUpdateBody, query: emptyQuery }), AdminController.update);
router.delete("/users/:id", adminRateLimit, adminOnly, validate({ params: idParams, body: emptyObject, query: emptyQuery }), AdminController.remove);

router.use("/products", productRoutes);

export default router;

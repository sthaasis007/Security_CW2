import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import authOnly from "../../middleware/auth.middleware";
import csrfMiddleware from "../../middleware/csrf.middleware";
import rateLimit from "../../middleware/rateLimit.middleware";
import { PrivacyController } from "./privacy.controller";
import { validate } from "../../middleware/validation.middleware";
import { emptyObject, emptyQuery, exportQuery } from "../../validation/api.schemas";

const router = Router();
const privacyLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, keyPrefix: "privacy" });
const jsonUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 64 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const valid = file.mimetype === "application/json" && file.originalname.toLowerCase().endsWith(".json");
    if (!valid) return cb(new Error("Only JSON files are accepted"));
    cb(null, true);
  },
}).single("file");
const safeJsonUpload = (req: Request, res: Response, next: NextFunction) =>
  jsonUpload(req, res, (error: any) => error
    ? res.status(400).json({ ok: false, message: error.code === "LIMIT_FILE_SIZE" ? "Import file is too large" : "Invalid import file" })
    : next());

router.get("/export", privacyLimit, authOnly, validate({ query: exportQuery }), PrivacyController.exportData);
router.post("/import", privacyLimit, authOnly, csrfMiddleware, validate({ query: emptyQuery }), safeJsonUpload, PrivacyController.importData);
router.delete("/account", privacyLimit, authOnly, csrfMiddleware, validate({ body: emptyObject, query: emptyQuery }), PrivacyController.deleteAccount);

export default router;

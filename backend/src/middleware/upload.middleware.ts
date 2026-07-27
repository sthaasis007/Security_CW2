import multer from "multer";
import path from "path";
import fs from "fs";
import { isSafeFilename } from "../utils/security";

const uploadDir = path.join(process.cwd(), "backend", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = allowedExtensions.includes(ext) ? ext : ".bin";
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 50);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${baseName || "upload"}${safeExt}`;
    cb(null, name);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isValidMime = allowedMimeTypes.has(file.mimetype);
  const isValidExt = allowedExtensions.includes(ext);
  const originalName = (file.originalname || "").toLowerCase();
  const hasSuspiciousName = /[<>:"/\\|?*]/.test(originalName) || originalName.includes("..") || originalName.startsWith(".") || !isSafeFilename(path.basename(file.originalname));

  if (!isValidMime || !isValidExt || hasSuspiciousName) {
    cb(new Error("Unsupported file type"));
    return;
  }
  cb(null, true);
};

export const uploadSingle = (fieldName = "image") => multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
}).single(fieldName);

export default uploadSingle;

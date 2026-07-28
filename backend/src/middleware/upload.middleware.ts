import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const uploadDir = path.resolve(process.cwd(), "backend", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const MAX_FILE_SIZE = 2 * 1024 * 1024;

type ImageType = { mime: string; extension: string };
export const imageType = (buffer: Buffer): ImageType | null => {
  if (buffer.length < 12) return null;
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      && buffer.subarray(-8, -4).toString("ascii") === "IEND") {
    return { mime: "image/png", extension: ".png" };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[buffer.length - 2] === 0xff && buffer[buffer.length - 1] === 0xd9) {
    return { mime: "image/jpeg", extension: ".jpg" };
  }
  const gifHeader = buffer.subarray(0, 6).toString("ascii");
  if ((gifHeader === "GIF87a" || gifHeader === "GIF89a") && buffer[buffer.length - 1] === 0x3b) {
    return { mime: "image/gif", extension: ".gif" };
  }
  if (buffer.subarray(0, 4).toString("ascii") === "RIFF"
      && buffer.subarray(8, 12).toString("ascii") === "WEBP"
      && buffer.readUInt32LE(4) + 8 === buffer.length) {
    return { mime: "image/webp", extension: ".webp" };
  }
  return null;
};

export const containsPolyglotPayload = (buffer: Buffer) => {
  const text = buffer.toString("latin1").toLowerCase();
  return buffer.subarray(0, 2).toString("ascii") === "MZ"
    || ["<script", "<?php", "<html", "<!doctype", "%pdf-"].some((marker) => text.includes(marker));
};

export const generateImageFilename = (extension: string) => `${crypto.randomUUID()}${extension}`;

const parser = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1, fields: 12, parts: 13 },
}).single("image");

export const uploadSingle = (_fieldName = "image") => (req: any, res: any, next: any) => {
  parser(req, res, (error: any) => {
    if (error) {
      return res.status(400).json({ ok: false, message: error.code === "LIMIT_FILE_SIZE" ? "Upload is too large" : "Invalid upload" });
    }
    if (!req.file) return next();
    const detected = imageType(req.file.buffer);
    if (!detected || detected.mime !== req.file.mimetype || containsPolyglotPayload(req.file.buffer)) {
      return res.status(400).json({ ok: false, message: "Invalid image content" });
    }
    const filename = generateImageFilename(detected.extension);
    const destination = path.resolve(uploadDir, filename);
    if (path.dirname(destination) !== uploadDir) {
      return res.status(400).json({ ok: false, message: "Invalid upload path" });
    }
    fs.writeFileSync(destination, req.file.buffer, { flag: "wx" });
    req.file.filename = filename;
    req.file.path = destination;
    delete req.file.buffer;
    next();
  });
};

export default uploadSingle;

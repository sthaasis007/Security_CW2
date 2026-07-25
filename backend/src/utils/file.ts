import fs from "fs";
import path from "path";

export const deleteUploadFile = async (fileName?: string | null) => {
  if (!fileName) return;

  const uploadDir = path.join(process.cwd(), "backend", "uploads");
  const filePath = path.join(uploadDir, fileName);

  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      console.warn("Failed to delete upload:", fileName, err);
    }
  }
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUploadFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const deleteUploadFile = async (fileName) => {
    if (!fileName)
        return;
    const uploadDir = path_1.default.join(process.cwd(), "backend", "uploads");
    const filePath = path_1.default.join(uploadDir, fileName);
    try {
        await fs_1.default.promises.unlink(filePath);
    }
    catch (err) {
        const code = err.code;
        if (code !== "ENOENT") {
            console.warn("Failed to delete upload:", fileName, err);
        }
    }
};
exports.deleteUploadFile = deleteUploadFile;
//# sourceMappingURL=file.js.map
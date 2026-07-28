"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validateRequest = exports.validate = void 0;
const fs_1 = __importDefault(require("fs"));
const validate = (schemas) => (req, res, next) => {
    for (const [target, schema] of Object.entries(schemas)) {
        const parsed = schema.safeParse(req[target]);
        if (!parsed.success) {
            const uploadedPath = req.file?.path;
            if (uploadedPath) {
                try {
                    fs_1.default.unlinkSync(uploadedPath);
                }
                catch { /* best-effort cleanup */ }
            }
            return res.status(400).json({ ok: false, message: `Invalid request ${target}` });
        }
        // Express 5 exposes req.query through a getter, so it cannot be replaced.
        // Query values are validated here and controllers read the original values.
        if (target !== "query") {
            req[target] = parsed.data;
        }
    }
    next();
};
exports.validate = validate;
const validateRequest = (schema) => (0, exports.validate)({ body: schema });
exports.validateRequest = validateRequest;
const validateQuery = (schema) => (0, exports.validate)({ query: schema });
exports.validateQuery = validateQuery;
//# sourceMappingURL=validation.middleware.js.map
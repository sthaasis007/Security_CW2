"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validateRequest = void 0;
const validateRequest = (schema, options) => {
    return (req, res, next) => {
        try {
            const parsed = schema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ ok: false, message: "Validation error", errors: parsed.error.flatten().fieldErrors });
            }
            if (!options?.allowUnknown) {
                req.body = parsed.data;
            }
            next();
        }
        catch (error) {
            return res.status(400).json({ ok: false, message: "Validation error" });
        }
    };
};
exports.validateRequest = validateRequest;
const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            const parsed = schema.safeParse(req.query);
            if (!parsed.success) {
                return res.status(400).json({ ok: false, message: "Validation error", errors: parsed.error.flatten().fieldErrors });
            }
            req.query = parsed.data;
            next();
        }
        catch (error) {
            return res.status(400).json({ ok: false, message: "Validation error" });
        }
    };
};
exports.validateQuery = validateQuery;
//# sourceMappingURL=validation.middleware.js.map
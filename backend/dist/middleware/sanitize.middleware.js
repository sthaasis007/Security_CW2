"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sanitizeMiddleware;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const FORBIDDEN_KEYS = new Set(["$where", "$gt", "$gte", "$lt", "$lte", "$ne", "$in", "$nin", "$regex", "$options"]);
const DEBUG_LOG = path_1.default.resolve(__dirname, "..", "..", "sanitize-debug.log");
const logDebug = (entry) => {
    try {
        fs_1.default.appendFileSync(DEBUG_LOG, `${new Date().toISOString()} ${entry}\n`);
    }
    catch {
        // ignore logging failures to avoid breaking request processing
    }
};
const sanitizeValue = (value) => {
    if (value === null || value === undefined)
        return value;
    if (typeof value === "string")
        return value.trim();
    if (typeof value !== "object")
        return value;
    if (value instanceof Date || (typeof Buffer !== "undefined" && Buffer.isBuffer(value))) {
        return value;
    }
    if (Array.isArray(value)) {
        return value.map((item) => sanitizeValue(item));
    }
    if (typeof value.toJSON === "function") {
        try {
            return sanitizeValue(value.toJSON());
        }
        catch {
            return value;
        }
    }
    if (typeof value.toObject === "function") {
        try {
            return sanitizeValue(value.toObject());
        }
        catch {
            return value;
        }
    }
    const clean = {};
    for (const [key, child] of Object.entries(value)) {
        if (key.startsWith("$") || key.includes(".") || FORBIDDEN_KEYS.has(key)) {
            continue;
        }
        clean[key] = sanitizeValue(child);
    }
    return clean;
};
const safeSanitize = (target) => {
    if (target === undefined || target === null)
        return target;
    try {
        return sanitizeValue(target);
    }
    catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        logDebug(JSON.stringify({ event: "sanitizeMiddleware sanitize failure", error: error.message, stack: error.stack }));
        return target;
    }
};
const sanitizeInPlace = (target) => {
    if (target === undefined || target === null)
        return target;
    if (typeof target !== "object")
        return target;
    const sanitized = safeSanitize(target);
    if (sanitized === target)
        return target;
    if (Array.isArray(target) && Array.isArray(sanitized)) {
        target.length = 0;
        target.push(...sanitized);
        return target;
    }
    const keys = Object.keys(target);
    for (const key of keys) {
        delete target[key];
    }
    Object.assign(target, sanitized);
    return target;
};
function sanitizeMiddleware(req, res, next) {
    const debugEntry = {
        event: "sanitizeMiddleware incoming",
        method: req.method,
        path: req.path,
        bodyType: typeof req.body,
        body: req.body,
        query: req.query,
        params: req.params,
    };
    logDebug(JSON.stringify(debugEntry));
    try {
        if (req.body !== undefined && req.body !== null) {
            if (typeof req.body === "object") {
                sanitizeInPlace(req.body);
            }
            else {
                req.body = safeSanitize(req.body);
            }
        }
        const query = req.query;
        if (query && typeof query === "object") {
            sanitizeInPlace(query);
        }
        const params = req.params;
        if (params && typeof params === "object") {
            sanitizeInPlace(params);
        }
        next();
    }
    catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        const errorEntry = {
            event: "sanitizeMiddleware error",
            method: req.method,
            path: req.path,
            bodyType: typeof req.body,
            body: req.body,
            query: req.query,
            params: req.params,
            error: error.message,
            stack: error.stack,
        };
        logDebug(JSON.stringify(errorEntry));
        return res.status(400).json({ ok: false, message: "Invalid request parameters" });
    }
}
//# sourceMappingURL=sanitize.middleware.js.map
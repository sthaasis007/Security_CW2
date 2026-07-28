"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUpdateBody = exports.adminCreateBody = exports.profileUpdateBody = exports.activityQuery = exports.exportQuery = exports.paymentVerifyBody = exports.productUpdateBody = exports.productCreateBody = exports.favoriteBody = exports.cartUpdateBody = exports.cartAddBody = exports.emptyQuery = exports.productParams = exports.idParams = exports.objectId = exports.emptyObject = void 0;
const zod_1 = require("zod");
exports.emptyObject = zod_1.z.union([zod_1.z.undefined(), zod_1.z.object({}).strict()]);
exports.objectId = zod_1.z.string().regex(/^[a-f\d]{24}$/i);
exports.idParams = zod_1.z.object({ id: exports.objectId }).strict();
exports.productParams = zod_1.z.object({ productId: exports.objectId }).strict();
exports.emptyQuery = zod_1.z.object({}).strict();
const quantity = zod_1.z.coerce.number().int().min(1).max(100);
const option = zod_1.z.string().trim().min(1).max(50).optional();
exports.cartAddBody = zod_1.z.object({ productId: exports.objectId, quantity: quantity.optional(), selectedSize: option, selectedColor: option }).strict();
exports.cartUpdateBody = zod_1.z.object({ quantity: quantity.optional(), selectedSize: option, selectedColor: option }).strict()
    .refine((value) => Object.values(value).some((item) => item !== undefined));
exports.favoriteBody = zod_1.z.object({ productId: exports.objectId }).strict();
const placements = zod_1.z.union([zod_1.z.array(zod_1.z.string().trim().min(1).max(40)).max(10), zod_1.z.string().trim().max(200)]).optional();
const booleanField = zod_1.z.union([zod_1.z.boolean(), zod_1.z.enum(["true", "false"]).transform((value) => value === "true")]).optional();
exports.productCreateBody = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(120),
    price: zod_1.z.coerce.number().finite().positive().max(10000000),
    description: zod_1.z.string().trim().max(5000).optional(),
    placements,
    placement: zod_1.z.string().trim().max(40).optional(),
    displayOrder: zod_1.z.coerce.number().int().min(0).max(100000).optional(),
    available: booleanField,
}).strict();
exports.productUpdateBody = exports.productCreateBody.partial();
exports.paymentVerifyBody = zod_1.z.object({ pidx: zod_1.z.string().trim().min(1).max(200).regex(/^[A-Za-z0-9_-]+$/) }).strict();
exports.exportQuery = zod_1.z.object({ format: zod_1.z.enum(["json", "csv"]).default("json") }).strict();
exports.activityQuery = zod_1.z.object({
    action: zod_1.z.string().trim().max(100).optional(),
    user: zod_1.z.string().trim().max(254).optional(),
    search: zod_1.z.string().trim().max(200).optional(),
    from: zod_1.z.string().datetime().optional(),
    to: zod_1.z.string().datetime().optional(),
    severity: zod_1.z.enum(["info", "warning", "critical"]).optional(),
    alert: zod_1.z.enum(["true", "false"]).optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(25),
}).strict();
const strongPassword = zod_1.z.string().min(12).max(128)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/);
exports.profileUpdateBody = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(80).optional(),
    email: zod_1.z.string().trim().email().max(254).optional(),
    password: strongPassword.optional(),
}).strict();
exports.adminCreateBody = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(80),
    email: zod_1.z.string().trim().email().max(254),
    password: strongPassword,
    role: zod_1.z.enum(["user", "admin"]).default("user"),
}).strict();
exports.adminUpdateBody = exports.adminCreateBody.partial();
//# sourceMappingURL=api.schemas.js.map
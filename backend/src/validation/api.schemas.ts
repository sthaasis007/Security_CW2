import { z } from "zod";

export const emptyObject = z.union([z.undefined(), z.object({}).strict()]);
export const objectId = z.string().regex(/^[a-f\d]{24}$/i);
export const idParams = z.object({ id: objectId }).strict();
export const productParams = z.object({ productId: objectId }).strict();
export const emptyQuery = z.object({}).strict();

const quantity = z.coerce.number().int().min(1).max(100);
const option = z.string().trim().min(1).max(50).optional();
export const cartAddBody = z.object({ productId: objectId, quantity: quantity.optional(), selectedSize: option, selectedColor: option }).strict();
export const cartUpdateBody = z.object({ quantity: quantity.optional(), selectedSize: option, selectedColor: option }).strict()
  .refine((value) => Object.values(value).some((item) => item !== undefined));
export const favoriteBody = z.object({ productId: objectId }).strict();

const placements = z.union([z.array(z.string().trim().min(1).max(40)).max(10), z.string().trim().max(200)]).optional();
const booleanField = z.union([z.boolean(), z.enum(["true", "false"]).transform((value) => value === "true")]).optional();
export const productCreateBody = z.object({
  name: z.string().trim().min(1).max(120),
  price: z.coerce.number().finite().positive().max(10000000),
  description: z.string().trim().max(5000).optional(),
  placements,
  placement: z.string().trim().max(40).optional(),
  displayOrder: z.coerce.number().int().min(0).max(100000).optional(),
  available: booleanField,
}).strict();
export const productUpdateBody = productCreateBody.partial();

export const paymentVerifyBody = z.object({ pidx: z.string().trim().min(1).max(200).regex(/^[A-Za-z0-9_-]+$/) }).strict();
export const exportQuery = z.object({ format: z.enum(["json", "csv"]).default("json") }).strict();
export const activityQuery = z.object({
  action: z.string().trim().max(100).optional(),
  user: z.string().trim().max(254).optional(),
  search: z.string().trim().max(200).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  severity: z.enum(["info", "warning", "critical"]).optional(),
  alert: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
}).strict();

const strongPassword = z.string().min(12).max(128)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/);
export const profileUpdateBody = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  email: z.string().trim().email().max(254).optional(),
  password: strongPassword.optional(),
}).strict();
export const adminCreateBody = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254),
  password: strongPassword,
  role: z.enum(["user", "admin"]).default("user"),
}).strict();
export const adminUpdateBody = adminCreateBody.partial();

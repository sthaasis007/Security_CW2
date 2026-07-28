import { z } from "zod";
export declare const emptyObject: z.ZodUnion<readonly [z.ZodUndefined, z.ZodObject<{}, z.core.$strict>]>;
export declare const objectId: z.ZodString;
export declare const idParams: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strict>;
export declare const productParams: z.ZodObject<{
    productId: z.ZodString;
}, z.core.$strict>;
export declare const emptyQuery: z.ZodObject<{}, z.core.$strict>;
export declare const cartAddBody: z.ZodObject<{
    productId: z.ZodString;
    quantity: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    selectedSize: z.ZodOptional<z.ZodString>;
    selectedColor: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const cartUpdateBody: z.ZodObject<{
    quantity: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    selectedSize: z.ZodOptional<z.ZodString>;
    selectedColor: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const favoriteBody: z.ZodObject<{
    productId: z.ZodString;
}, z.core.$strict>;
export declare const productCreateBody: z.ZodObject<{
    name: z.ZodString;
    price: z.ZodCoercedNumber<unknown>;
    description: z.ZodOptional<z.ZodString>;
    placements: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodString]>>;
    placement: z.ZodOptional<z.ZodString>;
    displayOrder: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    available: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodPipe<z.ZodEnum<{
        true: "true";
        false: "false";
    }>, z.ZodTransform<boolean, "true" | "false">>]>>;
}, z.core.$strict>;
export declare const productUpdateBody: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    placements: z.ZodOptional<z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodString]>>>;
    placement: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    displayOrder: z.ZodOptional<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    available: z.ZodOptional<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodPipe<z.ZodEnum<{
        true: "true";
        false: "false";
    }>, z.ZodTransform<boolean, "true" | "false">>]>>>;
}, z.core.$strict>;
export declare const paymentVerifyBody: z.ZodObject<{
    pidx: z.ZodString;
}, z.core.$strict>;
export declare const exportQuery: z.ZodObject<{
    format: z.ZodDefault<z.ZodEnum<{
        json: "json";
        csv: "csv";
    }>>;
}, z.core.$strict>;
export declare const activityQuery: z.ZodObject<{
    action: z.ZodOptional<z.ZodString>;
    user: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    severity: z.ZodOptional<z.ZodEnum<{
        info: "info";
        warning: "warning";
        critical: "critical";
    }>>;
    alert: z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strict>;
export declare const profileUpdateBody: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const adminCreateBody: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        user: "user";
        admin: "admin";
    }>>;
}, z.core.$strict>;
export declare const adminUpdateBody: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        user: "user";
        admin: "admin";
    }>>>;
}, z.core.$strict>;
//# sourceMappingURL=api.schemas.d.ts.map
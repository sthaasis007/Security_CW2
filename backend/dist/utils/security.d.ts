import { Request } from "express";
export declare const PASSWORD_POLICY: RegExp;
export declare const isPasswordStrong: (password: string) => boolean;
export declare const sanitizeText: (value: unknown) => string | null;
export declare const sanitizeHtml: (value: unknown) => string;
export declare const isValidObjectId: (value: unknown) => value is string;
export declare const getClientIp: (req: Request) => string;
export declare const hashSecret: (value: string) => string;
export declare const isSafeFilename: (value: string) => boolean;
export declare const getPasswordExpiryDays: () => number;
//# sourceMappingURL=security.d.ts.map
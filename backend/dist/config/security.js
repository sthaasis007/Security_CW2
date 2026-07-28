"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSecurityConfiguration = exports.getJwtSecret = void 0;
const INSECURE_JWT_SECRETS = new Set([
    "change_me_local_secret",
    "everblue_local_secret",
    "secret",
    "dev_secret",
]);
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET?.trim();
    if (!secret || secret.length < 32 || INSECURE_JWT_SECRETS.has(secret)) {
        throw new Error("JWT_SECRET must be a non-placeholder secret of at least 32 characters");
    }
    return secret;
};
exports.getJwtSecret = getJwtSecret;
const validateSecurityConfiguration = () => {
    (0, exports.getJwtSecret)();
    if (process.env.NODE_ENV === "production") {
        if (!process.env.CAPTCHA_SECRET?.trim()) {
            throw new Error("CAPTCHA_SECRET is required in production");
        }
        const hops = Number(process.env.TRUST_PROXY_HOPS || 0);
        if (!Number.isInteger(hops) || hops < 0) {
            throw new Error("TRUST_PROXY_HOPS must be a non-negative integer");
        }
    }
};
exports.validateSecurityConfiguration = validateSecurityConfiguration;
//# sourceMappingURL=security.js.map
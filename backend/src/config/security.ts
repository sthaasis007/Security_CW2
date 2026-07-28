const INSECURE_JWT_SECRETS = new Set([
  "change_me_local_secret",
  "everblue_local_secret",
  "secret",
  "dev_secret",
]);

export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || secret.length < 32 || INSECURE_JWT_SECRETS.has(secret)) {
    throw new Error("JWT_SECRET must be a non-placeholder secret of at least 32 characters");
  }
  return secret;
};

export const validateSecurityConfiguration = (): void => {
  getJwtSecret();
  if (process.env.NODE_ENV === "production") {
    if (process.env.KHALTI_TEST_MODE === "true") {
      throw new Error("KHALTI_TEST_MODE cannot be enabled in production");
    }
    if (!process.env.CAPTCHA_SECRET?.trim()) {
      throw new Error("CAPTCHA_SECRET is required in production");
    }
    const hops = Number(process.env.TRUST_PROXY_HOPS || 0);
    if (!Number.isInteger(hops) || hops < 0) {
      throw new Error("TRUST_PROXY_HOPS must be a non-negative integer");
    }
  }
};

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
};

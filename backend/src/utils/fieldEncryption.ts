import crypto from "crypto";

const keyForVersion = (version: string) => {
  const entries = [
    `${process.env.FIELD_ENCRYPTION_KEY_VERSION || "v1"}:${process.env.FIELD_ENCRYPTION_KEY || ""}`,
    ...(process.env.FIELD_ENCRYPTION_KEY_PREVIOUS || "").split(","),
  ];
  const entry = entries.map((value) => value.trim()).find((value) => value.startsWith(`${version}:`));
  if (!entry) throw new Error("Encryption key version is unavailable");
  const key = Buffer.from(entry.slice(version.length + 1), "base64");
  if (key.length !== 32) throw new Error("Field encryption key must be exactly 32 bytes");
  return key;
};

export const encryptField = (plaintext: string, fieldName: string) => {
  if (!plaintext || plaintext.startsWith("enc:")) return plaintext;
  const version = process.env.FIELD_ENCRYPTION_KEY_VERSION || "v1";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", keyForVersion(version), iv);
  cipher.setAAD(Buffer.from(`${version}:${fieldName}`));
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return ["enc", version, iv.toString("base64"), cipher.getAuthTag().toString("base64"), ciphertext.toString("base64")].join(":");
};

export const decryptField = (value: string, fieldName: string) => {
  if (!value || !value.startsWith("enc:")) return value;
  const [prefix, version, ivText, tagText, ciphertextText] = value.split(":");
  if (prefix !== "enc" || !version || !ivText || !tagText || !ciphertextText) throw new Error("Invalid encrypted field");
  const decipher = crypto.createDecipheriv("aes-256-gcm", keyForVersion(version), Buffer.from(ivText, "base64"));
  decipher.setAAD(Buffer.from(`${version}:${fieldName}`));
  decipher.setAuthTag(Buffer.from(tagText, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(ciphertextText, "base64")), decipher.final()]).toString("utf8");
};

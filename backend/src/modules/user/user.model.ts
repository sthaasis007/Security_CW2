import mongoose from "mongoose";
import { decryptField, encryptField } from "../../utils/fieldEncryption";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    // Keep recent password hashes to prevent reuse (most recent first)
    passwordHistory: [
      {
        hash: { type: String },
        changedAt: { type: Date },
      },
    ],
    image: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passwordChangedAt: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    resetPasswordUsed: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    emailVerifiedAt: { type: Date, default: null },
    emailVerificationToken: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },
    refreshTokenHash: { type: String, default: null },
    previousRefreshTokenHash: { type: String, default: null },
    refreshTokenExpiresAt: { type: Date, default: null },
    sessionVersion: { type: Number, default: 0 },
    csrfTokenHash: { type: String, default: null },
    csrfTokenExpiresAt: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    mfaEnabled: { type: Boolean, default: false },
    mfaMethod: { type: String, enum: ["none", "email"], default: "none" },
    mfaChallengeHash: { type: String, default: null },
    mfaChallengeExpiresAt: { type: Date, default: null },
    mfaChallengeAttempts: { type: Number, default: 0 },
    mfaChallengePurpose: { type: String, enum: ["login", "setup", null], default: null },
    mfaRecoveryCodeHashes: { type: [String], default: [] },
    deviceInfo: {
      type: String,
      default: null,
      set: (value: string | null) => value ? encryptField(value, "user.deviceInfo") : value,
      get: (value: string | null) => value ? decryptField(value, "user.deviceInfo") : value,
    },
  },
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } }
);

export const UserModel = mongoose.model("User", userSchema);

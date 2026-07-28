"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
    deviceInfo: { type: String, default: null },
}, { timestamps: true });
exports.UserModel = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=user.model.js.map
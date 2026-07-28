"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const user_model_1 = require("../user/user.model");
exports.AuthRepository = {
    findByEmail: (email) => user_model_1.UserModel.findOne({ email }),
    createUser: (data) => {
        const toCreate = { ...data };
        if (toCreate.password) {
            toCreate.passwordHistory = [{ hash: toCreate.password, changedAt: new Date() }];
            toCreate.passwordChangedAt = new Date();
        }
        return user_model_1.UserModel.create(toCreate);
    },
    findById: (id) => user_model_1.UserModel.findById(id),
    findByResetToken: (tokenHash) => user_model_1.UserModel.findOne({ resetPasswordToken: tokenHash }),
    findByEmailVerificationToken: (tokenHash) => user_model_1.UserModel.findOne({ emailVerificationToken: tokenHash }),
    findAll: () => user_model_1.UserModel.find().select("-password").lean(),
    updateUser: (id, data) => user_model_1.UserModel.findByIdAndUpdate(id, data, { new: true }).select("-password"),
    setResetToken: (id, tokenHash, expiresAt) => user_model_1.UserModel.findByIdAndUpdate(id, {
        resetPasswordToken: tokenHash,
        resetPasswordExpires: expiresAt,
        resetPasswordUsed: false,
    }),
    updatePasswordAndClearReset: (id, hashedPassword) => (async () => {
        const user = await user_model_1.UserModel.findById(id);
        if (!user)
            return null;
        const prevHash = user.password;
        const prevHistory = user.passwordHistory || [];
        const nextHistory = Array.isArray(prevHistory) ? prevHistory.slice() : [];
        if (prevHash) {
            nextHistory.unshift({ hash: prevHash, changedAt: new Date() });
        }
        // keep only last 5
        if (nextHistory.length > 5)
            nextHistory.splice(5);
        return user_model_1.UserModel.findByIdAndUpdate(id, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
            resetPasswordUsed: true,
            passwordChangedAt: new Date(),
            loginAttempts: 0,
            lockUntil: null,
            passwordHistory: nextHistory,
        }, { new: true });
    })(),
    updatePassword: (id, hashedPassword) => (async () => {
        const user = await user_model_1.UserModel.findById(id);
        if (!user)
            return null;
        const history = Array.isArray(user.passwordHistory) ? [...user.passwordHistory] : [];
        if (user.password)
            history.unshift({ hash: user.password, changedAt: new Date() });
        return user_model_1.UserModel.findByIdAndUpdate(id, {
            password: hashedPassword,
            passwordHistory: history.slice(0, 5),
            passwordChangedAt: new Date(),
            resetPasswordToken: null,
            resetPasswordExpires: null,
            resetPasswordUsed: true,
            loginAttempts: 0,
            lockUntil: null,
        }, { new: true });
    })(),
    setEmailVerificationToken: (id, tokenHash, expiresAt) => user_model_1.UserModel.findByIdAndUpdate(id, {
        emailVerificationToken: tokenHash,
        emailVerificationExpires: expiresAt,
    }),
    verifyEmail: (id) => user_model_1.UserModel.findByIdAndUpdate(id, {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        emailVerifiedAt: new Date(),
    }),
    markEmailUnverified: (id) => user_model_1.UserModel.findByIdAndUpdate(id, {
        emailVerified: false,
        emailVerifiedAt: null,
        emailVerificationToken: null,
        emailVerificationExpires: null,
    }),
    setRefreshToken: (id, tokenHash, expiresAt) => user_model_1.UserModel.findByIdAndUpdate(id, {
        refreshTokenHash: tokenHash,
        refreshTokenExpiresAt: expiresAt,
    }),
    rotateRefreshToken: (id, currentHash, nextHash, expiresAt) => user_model_1.UserModel.findByIdAndUpdate(id, {
        previousRefreshTokenHash: currentHash,
        refreshTokenHash: nextHash,
        refreshTokenExpiresAt: expiresAt,
    }),
    clearCsrfToken: (id) => user_model_1.UserModel.findByIdAndUpdate(id, { csrfTokenHash: null, csrfTokenExpiresAt: null }),
    setCsrfToken: (id, csrfHash, expiresAt) => user_model_1.UserModel.findByIdAndUpdate(id, { csrfTokenHash: csrfHash, csrfTokenExpiresAt: expiresAt }),
    findByRefreshTokenHash: (tokenHash) => user_model_1.UserModel.findOne({ refreshTokenHash: tokenHash }),
    findByPreviousRefreshTokenHash: (tokenHash) => user_model_1.UserModel.findOne({ previousRefreshTokenHash: tokenHash }),
    clearRefreshToken: (id) => user_model_1.UserModel.findByIdAndUpdate(id, {
        refreshTokenHash: null,
        previousRefreshTokenHash: null,
        refreshTokenExpiresAt: null,
    }),
    invalidateSessions: (id) => user_model_1.UserModel.findByIdAndUpdate(id, {
        $inc: { sessionVersion: 1 },
        refreshTokenHash: null,
        previousRefreshTokenHash: null,
        refreshTokenExpiresAt: null,
        csrfTokenHash: null,
        csrfTokenExpiresAt: null,
    }),
    setMfaChallenge: (id, hash, expiresAt, purpose) => user_model_1.UserModel.findByIdAndUpdate(id, {
        mfaChallengeHash: hash,
        mfaChallengeExpiresAt: expiresAt,
        mfaChallengeAttempts: 0,
        mfaChallengePurpose: purpose,
    }),
    incrementMfaAttempts: (id) => user_model_1.UserModel.findByIdAndUpdate(id, { $inc: { mfaChallengeAttempts: 1 } }, { new: true }),
    clearMfaChallenge: (id) => user_model_1.UserModel.findByIdAndUpdate(id, {
        mfaChallengeHash: null,
        mfaChallengeExpiresAt: null,
        mfaChallengeAttempts: 0,
        mfaChallengePurpose: null,
    }),
    enableMfa: (id, recoveryCodeHashes) => user_model_1.UserModel.findByIdAndUpdate(id, {
        mfaEnabled: true,
        mfaMethod: "email",
        mfaRecoveryCodeHashes: recoveryCodeHashes,
        mfaChallengeHash: null,
        mfaChallengeExpiresAt: null,
        mfaChallengeAttempts: 0,
        mfaChallengePurpose: null,
    }, { new: true }),
    disableMfa: (id) => user_model_1.UserModel.findByIdAndUpdate(id, {
        mfaEnabled: false,
        mfaMethod: "none",
        mfaRecoveryCodeHashes: [],
        mfaChallengeHash: null,
        mfaChallengeExpiresAt: null,
        mfaChallengeAttempts: 0,
        mfaChallengePurpose: null,
    }),
    consumeRecoveryCode: (id, hash) => user_model_1.UserModel.findByIdAndUpdate(id, { $pull: { mfaRecoveryCodeHashes: hash } }),
    incrementLoginAttempts: (id) => user_model_1.UserModel.findByIdAndUpdate(id, { $inc: { loginAttempts: 1 } }, { new: true }),
    resetLoginAttempts: (id) => user_model_1.UserModel.findByIdAndUpdate(id, { loginAttempts: 0, lockUntil: null }, { new: true }),
    lockAccount: (id, lockUntil) => user_model_1.UserModel.findByIdAndUpdate(id, { lockUntil }, { new: true }),
    deleteUser: (id) => user_model_1.UserModel.findByIdAndDelete(id),
};
//# sourceMappingURL=auth.repository.js.map
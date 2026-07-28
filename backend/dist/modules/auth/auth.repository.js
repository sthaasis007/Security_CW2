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
        }
        return user_model_1.UserModel.create(toCreate);
    },
    findById: (id) => user_model_1.UserModel.findById(id),
    findByResetToken: (tokenHash) => user_model_1.UserModel.findOne({ resetPasswordToken: tokenHash }),
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
    setRefreshToken: (id, tokenHash, expiresAt) => user_model_1.UserModel.findByIdAndUpdate(id, {
        refreshTokenHash: tokenHash,
        refreshTokenExpiresAt: expiresAt,
    }),
    clearCsrfToken: (id) => user_model_1.UserModel.findByIdAndUpdate(id, { csrfTokenHash: null, csrfTokenExpiresAt: null }),
    setCsrfToken: (id, csrfHash, expiresAt) => user_model_1.UserModel.findByIdAndUpdate(id, { csrfTokenHash: csrfHash, csrfTokenExpiresAt: expiresAt }),
    findByRefreshTokenHash: (tokenHash) => user_model_1.UserModel.findOne({ refreshTokenHash: tokenHash }),
    clearRefreshToken: (id) => user_model_1.UserModel.findByIdAndUpdate(id, {
        refreshTokenHash: null,
        refreshTokenExpiresAt: null,
    }),
    incrementLoginAttempts: (id) => user_model_1.UserModel.findByIdAndUpdate(id, { $inc: { loginAttempts: 1 } }, { new: true }),
    resetLoginAttempts: (id) => user_model_1.UserModel.findByIdAndUpdate(id, { loginAttempts: 0, lockUntil: null }, { new: true }),
    lockAccount: (id, lockUntil) => user_model_1.UserModel.findByIdAndUpdate(id, { lockUntil }, { new: true }),
    deleteUser: (id) => user_model_1.UserModel.findByIdAndDelete(id),
};
//# sourceMappingURL=auth.repository.js.map
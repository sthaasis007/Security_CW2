import { UserModel } from "../user/user.model";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  image?: string;
}

export const AuthRepository = {
  findByEmail: (email: string) => UserModel.findOne({ email }),
  createUser: (data: CreateUserData) => {
    const toCreate: any = { ...data };
    if (toCreate.password) {
      toCreate.passwordHistory = [{ hash: toCreate.password, changedAt: new Date() }];
      toCreate.passwordChangedAt = new Date();
    }
    return UserModel.create(toCreate as any);
  },
  findById: (id: string) => UserModel.findById(id),
  findByResetToken: (tokenHash: string) => UserModel.findOne({ resetPasswordToken: tokenHash }),
  findByEmailVerificationToken: (tokenHash: string) => UserModel.findOne({ emailVerificationToken: tokenHash }),
  findAll: () => UserModel.find().select("-password").lean(),
  updateUser: (id: string, data: Partial<CreateUserData>) =>
    UserModel.findByIdAndUpdate(id, data, { new: true }).select("-password"),
  setResetToken: (id: string, tokenHash: string, expiresAt: Date) =>
    UserModel.findByIdAndUpdate(id, {
      resetPasswordToken: tokenHash,
      resetPasswordExpires: expiresAt,
      resetPasswordUsed: false,
    }),
  updatePasswordAndClearReset: (id: string, hashedPassword: string) =>
    (async () => {
      const user = await UserModel.findById(id);
      if (!user) return null;
      const prevHash = (user as any).password;
      const prevHistory = (user as any).passwordHistory || [];
      const nextHistory = Array.isArray(prevHistory) ? prevHistory.slice() : [];
      if (prevHash) {
        nextHistory.unshift({ hash: prevHash, changedAt: new Date() });
      }
      // keep only last 5
      if (nextHistory.length > 5) nextHistory.splice(5);

      return UserModel.findByIdAndUpdate(
        id,
        {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
          resetPasswordUsed: true,
          passwordChangedAt: new Date(),
          loginAttempts: 0,
          lockUntil: null,
          passwordHistory: nextHistory,
        },
        { new: true }
      );
    })(),
  updatePassword: (id: string, hashedPassword: string) =>
    (async () => {
      const user = await UserModel.findById(id);
      if (!user) return null;
      const history = Array.isArray((user as any).passwordHistory) ? [...(user as any).passwordHistory] : [];
      if ((user as any).password) history.unshift({ hash: (user as any).password, changedAt: new Date() });
      return UserModel.findByIdAndUpdate(id, {
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
  setEmailVerificationToken: (id: string, tokenHash: string, expiresAt: Date) =>
    UserModel.findByIdAndUpdate(id, {
      emailVerificationToken: tokenHash,
      emailVerificationExpires: expiresAt,
    }),
  verifyEmail: (id: string) =>
    UserModel.findByIdAndUpdate(id, {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
      emailVerifiedAt: new Date(),
    }),
  markEmailUnverified: (id: string) =>
    UserModel.findByIdAndUpdate(id, {
      emailVerified: false,
      emailVerifiedAt: null,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    }),
  setRefreshToken: (id: string, tokenHash: string, expiresAt: Date) =>
    UserModel.findByIdAndUpdate(id, {
      refreshTokenHash: tokenHash,
      refreshTokenExpiresAt: expiresAt,
    }),
  rotateRefreshToken: (id: string, currentHash: string, nextHash: string, expiresAt: Date) =>
    UserModel.findByIdAndUpdate(id, {
      previousRefreshTokenHash: currentHash,
      refreshTokenHash: nextHash,
      refreshTokenExpiresAt: expiresAt,
    }),
  clearCsrfToken: (id: string) =>
    UserModel.findByIdAndUpdate(id, { csrfTokenHash: null, csrfTokenExpiresAt: null }),
  setCsrfToken: (id: string, csrfHash: string, expiresAt: Date) =>
    UserModel.findByIdAndUpdate(id, { csrfTokenHash: csrfHash, csrfTokenExpiresAt: expiresAt }),
  findByRefreshTokenHash: (tokenHash: string) => UserModel.findOne({ refreshTokenHash: tokenHash }),
  findByPreviousRefreshTokenHash: (tokenHash: string) => UserModel.findOne({ previousRefreshTokenHash: tokenHash }),
  clearRefreshToken: (id: string) =>
    UserModel.findByIdAndUpdate(id, {
      refreshTokenHash: null,
      previousRefreshTokenHash: null,
      refreshTokenExpiresAt: null,
    }),
  invalidateSessions: (id: string) =>
    UserModel.findByIdAndUpdate(id, {
      $inc: { sessionVersion: 1 },
      refreshTokenHash: null,
      previousRefreshTokenHash: null,
      refreshTokenExpiresAt: null,
      csrfTokenHash: null,
      csrfTokenExpiresAt: null,
    }),
  setMfaChallenge: (id: string, hash: string, expiresAt: Date, purpose: "login" | "setup") =>
    UserModel.findByIdAndUpdate(id, {
      mfaChallengeHash: hash,
      mfaChallengeExpiresAt: expiresAt,
      mfaChallengeAttempts: 0,
      mfaChallengePurpose: purpose,
    }),
  incrementMfaAttempts: (id: string) =>
    UserModel.findByIdAndUpdate(id, { $inc: { mfaChallengeAttempts: 1 } }, { new: true }),
  clearMfaChallenge: (id: string) =>
    UserModel.findByIdAndUpdate(id, {
      mfaChallengeHash: null,
      mfaChallengeExpiresAt: null,
      mfaChallengeAttempts: 0,
      mfaChallengePurpose: null,
    }),
  enableMfa: (id: string, recoveryCodeHashes: string[]) =>
    UserModel.findByIdAndUpdate(id, {
      mfaEnabled: true,
      mfaMethod: "email",
      mfaRecoveryCodeHashes: recoveryCodeHashes,
      mfaChallengeHash: null,
      mfaChallengeExpiresAt: null,
      mfaChallengeAttempts: 0,
      mfaChallengePurpose: null,
    }, { new: true }),
  disableMfa: (id: string) =>
    UserModel.findByIdAndUpdate(id, {
      mfaEnabled: false,
      mfaMethod: "none",
      mfaRecoveryCodeHashes: [],
      mfaChallengeHash: null,
      mfaChallengeExpiresAt: null,
      mfaChallengeAttempts: 0,
      mfaChallengePurpose: null,
    }),
  consumeRecoveryCode: (id: string, hash: string) =>
    UserModel.findByIdAndUpdate(id, { $pull: { mfaRecoveryCodeHashes: hash } }),
  incrementLoginAttempts: (id: string) =>
    UserModel.findByIdAndUpdate(id, { $inc: { loginAttempts: 1 } }, { new: true }),
  resetLoginAttempts: (id: string) =>
    UserModel.findByIdAndUpdate(id, { loginAttempts: 0, lockUntil: null }, { new: true }),
  lockAccount: (id: string, lockUntil: Date) =>
    UserModel.findByIdAndUpdate(id, { lockUntil }, { new: true }),
  deleteUser: (id: string) => UserModel.findByIdAndDelete(id),
};

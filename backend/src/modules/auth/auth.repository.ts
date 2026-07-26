import { UserModel } from "../user/user.model";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | string;
}

export const AuthRepository = {
  findByEmail: (email: string) => UserModel.findOne({ email }),
  createUser: (data: CreateUserData) => {
    const toCreate: any = { ...data };
    if (toCreate.password) {
      toCreate.passwordHistory = [{ hash: toCreate.password, changedAt: new Date() }];
    }
    return UserModel.create(toCreate as any);
  },
  findById: (id: string) => UserModel.findById(id),
  findByResetToken: (tokenHash: string) => UserModel.findOne({ resetPasswordToken: tokenHash }),
  findAll: () => UserModel.find().select("-password"),
  updateUser: (id: string, data: Partial<CreateUserData & { image?: string }>) =>
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
  setRefreshToken: (id: string, tokenHash: string, expiresAt: Date) =>
    UserModel.findByIdAndUpdate(id, {
      refreshTokenHash: tokenHash,
      refreshTokenExpiresAt: expiresAt,
    }),
  clearCsrfToken: (id: string) =>
    UserModel.findByIdAndUpdate(id, { csrfTokenHash: null, csrfTokenExpiresAt: null }),
  setCsrfToken: (id: string, csrfHash: string, expiresAt: Date) =>
    UserModel.findByIdAndUpdate(id, { csrfTokenHash: csrfHash, csrfTokenExpiresAt: expiresAt }),
  findByRefreshTokenHash: (tokenHash: string) => UserModel.findOne({ refreshTokenHash: tokenHash }),
  clearRefreshToken: (id: string) =>
    UserModel.findByIdAndUpdate(id, {
      refreshTokenHash: null,
      refreshTokenExpiresAt: null,
    }),
  incrementLoginAttempts: (id: string) =>
    UserModel.findByIdAndUpdate(id, { $inc: { loginAttempts: 1 } }, { new: true }),
  resetLoginAttempts: (id: string) =>
    UserModel.findByIdAndUpdate(id, { loginAttempts: 0, lockUntil: null }, { new: true }),
  lockAccount: (id: string, lockUntil: Date) =>
    UserModel.findByIdAndUpdate(id, { lockUntil }, { new: true }),
  deleteUser: (id: string) => UserModel.findByIdAndDelete(id),
};

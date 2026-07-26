import { UserModel } from "../user/user.model";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | string;
}

export const AuthRepository = {
  findByEmail: (email: string) => UserModel.findOne({ email }),
  createUser: (data: CreateUserData) => UserModel.create(data as any),
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
    UserModel.findByIdAndUpdate(id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      resetPasswordUsed: true,
      passwordChangedAt: new Date(),
      loginAttempts: 0,
      lockUntil: null,
    }),
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

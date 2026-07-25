import { UserModel } from "../user/user.model";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const AuthRepository = {
  findByEmail: (email: string) => UserModel.findOne({ email }),
  createUser: (data: CreateUserData) => UserModel.create(data),
  findById: (id: string) => UserModel.findById(id),
  findByResetToken: (tokenHash: string) => UserModel.findOne({ resetPasswordToken: tokenHash }),
  findAll: () => UserModel.find().select("-password"),
  updateUser: (id: string, data: Partial<CreateUserData & { image?: string }>) =>
    UserModel.findByIdAndUpdate(id, data, { new: true }).select("-password"),
  setResetToken: (id: string, tokenHash: string, expiresAt: Date) =>
    UserModel.findByIdAndUpdate(id, { resetPasswordToken: tokenHash, resetPasswordExpires: expiresAt }),
  updatePasswordAndClearReset: (id: string, hashedPassword: string) =>
    UserModel.findByIdAndUpdate(id, { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null }),
  deleteUser: (id: string) => UserModel.findByIdAndDelete(id),
};

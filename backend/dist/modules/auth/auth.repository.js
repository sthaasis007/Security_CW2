"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const user_model_1 = require("../user/user.model");
exports.AuthRepository = {
    findByEmail: (email) => user_model_1.UserModel.findOne({ email }),
    createUser: (data) => user_model_1.UserModel.create(data),
    findById: (id) => user_model_1.UserModel.findById(id),
    findByResetToken: (tokenHash) => user_model_1.UserModel.findOne({ resetPasswordToken: tokenHash }),
    findAll: () => user_model_1.UserModel.find().select("-password"),
    updateUser: (id, data) => user_model_1.UserModel.findByIdAndUpdate(id, data, { new: true }).select("-password"),
    setResetToken: (id, tokenHash, expiresAt) => user_model_1.UserModel.findByIdAndUpdate(id, { resetPasswordToken: tokenHash, resetPasswordExpires: expiresAt }),
    updatePasswordAndClearReset: (id, hashedPassword) => user_model_1.UserModel.findByIdAndUpdate(id, { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null }),
    deleteUser: (id) => user_model_1.UserModel.findByIdAndDelete(id),
};
//# sourceMappingURL=auth.repository.js.map
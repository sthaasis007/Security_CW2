"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../user/user.model");
const cart_model_1 = require("../cart/cart.model");
const favorite_model_1 = require("../favorite/favorite.model");
const order_model_1 = require("../payment/order.model");
const activity_model_1 = require("../activity/activity.model");
exports.PrivacyService = {
    async exportForUser(userId) {
        const [user, cart, favorites, orders, activities] = await Promise.all([
            user_model_1.UserModel.findById(userId).select("name email image emailVerified emailVerifiedAt mfaEnabled createdAt updatedAt").lean(),
            cart_model_1.CartModel.findOne({ userId }).select("-_id items createdAt updatedAt").lean(),
            favorite_model_1.FavoriteModel.find({ userId }).select("-_id -userId productId productName productPrice createdAt").lean(),
            order_model_1.OrderModel.find({ userId }).select("-_id -userId items totalAmountPaisa currency status provider providerStatus paidAt createdAt updatedAt").lean(),
            activity_model_1.ActivityModel.find({ userId }).select("-_id -userId -integrityHash -ip -userAgent -metadata").sort({ createdAt: -1 }).lean(),
        ]);
        if (!user)
            return null;
        return { exportVersion: 1, exportedAt: new Date().toISOString(), profile: user, cart: cart || { items: [] }, favorites, orders, activity: activities };
    },
    importProfile: (userId, profile) => user_model_1.UserModel.findByIdAndUpdate(userId, { name: profile.name }, { new: true }).select("name email image emailVerified mfaEnabled"),
    async deleteAccount(userId) {
        const session = await mongoose_1.default.startSession();
        let deleted = null;
        try {
            await session.withTransaction(async () => {
                deleted = await user_model_1.UserModel.findByIdAndDelete(userId, { session });
                if (!deleted)
                    return;
                await cart_model_1.CartModel.deleteMany({ userId }, { session });
                await favorite_model_1.FavoriteModel.deleteMany({ userId }, { session });
                await order_model_1.OrderModel.deleteMany({ userId }, { session });
                await activity_model_1.ActivityModel.deleteMany({ userId }, { session });
            });
            return deleted;
        }
        finally {
            await session.endSession();
        }
    },
};
//# sourceMappingURL=privacy.service.js.map
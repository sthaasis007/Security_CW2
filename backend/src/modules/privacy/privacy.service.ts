import mongoose from "mongoose";
import { UserModel } from "../user/user.model";
import { CartModel } from "../cart/cart.model";
import { FavoriteModel } from "../favorite/favorite.model";
import { OrderModel } from "../payment/order.model";
import { ActivityModel } from "../activity/activity.model";

export const PrivacyService = {
  async exportForUser(userId: string) {
    const [user, cart, favorites, orders, activities] = await Promise.all([
      UserModel.findById(userId).select("name email image emailVerified emailVerifiedAt mfaEnabled createdAt updatedAt").lean(),
      CartModel.findOne({ userId }).select("-_id items createdAt updatedAt").lean(),
      FavoriteModel.find({ userId }).select("-_id -userId productId productName productPrice createdAt").lean(),
      OrderModel.find({ userId }).select("-_id -userId items totalAmountPaisa currency status provider providerStatus paidAt createdAt updatedAt").lean(),
      ActivityModel.find({ userId }).select("-_id -userId -integrityHash -ip -userAgent -metadata").sort({ createdAt: -1 }).lean(),
    ]);
    if (!user) return null;
    return { exportVersion: 1, exportedAt: new Date().toISOString(), profile: user, cart: cart || { items: [] }, favorites, orders, activity: activities };
  },

  importProfile: (userId: string, profile: { name: string }) =>
    UserModel.findByIdAndUpdate(userId, { name: profile.name }, { new: true }).select("name email image emailVerified mfaEnabled"),

  async deleteAccount(userId: string) {
    const session = await mongoose.startSession();
    let deleted: any = null;
    try {
      await session.withTransaction(async () => {
        deleted = await UserModel.findByIdAndDelete(userId, { session });
        if (!deleted) return;
        await CartModel.deleteMany({ userId }, { session });
        await FavoriteModel.deleteMany({ userId }, { session });
        await OrderModel.deleteMany({ userId }, { session });
        await ActivityModel.deleteMany({ userId }, { session });
      });
      return deleted;
    } finally {
      await session.endSession();
    }
  },
};

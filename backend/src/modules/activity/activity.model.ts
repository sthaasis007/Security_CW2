import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    username: { type: String, default: null },
    role: { type: String, default: null },
    userEmail: { type: String, default: null },
    action: { type: String, required: true, index: true },
    description: { type: String, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

activitySchema.index({ createdAt: -1 });
activitySchema.index({ username: 1 });
activitySchema.index({ userId: 1 });

export const ActivityModel = mongoose.model("ActivityLog", activitySchema);

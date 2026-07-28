import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    username: { type: String, default: null },
    role: { type: String, default: null },
    userEmail: { type: String, default: null },
    action: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    outcome: { type: String, enum: ["success", "failure", "denied", "unknown"], required: true },
    severity: { type: String, enum: ["info", "warning", "critical"], required: true, index: true },
    description: { type: String, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
    alert: { type: Boolean, default: false, index: true },
    integrityHash: { type: String, required: true, immutable: true, select: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true, bufferCommands: false }
);

activitySchema.index({ createdAt: -1 });
activitySchema.index({ username: 1 });
activitySchema.index({ userId: 1 });
activitySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ActivityModel = mongoose.model("ActivityLog", activitySchema);

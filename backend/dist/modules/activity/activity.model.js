"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const activitySchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", default: null },
    username: { type: String, default: null },
    role: { type: String, default: null },
    userEmail: { type: String, default: null },
    action: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    outcome: { type: String, enum: ["success", "failure", "denied", "unknown"], required: true },
    severity: { type: String, enum: ["info", "warning", "critical"], required: true, index: true },
    description: { type: String, default: null },
    metadata: { type: mongoose_1.default.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
    alert: { type: Boolean, default: false, index: true },
    integrityHash: { type: String, required: true, immutable: true, select: false },
    expiresAt: { type: Date, required: true },
}, { timestamps: true, bufferCommands: false });
activitySchema.index({ createdAt: -1 });
activitySchema.index({ username: 1 });
activitySchema.index({ userId: 1 });
activitySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.ActivityModel = mongoose_1.default.model("ActivityLog", activitySchema);
//# sourceMappingURL=activity.model.js.map
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
    description: { type: String, default: null },
    metadata: { type: mongoose_1.default.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });
activitySchema.index({ createdAt: -1 });
activitySchema.index({ username: 1 });
activitySchema.index({ userId: 1 });
exports.ActivityModel = mongoose_1.default.model("ActivityLog", activitySchema);
//# sourceMappingURL=activity.model.js.map
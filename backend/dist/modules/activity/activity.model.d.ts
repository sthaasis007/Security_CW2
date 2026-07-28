import mongoose from "mongoose";
export declare const ActivityModel: mongoose.Model<{
    action: string;
    category: string;
    outcome: "success" | "failure" | "denied" | "unknown";
    severity: "info" | "warning" | "critical";
    metadata: any;
    timestamp: NativeDate;
    alert: boolean;
    integrityHash: string;
    expiresAt: NativeDate;
    role?: string | null;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    username?: string | null;
    userEmail?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    action: string;
    category: string;
    outcome: "success" | "failure" | "denied" | "unknown";
    severity: "info" | "warning" | "critical";
    metadata: any;
    timestamp: NativeDate;
    alert: boolean;
    integrityHash: string;
    expiresAt: NativeDate;
    role?: string | null;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    username?: string | null;
    userEmail?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
    bufferCommands: false;
}> & Omit<{
    action: string;
    category: string;
    outcome: "success" | "failure" | "denied" | "unknown";
    severity: "info" | "warning" | "critical";
    metadata: any;
    timestamp: NativeDate;
    alert: boolean;
    integrityHash: string;
    expiresAt: NativeDate;
    role?: string | null;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    username?: string | null;
    userEmail?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    bufferCommands: false;
}, {
    action: string;
    category: string;
    outcome: "success" | "failure" | "denied" | "unknown";
    severity: "info" | "warning" | "critical";
    metadata: any;
    timestamp: NativeDate;
    alert: boolean;
    integrityHash: string;
    expiresAt: NativeDate;
    role?: string | null;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    username?: string | null;
    userEmail?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    action: string;
    category: string;
    outcome: "success" | "failure" | "denied" | "unknown";
    severity: "info" | "warning" | "critical";
    metadata: any;
    timestamp: NativeDate;
    alert: boolean;
    integrityHash: string;
    expiresAt: NativeDate;
    role?: string | null;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    username?: string | null;
    userEmail?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps" | "bufferCommands"> & {
    timestamps: true;
    bufferCommands: false;
}> & Omit<{
    action: string;
    category: string;
    outcome: "success" | "failure" | "denied" | "unknown";
    severity: "info" | "warning" | "critical";
    metadata: any;
    timestamp: NativeDate;
    alert: boolean;
    integrityHash: string;
    expiresAt: NativeDate;
    role?: string | null;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    username?: string | null;
    userEmail?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    action: string;
    category: string;
    outcome: "success" | "failure" | "denied" | "unknown";
    severity: "info" | "warning" | "critical";
    metadata: any;
    timestamp: NativeDate;
    alert: boolean;
    integrityHash: string;
    expiresAt: NativeDate;
    role?: string | null;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    username?: string | null;
    userEmail?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    action: string;
    category: string;
    outcome: "success" | "failure" | "denied" | "unknown";
    severity: "info" | "warning" | "critical";
    metadata: any;
    timestamp: NativeDate;
    alert: boolean;
    integrityHash: string;
    expiresAt: NativeDate;
    role?: string | null;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    username?: string | null;
    userEmail?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=activity.model.d.ts.map
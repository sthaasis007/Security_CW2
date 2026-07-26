import mongoose from "mongoose";
export declare const ActivityModel: mongoose.Model<{
    action: string;
    metadata: any;
    timestamp: NativeDate;
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
    metadata: any;
    timestamp: NativeDate;
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
}> & Omit<{
    action: string;
    metadata: any;
    timestamp: NativeDate;
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
}, {
    action: string;
    metadata: any;
    timestamp: NativeDate;
    role?: string | null;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    username?: string | null;
    userEmail?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    action: string;
    metadata: any;
    timestamp: NativeDate;
    role?: string | null;
    description?: string | null;
    userId?: mongoose.Types.ObjectId | null;
    username?: string | null;
    userEmail?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    action: string;
    metadata: any;
    timestamp: NativeDate;
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
    metadata: any;
    timestamp: NativeDate;
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
    metadata: any;
    timestamp: NativeDate;
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
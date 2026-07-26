import mongoose from "mongoose";
export declare const UserModel: mongoose.Model<{
    email: string;
    password: string;
    role: "user" | "admin";
    resetPasswordUsed: boolean;
    emailVerified: boolean;
    loginAttempts: number;
    mfaEnabled: boolean;
    mfaMethod: "email" | "none";
    name?: string | null;
    image?: string | null;
    passwordChangedAt?: NativeDate | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: NativeDate | null;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: NativeDate | null;
    refreshTokenHash?: string | null;
    refreshTokenExpiresAt?: NativeDate | null;
    lastLoginAt?: NativeDate | null;
    lockUntil?: NativeDate | null;
    mfaSecret?: string | null;
    deviceInfo?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    email: string;
    password: string;
    role: "user" | "admin";
    resetPasswordUsed: boolean;
    emailVerified: boolean;
    loginAttempts: number;
    mfaEnabled: boolean;
    mfaMethod: "email" | "none";
    name?: string | null;
    image?: string | null;
    passwordChangedAt?: NativeDate | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: NativeDate | null;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: NativeDate | null;
    refreshTokenHash?: string | null;
    refreshTokenExpiresAt?: NativeDate | null;
    lastLoginAt?: NativeDate | null;
    lockUntil?: NativeDate | null;
    mfaSecret?: string | null;
    deviceInfo?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    email: string;
    password: string;
    role: "user" | "admin";
    resetPasswordUsed: boolean;
    emailVerified: boolean;
    loginAttempts: number;
    mfaEnabled: boolean;
    mfaMethod: "email" | "none";
    name?: string | null;
    image?: string | null;
    passwordChangedAt?: NativeDate | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: NativeDate | null;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: NativeDate | null;
    refreshTokenHash?: string | null;
    refreshTokenExpiresAt?: NativeDate | null;
    lastLoginAt?: NativeDate | null;
    lockUntil?: NativeDate | null;
    mfaSecret?: string | null;
    deviceInfo?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    email: string;
    password: string;
    role: "user" | "admin";
    resetPasswordUsed: boolean;
    emailVerified: boolean;
    loginAttempts: number;
    mfaEnabled: boolean;
    mfaMethod: "email" | "none";
    name?: string | null;
    image?: string | null;
    passwordChangedAt?: NativeDate | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: NativeDate | null;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: NativeDate | null;
    refreshTokenHash?: string | null;
    refreshTokenExpiresAt?: NativeDate | null;
    lastLoginAt?: NativeDate | null;
    lockUntil?: NativeDate | null;
    mfaSecret?: string | null;
    deviceInfo?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    email: string;
    password: string;
    role: "user" | "admin";
    resetPasswordUsed: boolean;
    emailVerified: boolean;
    loginAttempts: number;
    mfaEnabled: boolean;
    mfaMethod: "email" | "none";
    name?: string | null;
    image?: string | null;
    passwordChangedAt?: NativeDate | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: NativeDate | null;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: NativeDate | null;
    refreshTokenHash?: string | null;
    refreshTokenExpiresAt?: NativeDate | null;
    lastLoginAt?: NativeDate | null;
    lockUntil?: NativeDate | null;
    mfaSecret?: string | null;
    deviceInfo?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    email: string;
    password: string;
    role: "user" | "admin";
    resetPasswordUsed: boolean;
    emailVerified: boolean;
    loginAttempts: number;
    mfaEnabled: boolean;
    mfaMethod: "email" | "none";
    name?: string | null;
    image?: string | null;
    passwordChangedAt?: NativeDate | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: NativeDate | null;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: NativeDate | null;
    refreshTokenHash?: string | null;
    refreshTokenExpiresAt?: NativeDate | null;
    lastLoginAt?: NativeDate | null;
    lockUntil?: NativeDate | null;
    mfaSecret?: string | null;
    deviceInfo?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    email: string;
    password: string;
    role: "user" | "admin";
    resetPasswordUsed: boolean;
    emailVerified: boolean;
    loginAttempts: number;
    mfaEnabled: boolean;
    mfaMethod: "email" | "none";
    name?: string | null;
    image?: string | null;
    passwordChangedAt?: NativeDate | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: NativeDate | null;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: NativeDate | null;
    refreshTokenHash?: string | null;
    refreshTokenExpiresAt?: NativeDate | null;
    lastLoginAt?: NativeDate | null;
    lockUntil?: NativeDate | null;
    mfaSecret?: string | null;
    deviceInfo?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    email: string;
    password: string;
    role: "user" | "admin";
    resetPasswordUsed: boolean;
    emailVerified: boolean;
    loginAttempts: number;
    mfaEnabled: boolean;
    mfaMethod: "email" | "none";
    name?: string | null;
    image?: string | null;
    passwordChangedAt?: NativeDate | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: NativeDate | null;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: NativeDate | null;
    refreshTokenHash?: string | null;
    refreshTokenExpiresAt?: NativeDate | null;
    lastLoginAt?: NativeDate | null;
    lockUntil?: NativeDate | null;
    mfaSecret?: string | null;
    deviceInfo?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=user.model.d.ts.map
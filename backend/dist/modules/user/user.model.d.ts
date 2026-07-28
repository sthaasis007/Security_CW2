import mongoose from "mongoose";
export declare const UserModel: mongoose.Model<{
    email: string;
    password: string;
    passwordHistory: mongoose.Types.DocumentArray<{
        hash?: string | null;
        changedAt?: NativeDate | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        hash?: string | null;
        changedAt?: NativeDate | null;
    }, {}, {}> & {
        hash?: string | null;
        changedAt?: NativeDate | null;
    }>;
    role: "user" | "admin";
    resetPasswordUsed: boolean;
    emailVerified: boolean;
    sessionVersion: number;
    loginAttempts: number;
    mfaEnabled: boolean;
    mfaMethod: "email" | "none";
    mfaChallengeAttempts: number;
    mfaRecoveryCodeHashes: string[];
    name?: string | null;
    image?: string | null;
    passwordChangedAt?: NativeDate | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: NativeDate | null;
    emailVerifiedAt?: NativeDate | null;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: NativeDate | null;
    refreshTokenHash?: string | null;
    previousRefreshTokenHash?: string | null;
    refreshTokenExpiresAt?: NativeDate | null;
    csrfTokenHash?: string | null;
    csrfTokenExpiresAt?: NativeDate | null;
    lastLoginAt?: NativeDate | null;
    lockUntil?: NativeDate | null;
    mfaChallengeHash?: string | null;
    mfaChallengeExpiresAt?: NativeDate | null;
    mfaChallengePurpose?: "login" | "setup" | null;
    deviceInfo?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    email: string;
    password: string;
    passwordHistory: mongoose.Types.DocumentArray<{
        hash?: string | null;
        changedAt?: NativeDate | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        hash?: string | null;
        changedAt?: NativeDate | null;
    }, {}, {}> & {
        hash?: string | null;
        changedAt?: NativeDate | null;
    }>;
    role: "user" | "admin";
    resetPasswordUsed: boolean;
    emailVerified: boolean;
    sessionVersion: number;
    loginAttempts: number;
    mfaEnabled: boolean;
    mfaMethod: "email" | "none";
    mfaChallengeAttempts: number;
    mfaRecoveryCodeHashes: string[];
    name?: string | null;
    image?: string | null;
    passwordChangedAt?: NativeDate | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: NativeDate | null;
    emailVerifiedAt?: NativeDate | null;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: NativeDate | null;
    refreshTokenHash?: string | null;
    previousRefreshTokenHash?: string | null;
    refreshTokenExpiresAt?: NativeDate | null;
    csrfTokenHash?: string | null;
    csrfTokenExpiresAt?: NativeDate | null;
    lastLoginAt?: NativeDate | null;
    lockUntil?: NativeDate | null;
    mfaChallengeHash?: string | null;
    mfaChallengeExpiresAt?: NativeDate | null;
    mfaChallengePurpose?: "login" | "setup" | null;
    deviceInfo?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
    toJSON: {
        getters: true;
    };
    toObject: {
        getters: true;
    };
}> & Omit<{
    email: string;
    password: string;
    passwordHistory: mongoose.Types.DocumentArray<{
        hash?: string | null;
        changedAt?: NativeDate | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        hash?: string | null;
        changedAt?: NativeDate | null;
    }, {}, {}> & {
        hash?: string | null;
        changedAt?: NativeDate | null;
    }>;
    role: "user" | "admin";
    resetPasswordUsed: boolean;
    emailVerified: boolean;
    sessionVersion: number;
    loginAttempts: number;
    mfaEnabled: boolean;
    mfaMethod: "email" | "none";
    mfaChallengeAttempts: number;
    mfaRecoveryCodeHashes: string[];
    name?: string | null;
    image?: string | null;
    passwordChangedAt?: NativeDate | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: NativeDate | null;
    emailVerifiedAt?: NativeDate | null;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: NativeDate | null;
    refreshTokenHash?: string | null;
    previousRefreshTokenHash?: string | null;
    refreshTokenExpiresAt?: NativeDate | null;
    csrfTokenHash?: string | null;
    csrfTokenExpiresAt?: NativeDate | null;
    lastLoginAt?: NativeDate | null;
    lockUntil?: NativeDate | null;
    mfaChallengeHash?: string | null;
    mfaChallengeExpiresAt?: NativeDate | null;
    mfaChallengePurpose?: "login" | "setup" | null;
    deviceInfo?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    toJSON: {
        getters: true;
    };
    toObject: {
        getters: true;
    };
}, {
    email: string;
    password: string;
    passwordHistory: mongoose.Types.DocumentArray<{
        hash?: string | null;
        changedAt?: NativeDate | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        hash?: string | null;
        changedAt?: NativeDate | null;
    }, {}, {}> & {
        hash?: string | null;
        changedAt?: NativeDate | null;
    }>;
    role: "user" | "admin";
    resetPasswordUsed: boolean;
    emailVerified: boolean;
    sessionVersion: number;
    loginAttempts: number;
    mfaEnabled: boolean;
    mfaMethod: "email" | "none";
    mfaChallengeAttempts: number;
    mfaRecoveryCodeHashes: string[];
    name?: string | null;
    image?: string | null;
    passwordChangedAt?: NativeDate | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: NativeDate | null;
    emailVerifiedAt?: NativeDate | null;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: NativeDate | null;
    refreshTokenHash?: string | null;
    previousRefreshTokenHash?: string | null;
    refreshTokenExpiresAt?: NativeDate | null;
    csrfTokenHash?: string | null;
    csrfTokenExpiresAt?: NativeDate | null;
    lastLoginAt?: NativeDate | null;
    lockUntil?: NativeDate | null;
    mfaChallengeHash?: string | null;
    mfaChallengeExpiresAt?: NativeDate | null;
    mfaChallengePurpose?: "login" | "setup" | null;
    deviceInfo?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    email: string;
    password: string;
    passwordHistory: mongoose.Types.DocumentArray<{
        hash?: string | null;
        changedAt?: NativeDate | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        hash?: string | null;
        changedAt?: NativeDate | null;
    }, {}, {}> & {
        hash?: string | null;
        changedAt?: NativeDate | null;
    }>;
    role: "user" | "admin";
    resetPasswordUsed: boolean;
    emailVerified: boolean;
    sessionVersion: number;
    loginAttempts: number;
    mfaEnabled: boolean;
    mfaMethod: "email" | "none";
    mfaChallengeAttempts: number;
    mfaRecoveryCodeHashes: string[];
    name?: string | null;
    image?: string | null;
    passwordChangedAt?: NativeDate | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: NativeDate | null;
    emailVerifiedAt?: NativeDate | null;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: NativeDate | null;
    refreshTokenHash?: string | null;
    previousRefreshTokenHash?: string | null;
    refreshTokenExpiresAt?: NativeDate | null;
    csrfTokenHash?: string | null;
    csrfTokenExpiresAt?: NativeDate | null;
    lastLoginAt?: NativeDate | null;
    lockUntil?: NativeDate | null;
    mfaChallengeHash?: string | null;
    mfaChallengeExpiresAt?: NativeDate | null;
    mfaChallengePurpose?: "login" | "setup" | null;
    deviceInfo?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps" | "toJSON" | "toObject"> & {
    timestamps: true;
    toJSON: {
        getters: true;
    };
    toObject: {
        getters: true;
    };
}> & Omit<{
    email: string;
    password: string;
    passwordHistory: mongoose.Types.DocumentArray<{
        hash?: string | null;
        changedAt?: NativeDate | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        hash?: string | null;
        changedAt?: NativeDate | null;
    }, {}, {}> & {
        hash?: string | null;
        changedAt?: NativeDate | null;
    }>;
    role: "user" | "admin";
    resetPasswordUsed: boolean;
    emailVerified: boolean;
    sessionVersion: number;
    loginAttempts: number;
    mfaEnabled: boolean;
    mfaMethod: "email" | "none";
    mfaChallengeAttempts: number;
    mfaRecoveryCodeHashes: string[];
    name?: string | null;
    image?: string | null;
    passwordChangedAt?: NativeDate | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: NativeDate | null;
    emailVerifiedAt?: NativeDate | null;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: NativeDate | null;
    refreshTokenHash?: string | null;
    previousRefreshTokenHash?: string | null;
    refreshTokenExpiresAt?: NativeDate | null;
    csrfTokenHash?: string | null;
    csrfTokenExpiresAt?: NativeDate | null;
    lastLoginAt?: NativeDate | null;
    lockUntil?: NativeDate | null;
    mfaChallengeHash?: string | null;
    mfaChallengeExpiresAt?: NativeDate | null;
    mfaChallengePurpose?: "login" | "setup" | null;
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
    passwordHistory: mongoose.Types.DocumentArray<{
        hash?: string | null;
        changedAt?: NativeDate | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        hash?: string | null;
        changedAt?: NativeDate | null;
    }, {}, {}> & {
        hash?: string | null;
        changedAt?: NativeDate | null;
    }>;
    role: "user" | "admin";
    resetPasswordUsed: boolean;
    emailVerified: boolean;
    sessionVersion: number;
    loginAttempts: number;
    mfaEnabled: boolean;
    mfaMethod: "email" | "none";
    mfaChallengeAttempts: number;
    mfaRecoveryCodeHashes: string[];
    name?: string | null;
    image?: string | null;
    passwordChangedAt?: NativeDate | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: NativeDate | null;
    emailVerifiedAt?: NativeDate | null;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: NativeDate | null;
    refreshTokenHash?: string | null;
    previousRefreshTokenHash?: string | null;
    refreshTokenExpiresAt?: NativeDate | null;
    csrfTokenHash?: string | null;
    csrfTokenExpiresAt?: NativeDate | null;
    lastLoginAt?: NativeDate | null;
    lockUntil?: NativeDate | null;
    mfaChallengeHash?: string | null;
    mfaChallengeExpiresAt?: NativeDate | null;
    mfaChallengePurpose?: "login" | "setup" | null;
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
    passwordHistory: mongoose.Types.DocumentArray<{
        hash?: string | null;
        changedAt?: NativeDate | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        hash?: string | null;
        changedAt?: NativeDate | null;
    }, {}, {}> & {
        hash?: string | null;
        changedAt?: NativeDate | null;
    }>;
    role: "user" | "admin";
    resetPasswordUsed: boolean;
    emailVerified: boolean;
    sessionVersion: number;
    loginAttempts: number;
    mfaEnabled: boolean;
    mfaMethod: "email" | "none";
    mfaChallengeAttempts: number;
    mfaRecoveryCodeHashes: string[];
    name?: string | null;
    image?: string | null;
    passwordChangedAt?: NativeDate | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: NativeDate | null;
    emailVerifiedAt?: NativeDate | null;
    emailVerificationToken?: string | null;
    emailVerificationExpires?: NativeDate | null;
    refreshTokenHash?: string | null;
    previousRefreshTokenHash?: string | null;
    refreshTokenExpiresAt?: NativeDate | null;
    csrfTokenHash?: string | null;
    csrfTokenExpiresAt?: NativeDate | null;
    lastLoginAt?: NativeDate | null;
    lockUntil?: NativeDate | null;
    mfaChallengeHash?: string | null;
    mfaChallengeExpiresAt?: NativeDate | null;
    mfaChallengePurpose?: "login" | "setup" | null;
    deviceInfo?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=user.model.d.ts.map
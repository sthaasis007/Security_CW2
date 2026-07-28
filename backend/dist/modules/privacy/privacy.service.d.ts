import mongoose from "mongoose";
export declare const PrivacyService: {
    exportForUser(userId: string): Promise<{
        exportVersion: number;
        exportedAt: string;
        profile: {
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
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>;
        cart: ({
            userId: mongoose.Types.ObjectId;
            items: mongoose.Types.DocumentArray<{
                productId: mongoose.Types.ObjectId;
                quantity: number;
                priceSnapshot: number;
                selectedSize?: string | null;
                selectedColor?: string | null;
                productName?: string | null;
                productPrice?: number | null;
                productDescription?: string | null;
                productImage?: string | null;
                createdAt: NativeDate;
                updatedAt: NativeDate;
            }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
                productId: mongoose.Types.ObjectId;
                quantity: number;
                priceSnapshot: number;
                selectedSize?: string | null;
                selectedColor?: string | null;
                productName?: string | null;
                productPrice?: number | null;
                productDescription?: string | null;
                productImage?: string | null;
                createdAt: NativeDate;
                updatedAt: NativeDate;
            }, {}, {}> & {
                productId: mongoose.Types.ObjectId;
                quantity: number;
                priceSnapshot: number;
                selectedSize?: string | null;
                selectedColor?: string | null;
                productName?: string | null;
                productPrice?: number | null;
                productDescription?: string | null;
                productImage?: string | null;
                createdAt: NativeDate;
                updatedAt: NativeDate;
            }>;
            createdAt: NativeDate;
            updatedAt: NativeDate;
        } & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>) | {
            items: never[];
        };
        favorites: ({
            userId: mongoose.Types.ObjectId;
            productId: mongoose.Types.ObjectId;
            productName?: string | null;
            productPrice?: number | null;
            productDescription?: string | null;
            productImage?: string | null;
            createdAt: NativeDate;
            updatedAt: NativeDate;
        } & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>)[];
        orders: any[];
        activity: ({
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
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>)[];
    } | null>;
    importProfile: (userId: string, profile: {
        name: string;
    }) => mongoose.Query<(mongoose.Document<unknown, {}, {
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
    }>) | null, mongoose.Document<unknown, {}, {
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
    }>, {}, {
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
    }, "findOneAndUpdate", {
        id: string;
    }>;
    deleteAccount(userId: string): Promise<any>;
};
//# sourceMappingURL=privacy.service.d.ts.map
export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin" | string;
}
export declare const AuthRepository: {
    findByEmail: (email: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOne", {
        id: string;
    }>;
    createUser: (data: CreateUserData) => Promise<import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    findById: (id: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOne", {
        id: string;
    }>;
    findByResetToken: (tokenHash: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOne", {
        id: string;
    }>;
    findAll: () => import("mongoose").Query<({
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "find", {
        id: string;
    }>;
    updateUser: (id: string, data: Partial<CreateUserData & {
        image?: string;
    }>) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOneAndUpdate", {
        id: string;
    }>;
    setResetToken: (id: string, tokenHash: string, expiresAt: Date) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOneAndUpdate", {
        id: string;
    }>;
    updatePasswordAndClearReset: (id: string, hashedPassword: string) => Promise<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null>;
    setEmailVerificationToken: (id: string, tokenHash: string, expiresAt: Date) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOneAndUpdate", {
        id: string;
    }>;
    verifyEmail: (id: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOneAndUpdate", {
        id: string;
    }>;
    setRefreshToken: (id: string, tokenHash: string, expiresAt: Date) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOneAndUpdate", {
        id: string;
    }>;
    clearCsrfToken: (id: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOneAndUpdate", {
        id: string;
    }>;
    setCsrfToken: (id: string, csrfHash: string, expiresAt: Date) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOneAndUpdate", {
        id: string;
    }>;
    findByRefreshTokenHash: (tokenHash: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOne", {
        id: string;
    }>;
    clearRefreshToken: (id: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOneAndUpdate", {
        id: string;
    }>;
    incrementLoginAttempts: (id: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOneAndUpdate", {
        id: string;
    }>;
    resetLoginAttempts: (id: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOneAndUpdate", {
        id: string;
    }>;
    lockAccount: (id: string, lockUntil: Date) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOneAndUpdate", {
        id: string;
    }>;
    deleteUser: (id: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        email: string;
        password: string;
        passwordHistory: import("mongoose").Types.DocumentArray<{
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }, {}, {}> & {
            hash?: string | null;
            changedAt?: NativeDate | null;
        }>;
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
        csrfTokenHash?: string | null;
        csrfTokenExpiresAt?: NativeDate | null;
        lastLoginAt?: NativeDate | null;
        lockUntil?: NativeDate | null;
        mfaSecret?: string | null;
        deviceInfo?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOneAndDelete", {
        id: string;
    }>;
};
//# sourceMappingURL=auth.repository.d.ts.map
interface CreateUserData {
    name: string;
    email: string;
    password: string;
    role: string;
}
export declare const AuthRepository: {
    findByEmail: (email: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
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
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    findById: (id: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
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
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOne", {
        id: string;
    }>;
    findAll: () => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
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
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
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
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOneAndUpdate", {
        id: string;
    }>;
    updatePasswordAndClearReset: (id: string, hashedPassword: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
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
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: NativeDate | null;
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
export {};
//# sourceMappingURL=auth.repository.d.ts.map
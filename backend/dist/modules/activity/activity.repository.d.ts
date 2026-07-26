export declare const ActivityRepository: {
    create: (data: Record<string, any>) => Promise<import("mongoose").Document<unknown, {}, {
        action: string;
        metadata: any;
        timestamp: NativeDate;
        role?: string | null;
        description?: string | null;
        userId?: import("mongoose").Types.ObjectId | null;
        username?: string | null;
        userEmail?: string | null;
        ipAddress?: string | null;
        userAgent?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        action: string;
        metadata: any;
        timestamp: NativeDate;
        role?: string | null;
        description?: string | null;
        userId?: import("mongoose").Types.ObjectId | null;
        username?: string | null;
        userEmail?: string | null;
        ipAddress?: string | null;
        userAgent?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    list: (filters?: Record<string, any>) => import("mongoose").Query<({
        action: string;
        metadata: any;
        timestamp: NativeDate;
        role?: string | null;
        description?: string | null;
        userId?: import("mongoose").Types.ObjectId | null;
        username?: string | null;
        userEmail?: string | null;
        ipAddress?: string | null;
        userAgent?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, {}, {
        action: string;
        metadata: any;
        timestamp: NativeDate;
        role?: string | null;
        description?: string | null;
        userId?: import("mongoose").Types.ObjectId | null;
        username?: string | null;
        userEmail?: string | null;
        ipAddress?: string | null;
        userAgent?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        action: string;
        metadata: any;
        timestamp: NativeDate;
        role?: string | null;
        description?: string | null;
        userId?: import("mongoose").Types.ObjectId | null;
        username?: string | null;
        userEmail?: string | null;
        ipAddress?: string | null;
        userAgent?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        action: string;
        metadata: any;
        timestamp: NativeDate;
        role?: string | null;
        description?: string | null;
        userId?: import("mongoose").Types.ObjectId | null;
        username?: string | null;
        userEmail?: string | null;
        ipAddress?: string | null;
        userAgent?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "find", {
        id: string;
    }>;
    search: (query: string) => Promise<({
        action: string;
        metadata: any;
        timestamp: NativeDate;
        role?: string | null;
        description?: string | null;
        userId?: import("mongoose").Types.ObjectId | null;
        username?: string | null;
        userEmail?: string | null;
        ipAddress?: string | null;
        userAgent?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
};
//# sourceMappingURL=activity.repository.d.ts.map
export declare const ActivityService: {
    log(action: string, description?: string, metadata?: Record<string, any>, user?: {
        id?: string | null;
        email?: string | null;
        username?: string | null;
        role?: string | null;
    }, req?: any): Promise<import("mongoose").Document<unknown, {}, {
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
    list(filters?: Record<string, any>): Promise<({
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
    search(query: string): Promise<({
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
//# sourceMappingURL=activity.service.d.ts.map
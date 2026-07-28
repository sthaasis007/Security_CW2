export type ActivityPage = {
    page: number;
    limit: number;
    total: number;
    pages: number;
    activities: any[];
};
export declare const ActivityRepository: {
    create: (data: Record<string, any>) => Promise<import("mongoose").Document<unknown, {}, {
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
        userId?: import("mongoose").Types.ObjectId | null;
        username?: string | null;
        userEmail?: string | null;
        ipAddress?: string | null;
        userAgent?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
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
    countRecent: (action: string, userId: string | null, since: Date) => import("mongoose").Query<number, import("mongoose").Document<unknown, {}, {
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
        userId?: import("mongoose").Types.ObjectId | null;
        username?: string | null;
        userEmail?: string | null;
        ipAddress?: string | null;
        userAgent?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
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
        userId?: import("mongoose").Types.ObjectId | null;
        username?: string | null;
        userEmail?: string | null;
        ipAddress?: string | null;
        userAgent?: string | null;
    } & import("mongoose").DefaultTimestampProps, "countDocuments", {
        id: string;
    }>;
    list(filters: Record<string, any>, page: number, limit: number): Promise<ActivityPage>;
};
//# sourceMappingURL=activity.repository.d.ts.map
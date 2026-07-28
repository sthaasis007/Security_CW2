export declare const redactAuditValue: (value: any, key?: string) => any;
export declare const ActivityService: {
    log(action: string, description?: string, metadata?: Record<string, any>, user?: {
        id?: string | null;
        email?: string | null;
        username?: string | null;
        role?: string | null;
    }, req?: any): Promise<import("mongoose").Document<unknown, {}, {
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
    list(filters: Record<string, any>, page: number, limit: number): Promise<import("./activity.repository").ActivityPage>;
};
//# sourceMappingURL=activity.service.d.ts.map
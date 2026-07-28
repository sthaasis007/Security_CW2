export declare const ProductRepository: {
    findById: (id: string) => import("mongoose").Query<({
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null, import("mongoose").Document<unknown, {}, {
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOne", {
        id: string;
    }>;
    findAll: (filters?: Record<string, any>) => import("mongoose").Query<({
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, {}, {
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "find", {
        id: string;
    }>;
    create: (data: Record<string, any>) => Promise<import("mongoose").Document<unknown, {}, {
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    update: (id: string, data: Record<string, any>) => import("mongoose").Query<({
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null, import("mongoose").Document<unknown, {}, {
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOneAndUpdate", {
        id: string;
    }>;
    delete: (id: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null, import("mongoose").Document<unknown, {}, {
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>, {}, {
        name: string;
        placements: ("bestseller" | "current")[];
        available: boolean;
        price: number;
        displayOrder: number;
        image?: string | null;
        description?: string | null;
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
//# sourceMappingURL=product.repository.d.ts.map
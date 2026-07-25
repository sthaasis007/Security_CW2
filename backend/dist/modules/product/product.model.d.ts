import mongoose from "mongoose";
export declare const ProductModel: mongoose.Model<{
    name: string;
    price: number;
    placements: ("bestseller" | "current")[];
    displayOrder: number;
    available: boolean;
    image?: string | null;
    description?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    price: number;
    placements: ("bestseller" | "current")[];
    displayOrder: number;
    available: boolean;
    image?: string | null;
    description?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    price: number;
    placements: ("bestseller" | "current")[];
    displayOrder: number;
    available: boolean;
    image?: string | null;
    description?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    price: number;
    placements: ("bestseller" | "current")[];
    displayOrder: number;
    available: boolean;
    image?: string | null;
    description?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    price: number;
    placements: ("bestseller" | "current")[];
    displayOrder: number;
    available: boolean;
    image?: string | null;
    description?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    name: string;
    price: number;
    placements: ("bestseller" | "current")[];
    displayOrder: number;
    available: boolean;
    image?: string | null;
    description?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        name: string;
        price: number;
        placements: ("bestseller" | "current")[];
        displayOrder: number;
        available: boolean;
        image?: string | null;
        description?: string | null;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        name: string;
        price: number;
        placements: ("bestseller" | "current")[];
        displayOrder: number;
        available: boolean;
        image?: string | null;
        description?: string | null;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    name: string;
    price: number;
    placements: ("bestseller" | "current")[];
    displayOrder: number;
    available: boolean;
    image?: string | null;
    description?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    price: number;
    placements: ("bestseller" | "current")[];
    displayOrder: number;
    available: boolean;
    image?: string | null;
    description?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=product.model.d.ts.map
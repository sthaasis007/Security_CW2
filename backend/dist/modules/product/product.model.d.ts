import mongoose from "mongoose";
export declare const ProductModel: mongoose.Model<{
    name: string;
    placements: ("bestseller" | "current")[];
    available: boolean;
    price: number;
    displayOrder: number;
    image?: string | null;
    description?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    placements: ("bestseller" | "current")[];
    available: boolean;
    price: number;
    displayOrder: number;
    image?: string | null;
    description?: string | null;
} & mongoose.DefaultTimestampProps, {
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
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    placements: ("bestseller" | "current")[];
    available: boolean;
    price: number;
    displayOrder: number;
    image?: string | null;
    description?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    placements: ("bestseller" | "current")[];
    available: boolean;
    price: number;
    displayOrder: number;
    image?: string | null;
    description?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    name: string;
    placements: ("bestseller" | "current")[];
    available: boolean;
    price: number;
    displayOrder: number;
    image?: string | null;
    description?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
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
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
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
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=product.model.d.ts.map
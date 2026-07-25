import mongoose from "mongoose";
export declare const FavoriteModel: mongoose.Model<{
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    productName?: string | null;
    productPrice?: number | null;
    productDescription?: string | null;
    productImage?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    productName?: string | null;
    productPrice?: number | null;
    productDescription?: string | null;
    productImage?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    productName?: string | null;
    productPrice?: number | null;
    productDescription?: string | null;
    productImage?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    productName?: string | null;
    productPrice?: number | null;
    productDescription?: string | null;
    productImage?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    productName?: string | null;
    productPrice?: number | null;
    productDescription?: string | null;
    productImage?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    productName?: string | null;
    productPrice?: number | null;
    productDescription?: string | null;
    productImage?: string | null;
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
        userId: mongoose.Types.ObjectId;
        productId: mongoose.Types.ObjectId;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        userId: mongoose.Types.ObjectId;
        productId: mongoose.Types.ObjectId;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
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
}>, {
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
}>;
//# sourceMappingURL=favorite.model.d.ts.map
import mongoose from "mongoose";
export declare const CartModel: mongoose.Model<{
    userId: mongoose.Types.ObjectId;
    items: mongoose.Types.DocumentArray<{
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps>;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    items: mongoose.Types.DocumentArray<{
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    userId: mongoose.Types.ObjectId;
    items: mongoose.Types.DocumentArray<{
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: mongoose.Types.ObjectId;
    items: mongoose.Types.DocumentArray<{
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps>;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    items: mongoose.Types.DocumentArray<{
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    userId: mongoose.Types.ObjectId;
    items: mongoose.Types.DocumentArray<{
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
    } & mongoose.DefaultTimestampProps>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    userId: mongoose.Types.ObjectId;
    items: mongoose.Types.DocumentArray<{
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }, {}, {}> & {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }>;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    userId: mongoose.Types.ObjectId;
    items: mongoose.Types.DocumentArray<{
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }, {}, {}> & {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        priceSnapshot: number;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        selectedSize?: string | null;
        selectedColor?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }>;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=cart.model.d.ts.map
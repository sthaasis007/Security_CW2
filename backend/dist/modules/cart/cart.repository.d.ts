export declare const CartRepository: {
    getUserCart: (userId: string) => Promise<({
        userId: import("mongoose").Types.ObjectId;
        items: import("mongoose").Types.DocumentArray<{
            productId: import("mongoose").Types.ObjectId;
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
        }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            productId: import("mongoose").Types.ObjectId;
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
            productId: import("mongoose").Types.ObjectId;
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
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | {
        userId: string;
        items: never[];
    }>;
    addItem: (userId: string, payload: {
        productId: string;
        quantity?: number;
        selectedSize?: string;
        selectedColor?: string;
    }) => Promise<{
        userId: import("mongoose").Types.ObjectId;
        items: import("mongoose").Types.DocumentArray<{
            productId: import("mongoose").Types.ObjectId;
            quantity: number;
            priceSnapshot: number;
            productName?: string | null;
            productPrice?: number | null;
            productDescription?: string | null;
            productImage?: string | null;
            selectedSize?: string | null;
            selectedColor?: string | null;
        } & import("mongoose").DefaultTimestampProps, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            productId: import("mongoose").Types.ObjectId;
            quantity: number;
            priceSnapshot: number;
            productName?: string | null;
            productPrice?: number | null;
            productDescription?: string | null;
            productImage?: string | null;
            selectedSize?: string | null;
            selectedColor?: string | null;
        } & import("mongoose").DefaultTimestampProps, {}, {}> & {
            productId: import("mongoose").Types.ObjectId;
            quantity: number;
            priceSnapshot: number;
            productName?: string | null;
            productPrice?: number | null;
            productDescription?: string | null;
            productImage?: string | null;
            selectedSize?: string | null;
            selectedColor?: string | null;
        } & import("mongoose").DefaultTimestampProps>;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateItem: (userId: string, productId: string, payload: {
        quantity?: number;
        selectedSize?: string;
        selectedColor?: string;
    }) => Promise<({
        userId: import("mongoose").Types.ObjectId;
        items: import("mongoose").Types.DocumentArray<{
            productId: import("mongoose").Types.ObjectId;
            quantity: number;
            priceSnapshot: number;
            productName?: string | null;
            productPrice?: number | null;
            productDescription?: string | null;
            productImage?: string | null;
            selectedSize?: string | null;
            selectedColor?: string | null;
        } & import("mongoose").DefaultTimestampProps, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            productId: import("mongoose").Types.ObjectId;
            quantity: number;
            priceSnapshot: number;
            productName?: string | null;
            productPrice?: number | null;
            productDescription?: string | null;
            productImage?: string | null;
            selectedSize?: string | null;
            selectedColor?: string | null;
        } & import("mongoose").DefaultTimestampProps, {}, {}> & {
            productId: import("mongoose").Types.ObjectId;
            quantity: number;
            priceSnapshot: number;
            productName?: string | null;
            productPrice?: number | null;
            productDescription?: string | null;
            productImage?: string | null;
            selectedSize?: string | null;
            selectedColor?: string | null;
        } & import("mongoose").DefaultTimestampProps>;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    removeItem: (userId: string, productId: string) => Promise<({
        userId: import("mongoose").Types.ObjectId;
        items: import("mongoose").Types.DocumentArray<{
            productId: import("mongoose").Types.ObjectId;
            quantity: number;
            priceSnapshot: number;
            productName?: string | null;
            productPrice?: number | null;
            productDescription?: string | null;
            productImage?: string | null;
            selectedSize?: string | null;
            selectedColor?: string | null;
        } & import("mongoose").DefaultTimestampProps, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            productId: import("mongoose").Types.ObjectId;
            quantity: number;
            priceSnapshot: number;
            productName?: string | null;
            productPrice?: number | null;
            productDescription?: string | null;
            productImage?: string | null;
            selectedSize?: string | null;
            selectedColor?: string | null;
        } & import("mongoose").DefaultTimestampProps, {}, {}> & {
            productId: import("mongoose").Types.ObjectId;
            quantity: number;
            priceSnapshot: number;
            productName?: string | null;
            productPrice?: number | null;
            productDescription?: string | null;
            productImage?: string | null;
            selectedSize?: string | null;
            selectedColor?: string | null;
        } & import("mongoose").DefaultTimestampProps>;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    clearCart: (userId: string) => Promise<({
        userId: import("mongoose").Types.ObjectId;
        items: import("mongoose").Types.DocumentArray<{
            productId: import("mongoose").Types.ObjectId;
            quantity: number;
            priceSnapshot: number;
            productName?: string | null;
            productPrice?: number | null;
            productDescription?: string | null;
            productImage?: string | null;
            selectedSize?: string | null;
            selectedColor?: string | null;
        } & import("mongoose").DefaultTimestampProps, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
            productId: import("mongoose").Types.ObjectId;
            quantity: number;
            priceSnapshot: number;
            productName?: string | null;
            productPrice?: number | null;
            productDescription?: string | null;
            productImage?: string | null;
            selectedSize?: string | null;
            selectedColor?: string | null;
        } & import("mongoose").DefaultTimestampProps, {}, {}> & {
            productId: import("mongoose").Types.ObjectId;
            quantity: number;
            priceSnapshot: number;
            productName?: string | null;
            productPrice?: number | null;
            productDescription?: string | null;
            productImage?: string | null;
            selectedSize?: string | null;
            selectedColor?: string | null;
        } & import("mongoose").DefaultTimestampProps>;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=cart.repository.d.ts.map
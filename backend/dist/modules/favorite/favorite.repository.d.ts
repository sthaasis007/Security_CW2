export declare const FavoriteRepository: {
    getUserFavorites: (userId: string) => import("mongoose").Query<({
        userId: import("mongoose").Types.ObjectId;
        productId: import("mongoose").Types.ObjectId;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, {}, {
        userId: import("mongoose").Types.ObjectId;
        productId: import("mongoose").Types.ObjectId;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        userId: import("mongoose").Types.ObjectId;
        productId: import("mongoose").Types.ObjectId;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, {}, {
        userId: import("mongoose").Types.ObjectId;
        productId: import("mongoose").Types.ObjectId;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "find", {
        id: string;
    }>;
    addFavorite: (userId: string, productId: string) => Promise<never>;
    removeFavorite: (userId: string, productId: string) => import("mongoose").Query<import("mongodb").DeleteResult, import("mongoose").Document<unknown, {}, {
        userId: import("mongoose").Types.ObjectId;
        productId: import("mongoose").Types.ObjectId;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        userId: import("mongoose").Types.ObjectId;
        productId: import("mongoose").Types.ObjectId;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, {}, {
        userId: import("mongoose").Types.ObjectId;
        productId: import("mongoose").Types.ObjectId;
        productName?: string | null;
        productPrice?: number | null;
        productDescription?: string | null;
        productImage?: string | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "deleteOne", {
        id: string;
    }>;
    isFavorited: (userId: string, productId: string) => Promise<boolean>;
    toggleFavorite: (userId: string, productId: string) => Promise<{
        action: string;
        result: import("mongodb").DeleteResult;
    }>;
};
//# sourceMappingURL=favorite.repository.d.ts.map
import { Request, Response } from "express";
export declare const FavoriteController: {
    getFavorites(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    addFavorite(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    removeFavorite(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    toggleFavorite(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    isFavorited(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=favorite.controller.d.ts.map
import { Request, Response } from "express";
export declare const CartController: {
    getCart(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    addItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    removeItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    clearCart(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=cart.controller.d.ts.map
import { Request, Response } from "express";
declare const ProductController: {
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    list(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    remove(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
export default ProductController;
//# sourceMappingURL=product.controller.d.ts.map
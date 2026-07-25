import { Request, Response } from "express";
export declare const AdminController: {
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    list(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    get(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    remove(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
export default AdminController;
//# sourceMappingURL=admin.controller.d.ts.map
import { Request, Response } from "express";
export declare const AuthController: {
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    forgotPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    resetPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyEmail(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    resendVerification(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    refreshToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyLoginMfa(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    beginMfaSetup(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    confirmMfaSetup(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    disableMfa(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    session(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    logoutAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=auth.controller.d.ts.map
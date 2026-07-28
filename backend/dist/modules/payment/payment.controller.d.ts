import { Request, Response } from "express";
export declare const initiatePayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const verifyPayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const listOrders: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=payment.controller.d.ts.map
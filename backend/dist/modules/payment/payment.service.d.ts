export declare const canTransition: (from: string, to: string) => boolean;
export declare const buildOrderSnapshot: (userId: string) => Promise<{
    items: any;
    totalAmountPaisa: any;
}>;
export declare const PaymentService: {
    listOrders(userId: string): Promise<any[]>;
    initiate(user: any): Promise<{
        orderId: any;
        paymentUrl: string;
        expiresAt: string | undefined;
    }>;
    verify(userId: string, pidx: string): Promise<{
        order: any;
        idempotent: boolean;
    }>;
};
//# sourceMappingURL=payment.service.d.ts.map
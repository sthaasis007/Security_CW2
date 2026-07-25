import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from "./auth.dto";
export declare const AuthService: {
    register(data: RegisterDto): Promise<{
        ok: boolean;
        status: number;
        message: string;
        user?: never;
    } | {
        ok: boolean;
        status: number;
        message: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            role: "user" | "admin";
        };
    }>;
    login(data: LoginDto): Promise<{
        ok: boolean;
        status: number;
        message: string;
        token?: never;
        user?: never;
    } | {
        ok: boolean;
        status: number;
        message: string;
        token: any;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            role: "user" | "admin";
        };
    }>;
    requestPasswordReset(data: ForgotPasswordDto): Promise<{
        resetLink?: string;
        ok: boolean;
        status: number;
        message: string;
    }>;
    resetPassword(data: ResetPasswordDto): Promise<{
        ok: boolean;
        status: number;
        message: string;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map
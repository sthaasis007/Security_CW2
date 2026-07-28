import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from "./auth.dto";
export declare const AuthService: {
    register(data: RegisterDto): Promise<{
        ok: boolean;
        status: number;
        message: string;
    }>;
    login(data: LoginDto): Promise<{
        ok: boolean;
        status: number;
        message: string;
        accessToken: string;
        refreshToken: string;
        csrfToken: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
        };
    } | {
        ok: boolean;
        status: number;
        message: string;
        code?: never;
        mfaRequired?: never;
        challengeToken?: never;
    } | {
        ok: boolean;
        status: number;
        message: string;
        code: string;
        mfaRequired?: never;
        challengeToken?: never;
    } | {
        ok: boolean;
        status: number;
        mfaRequired: boolean;
        challengeToken: string;
        message: string;
        code?: never;
    }>;
    forgotPassword(data: ForgotPasswordDto): Promise<{
        ok: boolean;
        status: number;
        message: string;
    }>;
    resetPassword(data: ResetPasswordDto): Promise<{
        ok: boolean;
        status: number;
        message: string;
    }>;
    verifyEmail(rawToken: string): Promise<{
        ok: boolean;
        status: number;
        message: string;
    }>;
    resendVerification(data: ForgotPasswordDto): Promise<{
        ok: boolean;
        status: number;
        message: string;
    }>;
    changePassword: (user: any, password: string) => Promise<{
        ok: boolean;
        status: number;
        message: string;
    }>;
    verifyLoginMfa(challengeToken: string, code: string): Promise<{
        ok: boolean;
        status: number;
        message: string;
        accessToken: string;
        refreshToken: string;
        csrfToken: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
        };
    } | {
        ok: boolean;
        status: number;
        message: string;
    }>;
    beginMfaSetup(userId: string): Promise<{
        ok: boolean;
        status: number;
        message: string;
        challengeToken?: never;
    } | {
        ok: boolean;
        status: number;
        challengeToken: string;
        message: string;
    }>;
    confirmMfaSetup(userId: string, challengeToken: string, code: string): Promise<{
        ok: boolean;
        status: number;
        message: string;
        recoveryCodes?: never;
    } | {
        ok: boolean;
        status: number;
        message: string;
        recoveryCodes: string[];
    }>;
    disableMfa(userId: string, password: string): Promise<{
        ok: boolean;
        status: number;
        message: string;
    }>;
    logout(userId: string, req?: any): Promise<{
        ok: boolean;
        status: number;
        message: string;
    }>;
    rotateRefreshToken(rawToken: string | null): Promise<{
        ok: boolean;
        status: number;
        message: string;
        accessToken?: never;
        refreshToken?: never;
        csrfToken?: never;
        user?: never;
    } | {
        ok: boolean;
        status: number;
        accessToken: string;
        refreshToken: string;
        csrfToken: string;
        user: {
            id: any;
            email: any;
            role: any;
        };
        message?: never;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map
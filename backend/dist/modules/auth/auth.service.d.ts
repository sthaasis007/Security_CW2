import { LoginDto, RegisterDto } from "./auth.dto";
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
            id: any;
            name: any;
            email: any;
            role: any;
        };
    }>;
    login(data: LoginDto): Promise<{
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
    }>;
    logout(userId: string, req?: any): Promise<{
        ok: boolean;
        status: number;
        message: string;
    }>;
    rotateRefreshToken(rawToken: string): Promise<{
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
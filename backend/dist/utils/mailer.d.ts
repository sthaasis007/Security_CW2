export declare const sendMfaCode: (email: string, code: string) => Promise<void>;
export declare const sendEmailVerification: (email: string, rawToken: string) => Promise<void>;
export declare const sendPasswordReset: (email: string, rawToken: string) => Promise<void>;
export declare const sendPasswordChangedNotice: (email: string) => Promise<void>;
export declare const sendSuspiciousLoginNotice: (email: string) => Promise<void>;
export declare const sendSecurityAlert: (action: string, description: string) => Promise<void>;
//# sourceMappingURL=mailer.d.ts.map
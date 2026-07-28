"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_repository_1 = require("./auth.repository");
const activity_service_1 = require("../activity/activity.service");
const security_1 = require("../../utils/security");
const security_2 = require("../../config/security");
const mailer_1 = require("../../utils/mailer");
const signToken = (payload, expiresIn) => {
    return jsonwebtoken_1.default.sign(payload, (0, security_2.getJwtSecret)(), { expiresIn });
};
const issueSession = async (user) => {
    const userId = user._id.toString();
    const accessToken = signToken({ sub: userId, sv: user.sessionVersion || 0 }, "15m");
    const refreshToken = crypto_1.default.randomBytes(32).toString("hex");
    const refreshTokenHash = (0, security_1.hashSecret)(refreshToken);
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await auth_repository_1.AuthRepository.setRefreshToken(userId, refreshTokenHash, refreshExpiresAt);
    const csrfToken = crypto_1.default.randomBytes(24).toString("hex");
    await auth_repository_1.AuthRepository.setCsrfToken(userId, (0, security_1.hashSecret)(csrfToken), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    await activity_service_1.ActivityService.log("login", `User login: ${user.email}`, { mfa: Boolean(user.mfaEnabled) }, { id: userId, email: user.email, username: user.name || null, role: user.role || null });
    return {
        ok: true,
        status: 200,
        message: "Login successful",
        accessToken,
        refreshToken,
        csrfToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
    };
};
const createMfaChallenge = async (user, purpose) => {
    const challengeId = crypto_1.default.randomBytes(16).toString("hex");
    const code = crypto_1.default.randomInt(100000, 1000000).toString();
    const userId = user._id.toString();
    await auth_repository_1.AuthRepository.setMfaChallenge(userId, (0, security_1.hashSecret)(`${challengeId}:${code}`), new Date(Date.now() + 5 * 60 * 1000), purpose);
    try {
        await (0, mailer_1.sendMfaCode)(user.email, code);
    }
    catch (error) {
        await auth_repository_1.AuthRepository.clearMfaChallenge(userId);
        throw error;
    }
    return signToken({
        sub: userId,
        scope: purpose === "login" ? "mfa_login" : "mfa_setup",
        cid: challengeId,
        sv: user.sessionVersion || 0,
    }, "5m");
};
const verifyMfaChallenge = async (challengeToken, code, expectedScope) => {
    const payload = jsonwebtoken_1.default.verify(challengeToken, (0, security_2.getJwtSecret)());
    if (!payload.sub || !payload.cid || payload.scope !== expectedScope)
        return null;
    const user = await auth_repository_1.AuthRepository.findById(payload.sub);
    if (!user || (user.sessionVersion || 0) !== (payload.sv || 0))
        return null;
    const recoveryHash = (0, security_1.hashSecret)(code.toUpperCase());
    const recoveryHashes = (user.mfaRecoveryCodeHashes || []);
    if (expectedScope === "mfa_login" && recoveryHashes.includes(recoveryHash)) {
        await auth_repository_1.AuthRepository.consumeRecoveryCode(payload.sub, recoveryHash);
        return user;
    }
    if (!user.mfaChallengeHash ||
        user.mfaChallengePurpose !== (expectedScope === "mfa_login" ? "login" : "setup") ||
        !user.mfaChallengeExpiresAt ||
        new Date(user.mfaChallengeExpiresAt) < new Date() ||
        (user.mfaChallengeAttempts || 0) >= 5) {
        await auth_repository_1.AuthRepository.clearMfaChallenge(payload.sub);
        return null;
    }
    const candidate = (0, security_1.hashSecret)(`${payload.cid}:${code}`);
    const valid = crypto_1.default.timingSafeEqual(Buffer.from(candidate), Buffer.from(user.mfaChallengeHash));
    if (!valid) {
        const updated = await auth_repository_1.AuthRepository.incrementMfaAttempts(payload.sub);
        if ((updated?.mfaChallengeAttempts || 0) >= 5) {
            await auth_repository_1.AuthRepository.clearMfaChallenge(payload.sub);
        }
        return null;
    }
    await auth_repository_1.AuthRepository.clearMfaChallenge(payload.sub);
    return user;
};
exports.AuthService = {
    async register(data) {
        if (!(0, security_1.isPasswordStrong)(data.password)) {
            return { ok: false, status: 400, message: "Password must be at least 12 characters and include uppercase, lowercase, number, and special character" };
        }
        const existing = await auth_repository_1.AuthRepository.findByEmail(data.email);
        if (existing) {
            return { ok: false, status: 409, message: "Email already exists" };
        }
        const hashed = await bcryptjs_1.default.hash(data.password, 12);
        const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
        const verificationTokenHash = (0, security_1.hashSecret)(verificationToken);
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const user = await auth_repository_1.AuthRepository.createUser({
            name: data.name,
            email: data.email,
            password: hashed,
            role: "user",
            emailVerified: true,
        });
        await auth_repository_1.AuthRepository.setEmailVerificationToken(user._id.toString(), verificationTokenHash, expiresAt);
        await activity_service_1.ActivityService.log("register", `New user registered: ${user.email}`, { email: user.email }, {
            id: user._id.toString(),
            email: user.email || null,
            username: user.name || null,
            role: user.role || null,
        });
        return {
            ok: true,
            status: 201,
            message: "User registered successfully.",
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        };
    },
    async login(data) {
        const user = await auth_repository_1.AuthRepository.findByEmail(data.email);
        if (!user) {
            return { ok: false, status: 401, message: "Invalid credentials" };
        }
        const lockUntil = user.lockUntil ? new Date(user.lockUntil) : null;
        if (lockUntil && lockUntil > new Date()) {
            return { ok: false, status: 423, message: "Account temporarily locked. Please try again later." };
        }
        const match = await bcryptjs_1.default.compare(data.password, user.password);
        if (!match) {
            const updated = await auth_repository_1.AuthRepository.incrementLoginAttempts(user._id.toString());
            if (updated.loginAttempts >= 5) {
                await auth_repository_1.AuthRepository.lockAccount(user._id.toString(), new Date(Date.now() + 15 * 60 * 1000));
            }
            await activity_service_1.ActivityService.log("failed_login", `Failed login attempt for ${data.email}`, { email: data.email }, {
                id: user._id.toString(),
                email: user.email || null,
                username: user.name || null,
                role: user.role || null,
            });
            return { ok: false, status: 401, message: "Invalid credentials" };
        }
        await auth_repository_1.AuthRepository.resetLoginAttempts(user._id.toString());
        if (!user.emailVerified) {
            await auth_repository_1.AuthRepository.verifyEmail(user._id.toString());
        }
        if (user.mfaEnabled) {
            try {
                const challengeToken = await createMfaChallenge(user, "login");
                return {
                    ok: true,
                    status: 202,
                    mfaRequired: true,
                    challengeToken,
                    message: "A security code was sent to your email",
                };
            }
            catch {
                return { ok: false, status: 503, message: "Unable to deliver the security code" };
            }
        }
        const passwordExpiryDays = (0, security_1.getPasswordExpiryDays)();
        if (passwordExpiryDays > 0 && (!user.passwordChangedAt || new Date(user.passwordChangedAt).getTime() < Date.now() - passwordExpiryDays * 24 * 60 * 60 * 1000)) {
            await activity_service_1.ActivityService.log("password_expiry_warning", "Password expires soon", {}, { id: user._id.toString(), email: user.email || null, username: user.name || null, role: user.role || null });
        }
        return issueSession(user);
    },
    async verifyLoginMfa(challengeToken, code) {
        try {
            const user = await verifyMfaChallenge(challengeToken, code, "mfa_login");
            if (!user)
                return { ok: false, status: 401, message: "Invalid or expired security code" };
            return issueSession(user);
        }
        catch {
            return { ok: false, status: 401, message: "Invalid or expired security code" };
        }
    },
    async beginMfaSetup(userId) {
        const user = await auth_repository_1.AuthRepository.findById(userId);
        if (!user)
            return { ok: false, status: 404, message: "User not found" };
        if (user.mfaEnabled)
            return { ok: false, status: 409, message: "MFA is already enabled" };
        try {
            const challengeToken = await createMfaChallenge(user, "setup");
            return { ok: true, status: 200, challengeToken, message: "A security code was sent to your email" };
        }
        catch {
            return { ok: false, status: 503, message: "Email delivery is not configured or failed" };
        }
    },
    async confirmMfaSetup(userId, challengeToken, code) {
        try {
            const user = await verifyMfaChallenge(challengeToken, code, "mfa_setup");
            if (!user || user._id.toString() !== userId) {
                return { ok: false, status: 401, message: "Invalid or expired security code" };
            }
            const recoveryCodes = Array.from({ length: 8 }, () => {
                const raw = crypto_1.default.randomBytes(4).toString("hex").toUpperCase();
                return `${raw.slice(0, 4)}-${raw.slice(4)}`;
            });
            await auth_repository_1.AuthRepository.enableMfa(userId, recoveryCodes.map((value) => (0, security_1.hashSecret)(value)));
            return { ok: true, status: 200, message: "MFA enabled", recoveryCodes };
        }
        catch {
            return { ok: false, status: 401, message: "Invalid or expired security code" };
        }
    },
    async disableMfa(userId, password) {
        const user = await auth_repository_1.AuthRepository.findById(userId);
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            return { ok: false, status: 401, message: "Invalid password" };
        }
        await auth_repository_1.AuthRepository.disableMfa(userId);
        await auth_repository_1.AuthRepository.invalidateSessions(userId);
        return { ok: true, status: 200, message: "MFA disabled" };
    },
    async logout(userId, req) {
        const user = await auth_repository_1.AuthRepository.findById(userId);
        await activity_service_1.ActivityService.log("logout", `User logout: ${user?.email}`, { email: user?.email }, {
            id: userId,
            email: user?.email || null,
            username: user?.name || null,
            role: user?.role || null,
        }, req);
        // Clear refresh token from DB to invalidate session
        await auth_repository_1.AuthRepository.clearRefreshToken(userId);
        // Clear csrf token as well
        await auth_repository_1.AuthRepository.clearCsrfToken(userId);
        return { ok: true, status: 200, message: "Logout successful" };
    },
    async rotateRefreshToken(rawToken) {
        try {
            if (!rawToken)
                return { ok: false, status: 401, message: "Missing refresh token" };
            const tokenHash = (0, security_1.hashSecret)(rawToken);
            const user = await auth_repository_1.AuthRepository.findByRefreshTokenHash(tokenHash);
            if (!user) {
                const replayedUser = await auth_repository_1.AuthRepository.findByPreviousRefreshTokenHash(tokenHash);
                if (replayedUser) {
                    await auth_repository_1.AuthRepository.invalidateSessions(replayedUser._id.toString());
                }
                return { ok: false, status: 401, message: "Invalid refresh token" };
            }
            if (user.refreshTokenExpiresAt && new Date(user.refreshTokenExpiresAt) < new Date()) {
                await auth_repository_1.AuthRepository.clearRefreshToken(user._id.toString());
                return { ok: false, status: 401, message: "Refresh token expired" };
            }
            // generate new tokens
            const accessToken = signToken({
                sub: user._id.toString(),
                sv: user.sessionVersion || 0,
            }, "15m");
            const newRefresh = crypto_1.default.randomBytes(32).toString("hex");
            const newRefreshHash = (0, security_1.hashSecret)(newRefresh);
            const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await auth_repository_1.AuthRepository.rotateRefreshToken(user._id.toString(), tokenHash, newRefreshHash, refreshExpiresAt);
            // rotate csrf token as well
            const csrfToken = crypto_1.default.randomBytes(24).toString("hex");
            const csrfHash = (0, security_1.hashSecret)(csrfToken);
            const csrfExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await auth_repository_1.AuthRepository.setCsrfToken(user._id.toString(), csrfHash, csrfExpiresAt);
            return {
                ok: true,
                status: 200,
                accessToken,
                refreshToken: newRefresh,
                csrfToken,
                user: { id: user._id, email: user.email, role: user.role },
            };
        }
        catch (err) {
            console.error('rotateRefreshToken error', err);
            return { ok: false, status: 500, message: 'Server error' };
        }
    },
};
//# sourceMappingURL=auth.service.js.map
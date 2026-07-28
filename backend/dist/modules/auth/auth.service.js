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
const signToken = (payload, expiresIn) => {
    const secret = process.env.JWT_SECRET || "change_me_local_secret";
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
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
        const accessToken = signToken({ id: user._id.toString(), sub: user._id.toString(), email: user.email, role: user.role }, process.env.JWT_EXPIRES_IN || "15m");
        const passwordExpiryDays = (0, security_1.getPasswordExpiryDays)();
        const refreshToken = crypto_1.default.randomBytes(32).toString("hex");
        const refreshTokenHash = (0, security_1.hashSecret)(refreshToken);
        const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await auth_repository_1.AuthRepository.setRefreshToken(user._id.toString(), refreshTokenHash, refreshExpiresAt);
        if (passwordExpiryDays > 0 && (!user.passwordChangedAt || new Date(user.passwordChangedAt).getTime() < Date.now() - passwordExpiryDays * 24 * 60 * 60 * 1000)) {
            await activity_service_1.ActivityService.log("password_expiry_warning", "Password expires soon", {}, { id: user._id.toString(), email: user.email || null, username: user.name || null, role: user.role || null });
        }
        // create csrf token and store its hash
        const csrfToken = crypto_1.default.randomBytes(24).toString("hex");
        const csrfHash = (0, security_1.hashSecret)(csrfToken);
        const csrfExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await auth_repository_1.AuthRepository.setCsrfToken(user._id.toString(), csrfHash, csrfExpiresAt);
        await activity_service_1.ActivityService.log("login", `User login: ${user.email}`, { email: user.email }, {
            id: user._id.toString(),
            email: user.email || null,
            username: user.name || null,
            role: user.role || null,
        });
        return {
            ok: true,
            status: 200,
            message: "Login successful",
            accessToken,
            refreshToken,
            csrfToken,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        };
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
                return { ok: false, status: 401, message: "Invalid refresh token" };
            }
            if (user.refreshTokenExpiresAt && new Date(user.refreshTokenExpiresAt) < new Date()) {
                await auth_repository_1.AuthRepository.clearRefreshToken(user._id.toString());
                return { ok: false, status: 401, message: "Refresh token expired" };
            }
            // generate new tokens
            const accessToken = signToken({ id: user._id.toString(), sub: user._id.toString(), email: user.email, role: user.role }, process.env.JWT_EXPIRES_IN || "15m");
            const newRefresh = crypto_1.default.randomBytes(32).toString("hex");
            const newRefreshHash = (0, security_1.hashSecret)(newRefresh);
            const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await auth_repository_1.AuthRepository.setRefreshToken(user._id.toString(), newRefreshHash, refreshExpiresAt);
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
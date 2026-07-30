import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { AuthRepository } from "./auth.repository";
import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from "./auth.dto";
import { ActivityService } from "../activity/activity.service";
import { isPasswordStrong, hashSecret, getPasswordExpiryDays } from "../../utils/security";
import { getJwtSecret } from "../../config/security";
import { sendEmailVerification, sendMfaCode, sendPasswordChangedNotice, sendPasswordReset, sendSuspiciousLoginNotice } from "../../utils/mailer";

const PUBLIC_EMAIL_MESSAGE = "If the address is eligible, an email will be sent shortly.";
const RESET_TOKEN_MS = 15 * 60 * 1000;
const VERIFY_TOKEN_MS = 24 * 60 * 60 * 1000;

const passwordWasUsed = async (user: any, password: string) => {
  const hashes = [user.password, ...((user.passwordHistory || []).slice(0, 5).map((item: any) => item?.hash))].filter(Boolean);
  const matches = await Promise.all(hashes.map((hash: string) => bcrypt.compare(password, hash)));
  return matches.some(Boolean);
};

const changePassword = async (user: any, password: string) => {
  if (!isPasswordStrong(password)) {
    return { ok: false, status: 400, message: "Password does not meet complexity requirements" };
  }
  if (await passwordWasUsed(user, password)) {
    return { ok: false, status: 400, message: "New password must not match recent passwords" };
  }
  const updated = await AuthRepository.updatePassword(user._id.toString(), await bcrypt.hash(password, 12));
  if (!updated) return { ok: false, status: 404, message: "User not found" };
  await AuthRepository.invalidateSessions(user._id.toString());
  void sendPasswordChangedNotice(user.email).catch(() => undefined);
  return { ok: true, status: 200, message: "Password changed. Please sign in again." };
};

const signToken = (payload: object, expiresIn: string) => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn } as jwt.SignOptions);
};

const issueSession = async (user: any) => {
  const userId = user._id.toString();
  const accessToken = signToken({ sub: userId, sv: user.sessionVersion || 0 }, "15m");
  const refreshToken = crypto.randomBytes(32).toString("hex");
  const refreshTokenHash = hashSecret(refreshToken);
  const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await AuthRepository.setRefreshToken(userId, refreshTokenHash, refreshExpiresAt);

  const csrfToken = crypto.randomBytes(24).toString("hex");
  await AuthRepository.setCsrfToken(
    userId,
    hashSecret(csrfToken),
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  );

  await ActivityService.log(
    "login",
    `User login: ${user.email}`,
    { mfa: Boolean(user.mfaEnabled) },
    { id: userId, email: user.email, username: user.name || null, role: user.role || null },
  );

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

const createMfaChallenge = async (user: any, purpose: "login" | "setup") => {
  const challengeId = crypto.randomBytes(16).toString("hex");
  const code = crypto.randomInt(100000, 1000000).toString();
  const userId = user._id.toString();
  await AuthRepository.setMfaChallenge(
    userId,
    hashSecret(`${challengeId}:${code}`),
    new Date(Date.now() + 5 * 60 * 1000),
    purpose,
  );
  try {
    await sendMfaCode(user.email, code);
  } catch (error) {
    await AuthRepository.clearMfaChallenge(userId);
    throw error;
  }
  return signToken({
    sub: userId,
    scope: purpose === "login" ? "mfa_login" : "mfa_setup",
    cid: challengeId,
    sv: user.sessionVersion || 0,
  }, "5m");
};

const verifyMfaChallenge = async (
  challengeToken: string,
  code: string,
  expectedScope: "mfa_login" | "mfa_setup",
) => {
  const payload = jwt.verify(challengeToken, getJwtSecret()) as {
    sub?: string;
    scope?: string;
    cid?: string;
    sv?: number;
  };
  if (!payload.sub || !payload.cid || payload.scope !== expectedScope) return null;
  const user = await AuthRepository.findById(payload.sub);
  if (!user || ((user as any).sessionVersion || 0) !== (payload.sv || 0)) return null;

  const recoveryHash = hashSecret(code.toUpperCase());
  const recoveryHashes = ((user as any).mfaRecoveryCodeHashes || []) as string[];
  if (expectedScope === "mfa_login" && recoveryHashes.includes(recoveryHash)) {
    await AuthRepository.consumeRecoveryCode(payload.sub, recoveryHash);
    return user;
  }

  if (
    !(user as any).mfaChallengeHash ||
    (user as any).mfaChallengePurpose !== (expectedScope === "mfa_login" ? "login" : "setup") ||
    !(user as any).mfaChallengeExpiresAt ||
    new Date((user as any).mfaChallengeExpiresAt) < new Date() ||
    ((user as any).mfaChallengeAttempts || 0) >= 5
  ) {
    await AuthRepository.clearMfaChallenge(payload.sub);
    return null;
  }
  const candidate = hashSecret(`${payload.cid}:${code}`);
  const valid = crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from((user as any).mfaChallengeHash));
  if (!valid) {
    const updated = await AuthRepository.incrementMfaAttempts(payload.sub);
    if (((updated as any)?.mfaChallengeAttempts || 0) >= 5) {
      await AuthRepository.clearMfaChallenge(payload.sub);
    }
    return null;
  }
  await AuthRepository.clearMfaChallenge(payload.sub);
  return user;
};

export const AuthService = {
  async register(data: RegisterDto) {
    if (!isPasswordStrong(data.password)) {
      return { ok: false, status: 400, message: "Password must be at least 12 characters and include uppercase, lowercase, number, and special character" };
    }
 
    const email = data.email.trim().toLowerCase();
    const existing = await AuthRepository.findByEmail(email);
    if (existing) {
      return { ok: true, status: 202, message: PUBLIC_EMAIL_MESSAGE };
    }

    const hashed = await bcrypt.hash(data.password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = hashSecret(verificationToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await AuthRepository.createUser({
      name: data.name,
      email,
      password: hashed,
      role: "user",
      emailVerified: false,
    } as any);

    await AuthRepository.setEmailVerificationToken((user as any)._id.toString(), verificationTokenHash, expiresAt);
    try {
      await sendEmailVerification(email, verificationToken);
    } catch {
      return { ok: true, status: 202, message: PUBLIC_EMAIL_MESSAGE };
    }

    await ActivityService.log(
      "register",
      `New user registered: ${(user as any).email}`,
      { email: (user as any).email },
      {
        id: (user as any)._id.toString(),
        email: (user as any).email || null,
        username: (user as any).name || null,
        role: (user as any).role || null,
      }
    );

    return {
      ok: true,
      status: 202,
      message: PUBLIC_EMAIL_MESSAGE,
    };
  },

  async login(data: LoginDto) {
    const user = await AuthRepository.findByEmail(data.email);
    if (!user) {
      return { ok: false, status: 401, message: "Invalid credentials" };
    }

    const lockUntil = user.lockUntil ? new Date(user.lockUntil) : null;
    if (lockUntil && lockUntil > new Date()) {
      return { ok: false, status: 423, message: "Account temporarily locked. Please try again later." };
    }

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      const updated = await AuthRepository.incrementLoginAttempts((user as any)._id.toString());
      if ((updated as any).loginAttempts >= 5) {
        await AuthRepository.lockAccount((user as any)._id.toString(), new Date(Date.now() + 15 * 60 * 1000));
      }
      if ((updated as any).loginAttempts === 3) {
        void sendSuspiciousLoginNotice(user.email).catch(() => undefined);
      }
      await ActivityService.log(
        "failed_login",
        `Failed login attempt for ${data.email}`,
        { email: data.email },
        {
          id: (user as any)._id.toString(),
          email: (user as any).email || null,
          username: (user as any).name || null,
          role: (user as any).role || null,
        }
      );
      return { ok: false, status: 401, message: "Invalid credentials" };
    }

    if (!user.emailVerified) {
      return { ok: false, status: 403, message: "Verify your email before signing in.", code: "EMAIL_NOT_VERIFIED" };
    }
    await AuthRepository.resetLoginAttempts((user as any)._id.toString());

    const passwordExpiryDays = getPasswordExpiryDays();
    if (passwordExpiryDays > 0 && (!user.passwordChangedAt || new Date(user.passwordChangedAt).getTime() < Date.now() - passwordExpiryDays * 24 * 60 * 60 * 1000)) {
      return { ok: false, status: 403, message: "Password expired. Use password reset to choose a new password.", code: "PASSWORD_EXPIRED" };
    }

    if ((user as any).mfaEnabled) {
      try {
        const challengeToken = await createMfaChallenge(user, "login");
        return {
          ok: true,
          status: 202,
          mfaRequired: true,
          challengeToken,
          message: "A security code was sent to your email",
        };
      } catch {
        return { ok: false, status: 503, message: "Unable to deliver the security code" };
      }
    }

    return issueSession(user);
  },

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await AuthRepository.findByEmail(data.email.trim().toLowerCase());
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      await AuthRepository.setResetToken(user._id.toString(), hashSecret(token), new Date(Date.now() + RESET_TOKEN_MS));
      void sendPasswordReset(user.email, token).catch(() => undefined);
    }
    return { ok: true, status: 202, message: PUBLIC_EMAIL_MESSAGE };
  },

  async resetPassword(data: ResetPasswordDto) {
    const user = await AuthRepository.findByResetToken(hashSecret(data.token));
    if (!user || user.resetPasswordUsed || !user.resetPasswordExpires || new Date(user.resetPasswordExpires).getTime() <= Date.now()) {
      return { ok: false, status: 400, message: "Invalid or expired reset link" };
    }
    return changePassword(user, data.password);
  },

  async verifyEmail(rawToken: string) {
    const user = await AuthRepository.findByEmailVerificationToken(hashSecret(rawToken));
    if (!user || !user.emailVerificationExpires || new Date(user.emailVerificationExpires).getTime() <= Date.now()) {
      return { ok: false, status: 400, message: "Invalid or expired verification link" };
    }
    await AuthRepository.verifyEmail(user._id.toString());
    return { ok: true, status: 200, message: "Email verified. You can now sign in." };
  },

  async resendVerification(data: ForgotPasswordDto) {
    const user = await AuthRepository.findByEmail(data.email.trim().toLowerCase());
    if (user && !user.emailVerified) {
      const token = crypto.randomBytes(32).toString("hex");
      await AuthRepository.setEmailVerificationToken(user._id.toString(), hashSecret(token), new Date(Date.now() + VERIFY_TOKEN_MS));
      void sendEmailVerification(user.email, token).catch(() => undefined);
    }
    return { ok: true, status: 202, message: PUBLIC_EMAIL_MESSAGE };
  },

  changePassword,

  async verifyLoginMfa(challengeToken: string, code: string) {
    try {
      const user = await verifyMfaChallenge(challengeToken, code, "mfa_login");
      if (!user) return { ok: false, status: 401, message: "Invalid or expired security code" };
      return issueSession(user);
    } catch {
      return { ok: false, status: 401, message: "Invalid or expired security code" };
    }
  },

  async beginMfaSetup(userId: string) {
    const user = await AuthRepository.findById(userId);
    if (!user) return { ok: false, status: 404, message: "User not found" };
    if ((user as any).mfaEnabled) return { ok: false, status: 409, message: "MFA is already enabled" };
    try {
      const challengeToken = await createMfaChallenge(user, "setup");
      return { ok: true, status: 200, challengeToken, message: "A security code was sent to your email" };
    } catch {
      return { ok: false, status: 503, message: "Email delivery is not configured or failed" };
    }
  },

  async confirmMfaSetup(userId: string, challengeToken: string, code: string) {
    try {
      const user = await verifyMfaChallenge(challengeToken, code, "mfa_setup");
      if (!user || (user as any)._id.toString() !== userId) {
        return { ok: false, status: 401, message: "Invalid or expired security code" };
      }
      const recoveryCodes = Array.from({ length: 8 }, () => {
        const raw = crypto.randomBytes(4).toString("hex").toUpperCase();
        return `${raw.slice(0, 4)}-${raw.slice(4)}`;
      });
      await AuthRepository.enableMfa(userId, recoveryCodes.map((value) => hashSecret(value)));
      return { ok: true, status: 200, message: "MFA enabled", recoveryCodes };
    } catch {
      return { ok: false, status: 401, message: "Invalid or expired security code" };
    }
  },

  async disableMfa(userId: string, password: string) {
    const user = await AuthRepository.findById(userId);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { ok: false, status: 401, message: "Invalid password" };
    }
    await AuthRepository.disableMfa(userId);
    await AuthRepository.invalidateSessions(userId);
    return { ok: true, status: 200, message: "MFA disabled" };
  },

  async logout(userId: string, req?: any) {
    const user = await AuthRepository.findById(userId);
    await ActivityService.log(
      "logout",
      `User logout: ${user?.email}`,
      { email: user?.email },
      {
        id: userId,
        email: user?.email || null,
        username: user?.name || null,
        role: user?.role || null,
      },
      req
    );
    // Clear refresh token from DB to invalidate session
    await AuthRepository.clearRefreshToken(userId);
    // Clear csrf token as well
    await AuthRepository.clearCsrfToken(userId);
    return { ok: true, status: 200, message: "Logout successful" };
  },

  async rotateRefreshToken(rawToken: string | null) {
    try {
      if (!rawToken) return { ok: false, status: 401, message: "Missing refresh token" };
      const tokenHash = hashSecret(rawToken);
      const user = await AuthRepository.findByRefreshTokenHash(tokenHash);
      if (!user) {
        const replayedUser = await AuthRepository.findByPreviousRefreshTokenHash(tokenHash);
        if (replayedUser) {
          await AuthRepository.invalidateSessions((replayedUser as any)._id.toString());
        }
        return { ok: false, status: 401, message: "Invalid refresh token" };
      }

      if (user.refreshTokenExpiresAt && new Date(user.refreshTokenExpiresAt) < new Date()) {
        await AuthRepository.clearRefreshToken((user as any)._id.toString());
        return { ok: false, status: 401, message: "Refresh token expired" };
      }

      // generate new tokens
      const accessToken = signToken({
        sub: (user as any)._id.toString(),
        sv: (user as any).sessionVersion || 0,
      }, "15m");
      const newRefresh = crypto.randomBytes(32).toString("hex");
      const newRefreshHash = hashSecret(newRefresh);
      const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await AuthRepository.rotateRefreshToken((user as any)._id.toString(), tokenHash, newRefreshHash, refreshExpiresAt);

      // rotate csrf token as well
      const csrfToken = crypto.randomBytes(24).toString("hex");
      const csrfHash = hashSecret(csrfToken);
      const csrfExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await AuthRepository.setCsrfToken((user as any)._id.toString(), csrfHash, csrfExpiresAt);

      return {
        ok: true,
        status: 200,
        accessToken,
        refreshToken: newRefresh,
        csrfToken,
        user: { id: (user as any)._id, email: (user as any).email, role: (user as any).role },
      };
    } catch (err) {
      console.error('rotateRefreshToken error', err);
      return { ok: false, status: 500, message: 'Server error' };
    }
  },
};

import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { AuthRepository } from "./auth.repository";
import { LoginDto, RegisterDto } from "./auth.dto";
import { ActivityService } from "../activity/activity.service";

const PASSWORD_POLICY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const isPasswordStrong = (password: string) => PASSWORD_POLICY.test(password);

const signToken = (payload: object, expiresIn: string) => {
  const secret = process.env.JWT_SECRET || "change_me_local_secret";
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const AuthService = {
  async register(data: RegisterDto) {
    if (!isPasswordStrong(data.password)) {
      return { ok: false, status: 400, message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character" };
    }

    const existing = await AuthRepository.findByEmail(data.email);
    if (existing) {
      return { ok: false, status: 409, message: "Email already exists" };
    }

    const hashed = await bcrypt.hash(data.password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = crypto.createHash("sha256").update(verificationToken).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await AuthRepository.createUser({
      name: data.name,
      email: data.email,
      password: hashed,
      role: "user",
      emailVerified: true,
    } as any);

    await AuthRepository.setEmailVerificationToken((user as any)._id.toString(), verificationTokenHash, expiresAt);

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
      status: 201,
      message: "User registered successfully.",
      user: { id: (user as any)._id, name: (user as any).name, email: (user as any).email, role: (user as any).role },
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

    await AuthRepository.resetLoginAttempts((user as any)._id.toString());

    if (!user.emailVerified) {
      await AuthRepository.verifyEmail((user as any)._id.toString());
    }

    const accessToken = signToken({ id: (user as any)._id.toString(), sub: (user as any)._id.toString(), email: user.email, role: user.role }, process.env.JWT_EXPIRES_IN || "15m");
    const refreshToken = crypto.randomBytes(32).toString("hex");
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await AuthRepository.setRefreshToken((user as any)._id.toString(), refreshTokenHash, refreshExpiresAt);

    await ActivityService.log(
      "login",
      `User login: ${(user as any).email}`,
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
      status: 200,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: { id: (user as any)._id, name: (user as any).name, email: (user as any).email, role: (user as any).role },
    };
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
    return { ok: true, status: 200, message: "Logout successful" };
  },
};

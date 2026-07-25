import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { AuthRepository } from "./auth.repository";
import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from "./auth.dto";

export const AuthService = {
  async register(data: RegisterDto) {
    const existing = await AuthRepository.findByEmail(data.email);
    if (existing) {
      return { ok: false, status: 409, message: "Email already exists" };
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await AuthRepository.createUser({
      name: data.name,
      email: data.email,
      password: hashed,
      role: "user",
    });

    return {
      ok: true,
      status: 201,
      message: "User registered successfully",
      user: { id: user._id, email: user.email, role: user.role },
    };
  },

  async login(data: LoginDto) {
    const user = await AuthRepository.findByEmail(data.email);
    if (!user) {
      return { ok: false, status: 404, message: "User not found" };
    }

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      return { ok: false, status: 401, message: "Invalid credentials" };
    }

    const secret = process.env.JWT_SECRET || "change_me_local_secret";
    const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

    const token = (jwt.sign as any)(
      { sub: user._id.toString(), email: user.email, role: user.role },
      secret,
      { expiresIn }
    );

    return {
      ok: true,
      status: 200,
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, role: user.role },
    };
  },

  async requestPasswordReset(data: ForgotPasswordDto) {
    const user = await AuthRepository.findByEmail(data.email);
    if (!user) {
      return {
        ok: true,
        status: 200,
        message: "If an account exists, a reset link has been sent.",
      };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await AuthRepository.setResetToken(user._id.toString(), resetTokenHash, expiresAt);

    const frontendBase = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${frontendBase}/reset-password?token=${resetToken}`;

    await sendResetEmail(user.email, resetLink);

    const isProd = process.env.NODE_ENV === "production";
    return {
      ok: true,
      status: 200,
      message: "If an account exists, a reset link has been sent.",
      ...(isProd ? {} : { resetLink }),
    };
  },

  async resetPassword(data: ResetPasswordDto) {
    const resetTokenHash = crypto.createHash("sha256").update(data.token).digest("hex");
    const user = await AuthRepository.findByResetToken(resetTokenHash);

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires.getTime() < Date.now()) {
      return { ok: false, status: 400, message: "Invalid or expired reset token" };
    }

    const hashed = await bcrypt.hash(data.password, 10);
    await AuthRepository.updatePasswordAndClearReset(user._id.toString(), hashed);

    return { ok: true, status: 200, message: "Password reset successful" };
  },
};

const sendResetEmail = async (to: string, resetLink: string) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "no-reply@everblue.local";

  if (!host || !port || !user || !pass) {
    console.warn("SMTP not configured. Reset link:", resetLink);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject: "Reset your password",
    text: `Reset your password using this link: ${resetLink}`,
    html: `<p>Reset your password using this link:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  });
};

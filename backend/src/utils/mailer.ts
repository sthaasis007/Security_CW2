import nodemailer from "nodemailer";

const isConfigured = () => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();
  return Boolean(user && pass && !user.includes("your-gmail-address") && pass !== "your-app-password");
};

export const sendMfaCode = async (email: string, code: string) => {
  if (!isConfigured()) {
    throw new Error("Email delivery is not configured");
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: "Your EverBlue security code",
    text: `Your EverBlue security code is ${code}. It expires in 5 minutes. If you did not request it, do not share this code.`,
  });
};

const sendSecurityMail = async (to: string, subject: string, text: string) => {
  if (!isConfigured()) throw new Error("Email delivery is not configured");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({ from: process.env.EMAIL_FROM || process.env.EMAIL_USER, to, subject, text });
};

export const sendEmailVerification = (email: string, rawToken: string) => {
  const url = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${encodeURIComponent(rawToken)}`;
  return sendSecurityMail(email, "Verify your EverBlue email", `Verify your email within 24 hours:\n${url}\n\nIf you did not create this account, ignore this message.`);
};

export const sendPasswordReset = (email: string, rawToken: string) => {
  const url = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${encodeURIComponent(rawToken)}`;
  return sendSecurityMail(email, "Reset your EverBlue password", `Reset your password within 15 minutes:\n${url}\n\nThis link is single-use. If you did not request it, ignore this message.`);
};

export const sendPasswordChangedNotice = (email: string) =>
  sendSecurityMail(email, "Your EverBlue password was changed", "Your password was changed and all existing sessions were signed out. If this was not you, request a password reset immediately.");

export const sendSuspiciousLoginNotice = (email: string) =>
  sendSecurityMail(email, "Suspicious EverBlue login attempts", "Several unsuccessful login attempts were detected for your account. Your password has not been disclosed. Reset it if you do not recognize this activity.");

export const sendSecurityAlert = (action: string, description: string) => {
  const recipient = process.env.SECURITY_ALERT_EMAIL?.trim();
  if (!recipient) return Promise.resolve();
  return sendSecurityMail(recipient, `EverBlue security alert: ${action}`, description);
};

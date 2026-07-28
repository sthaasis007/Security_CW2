"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSecurityAlert = exports.sendSuspiciousLoginNotice = exports.sendPasswordChangedNotice = exports.sendPasswordReset = exports.sendEmailVerification = exports.sendMfaCode = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const isConfigured = () => {
    const user = process.env.EMAIL_USER?.trim();
    const pass = process.env.EMAIL_PASS?.trim();
    return Boolean(user && pass && !user.includes("your-gmail-address") && pass !== "your-app-password");
};
const sendMfaCode = async (email, code) => {
    if (!isConfigured()) {
        throw new Error("Email delivery is not configured");
    }
    const transporter = nodemailer_1.default.createTransport({
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
exports.sendMfaCode = sendMfaCode;
const sendSecurityMail = async (to, subject, text) => {
    if (!isConfigured())
        throw new Error("Email delivery is not configured");
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({ from: process.env.EMAIL_FROM || process.env.EMAIL_USER, to, subject, text });
};
const sendEmailVerification = (email, rawToken) => {
    const url = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${encodeURIComponent(rawToken)}`;
    return sendSecurityMail(email, "Verify your EverBlue email", `Verify your email within 24 hours:\n${url}\n\nIf you did not create this account, ignore this message.`);
};
exports.sendEmailVerification = sendEmailVerification;
const sendPasswordReset = (email, rawToken) => {
    const url = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${encodeURIComponent(rawToken)}`;
    return sendSecurityMail(email, "Reset your EverBlue password", `Reset your password within 15 minutes:\n${url}\n\nThis link is single-use. If you did not request it, ignore this message.`);
};
exports.sendPasswordReset = sendPasswordReset;
const sendPasswordChangedNotice = (email) => sendSecurityMail(email, "Your EverBlue password was changed", "Your password was changed and all existing sessions were signed out. If this was not you, request a password reset immediately.");
exports.sendPasswordChangedNotice = sendPasswordChangedNotice;
const sendSuspiciousLoginNotice = (email) => sendSecurityMail(email, "Suspicious EverBlue login attempts", "Several unsuccessful login attempts were detected for your account. Your password has not been disclosed. Reset it if you do not recognize this activity.");
exports.sendSuspiciousLoginNotice = sendSuspiciousLoginNotice;
const sendSecurityAlert = (action, description) => {
    const recipient = process.env.SECURITY_ALERT_EMAIL?.trim();
    if (!recipient)
        return Promise.resolve();
    return sendSecurityMail(recipient, `EverBlue security alert: ${action}`, description);
};
exports.sendSecurityAlert = sendSecurityAlert;
//# sourceMappingURL=mailer.js.map
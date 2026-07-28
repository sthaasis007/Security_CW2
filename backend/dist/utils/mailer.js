"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMfaCode = void 0;
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
//# sourceMappingURL=mailer.js.map
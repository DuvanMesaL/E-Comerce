"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailConfig = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
// Create a transporter for sending emails
const transporter = nodemailer_1.default.createTransport({
    host: config_1.default.email.host,
    port: config_1.default.email.port,
    auth: {
        user: config_1.default.email.auth.user,
        pass: config_1.default.email.auth.pass,
    },
});
// Send an email
const sendEmail = async (emailData) => {
    try {
        const info = await transporter.sendMail({
            from: `"E-Commerce" <${config_1.default.email.auth.user}>`,
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.content,
        });
        console.log(`Email sent: ${info.messageId}`);
        // For Ethereal Email, log the preview URL
        if (config_1.default.email.host === "smtp.ethereal.email") {
            console.log(`Preview URL: ${nodemailer_1.default.getTestMessageUrl(info)}`);
        }
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
// Verify email configuration
const verifyEmailConfig = async () => {
    try {
        await transporter.verify();
        console.log("Email configuration verified");
        return true;
    }
    catch (error) {
        console.error("Email configuration error:", error);
        return false;
    }
};
exports.verifyEmailConfig = verifyEmailConfig;

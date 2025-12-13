import nodemailer from "nodemailer";

interface SmtpConfig {
    host: string;
    port: number;
    secure: boolean;
    username?: string;
    password?: string;
    fromEmail?: string;
    toEmail?: string;
}

interface EmailPayload {
    to: string;
    subject: string;
    html: string;
    text: string;
    from?: string;
}

export async function sendEmail(config: SmtpConfig, payload: EmailPayload) {
    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure, // true for 465, false for other ports
        auth: config.username
            ? {
                user: config.username,
                pass: config.password,
            }
            : undefined,
    });

    const info = await transporter.sendMail({
        from: payload.from || config.fromEmail || config.username, // Fallback to config from/user
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
    });

    return info;
}

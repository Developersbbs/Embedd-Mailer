import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

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
    cc?: string;
    subject: string;
    html: string;
    text: string;
    from?: string;
}

// Global cache for transporters to prevent connection flooding
// Key: "host:port:user" -> Value: Transporter
const transporterCache = new Map<string, Transporter>();

function getTransporterKey(config: SmtpConfig): string {
    return `${config.host}:${config.port}:${config.username || 'anon'}`;
}

export async function sendEmail(config: SmtpConfig, payload: EmailPayload) {
    const key = getTransporterKey(config);
    let transporter = transporterCache.get(key);

    if (!transporter) {
        console.log(`[Mail] Creating new transport for ${key}`);
        transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure, // true for 465, false for other ports
            auth: config.username
                ? {
                    user: config.username,
                    pass: config.password,
                }
                : undefined,
            pool: true, // Use pooled connections
            maxConnections: 5, // Limit concurrent connections per host
            maxMessages: 100, // Limit messages per connection
        });
        transporterCache.set(key, transporter);
    } else {
        // Optional: Verify connection is still alive (can add latency, use sparingly or rely on pool)
        // For high volume, relying on pool behavior is better than verifying every time
    }

    try {
        const info = await transporter.sendMail({
            from: payload.from || config.fromEmail || config.username, // Fallback to config from/user
            to: payload.to,
            cc: payload.cc,
            subject: payload.subject,
            text: payload.text,
            html: payload.html,
        });
        return info;
    } catch (error) {
        console.error(`[Mail] Send failed for ${key}`, error);
        // If connection failed, remove from cache so we retry fresh next time
        transporterCache.delete(key);
        throw error;
    }
}

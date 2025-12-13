import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/modals/Projects";
import Submission from "@/modals/Submissions";
import MailLog from "@/modals/MailLog";
import Template from "@/modals/Templates";
import { sendEmail } from "@/lib/mail";
import { checkSpam } from "@/lib/spam";
import { validateAndSanitize } from "@/lib/validation";

// Helper to get CORS headers
function getCorsHeaders(origin: string) {
    return {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
    };
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    const origin = req.headers.get("origin") || "";

    // Handle CORS preflight for POST (sometimes needed if middleware doesn't catch it)
    if (req.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 200,
            headers: getCorsHeaders(origin),
        });
    }

    try {
        await connectDB();
        const { projectId } = await params;

        // ... existing logic ...
        // (We need to return responses with CORS headers)

        // 1. Get API Key from headers
        const apiKey = req.headers.get("x-api-key");
        if (!apiKey) {
            return NextResponse.json(
                { success: false, error: "Missing API Key" },
                { status: 401, headers: getCorsHeaders(origin) }
            );
        }

        // 2. Load Project
        const project = await Project.findOne({ _id: projectId, apiKey });
        if (!project) {
            return NextResponse.json(
                { success: false, error: "Invalid Project ID or API Key" },
                { status: 401, headers: getCorsHeaders(origin) }
            );
        }

        if (!project.isActive) {
            return NextResponse.json(
                { success: false, error: "Project is inactive" },
                { status: 403, headers: getCorsHeaders(origin) }
            );
        }

        // 3. Parse Body
        const body = await req.json();

        // 4. Spam Protection & Domain Check
        // We technically check domain in spam.ts, but standard CORS should also be enforced here if we want strict browser blocking.
        // However, standard CORS allows *, and we rely on our logic to reject.
        // OR we can check project.allowedDomains to return specific Access-Control-Allow-Origin.

        // Let's rely on our spam logic for rejection, but return the requesting origin as allowed so the browser can read the error/success.
        // If we want strict CORS, we should check:
        // if (project.allowedDomains.length > 0 && !project.allowedDomains.includes(origin)) { ... }

        const spamResult = await checkSpam({
            ip: req.headers.get("x-forwarded-for") || "unknown",
            userAgent: req.headers.get("user-agent") || "unknown",
            origin,
            body,
            allowedDomains: project.allowedDomains,
            honeypotField: "_honeypot",
        });

        if (spamResult.isSpam) {
            await Submission.create({
                projectId,
                data: body,
                ip: req.headers.get("x-forwarded-for") || "unknown",
                userAgent: req.headers.get("user-agent") || "unknown",
                referrer: req.headers.get("referer"),
                spamDetected: true,
            });

            // Log blocked / spam event for analytics
            try {
                await MailLog.create({
                    projectId,
                    event: "blocked",
                    subject: `Blocked submission for ${project.name}`,
                    to: project.smtpSettings?.toEmail || project.smtpSettings?.username,
                    status: spamResult.reason || "Spam detected",
                    meta: {
                        type: "spam",
                        origin,
                    },
                });
            } catch (logErr) {
                console.error("Failed to write spam MailLog entry", logErr);
            }

            return NextResponse.json(
                { success: false, error: spamResult.reason || "Spam detected" },
                { status: 400, headers: getCorsHeaders(origin) }
            );
        }

        // 5. Validation
        const validationResult = validateAndSanitize(body, project.formSchema || []);

        if (!validationResult.isValid) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: validationResult.errors },
                { status: 400, headers: getCorsHeaders(origin) }
            );
        }

        const sanitizedData = validationResult.sanitizedData;

        // 6. Send Email
        if (project.smtpSettings && project.smtpSettings.host) {
            try {
                const to = project.smtpSettings.toEmail || project.smtpSettings.username || "";

                // Determine Subject and HTML Content
                let subject = `New Submission for ${project.name}`;
                let html = "";

                if (project.emailTemplateId) {
                    try {
                        const template = await Template.findById(project.emailTemplateId);
                        // Render Subject
                        subject = template.subject.replace(/{{([^}]+)}}/g, (_: string, key: string) => {
                            const cleanKey = key.trim();
                            return sanitizedData[cleanKey] || sanitizedData[cleanKey.toLowerCase()] || "";
                        });

                        // Render HTML Content
                        html = template.content.replace(/{{([^}]+)}}/g, (_: string, key: string) => {
                            const cleanKey = key.trim();
                            return sanitizedData[cleanKey] || sanitizedData[cleanKey.toLowerCase()] || "";
                        });
                    } catch (err) {
                        console.error("Failed to load template", err);
                    }
                }

                // Fallback to default if no template or empty HTML
                if (!html) {
                    const fields = Object.entries(sanitizedData)
                        .map(([key, value]) => `<b>${key}:</b> ${value}`)
                        .join("<br>");
                    html = `<h2>New Form Submission</h2><p>${fields}</p>`;
                }

                const info = await sendEmail(project.smtpSettings, {
                    to,
                    subject,
                    text: JSON.stringify(sanitizedData, null, 2),
                    html,
                });

                // Log successful delivery event
                try {
                    await MailLog.create({
                        projectId,
                        event: "delivered",
                        subject,
                        to,
                        status: info?.response || "Sent",
                        meta: {
                            messageId: info?.messageId,
                            accepted: info?.accepted,
                            rejected: info?.rejected,
                        },
                    });
                } catch (logErr) {
                    console.error("Failed to write MailLog entry", logErr);
                }
            } catch (emailErr: any) {
                console.error("Failed to send email:", emailErr);

                // Optionally log send failures as a separate event
                try {
                    await MailLog.create({
                        projectId,
                        event: "bounced",
                        subject: `Failed submission for ${project.name}`,
                        to: project.smtpSettings.toEmail || project.smtpSettings.username,
                        status: emailErr?.message || "Email send failed",
                    });
                } catch (logErr) {
                    console.error("Failed to write bounce MailLog entry", logErr);
                }
            }
        }

        // 7. Store Submission
        await Submission.create({
            projectId,
            data: sanitizedData,
            ip: req.headers.get("x-forwarded-for") || "unknown",
            userAgent: req.headers.get("user-agent") || "unknown",
            referrer: req.headers.get("referer"),
            spamDetected: false,
        });

        return NextResponse.json(
            { success: true, message: "Form submitted successfully" },
            { status: 200, headers: getCorsHeaders(origin) }
        );

    } catch (error: any) {
        console.error("Submission error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500, headers: getCorsHeaders(req.headers.get("origin") || "") }
        );
    }
}

export async function OPTIONS(req: NextRequest) {
    const origin = req.headers.get("origin") || "";
    return new NextResponse(null, {
        status: 200,
        headers: getCorsHeaders(origin),
    });
}

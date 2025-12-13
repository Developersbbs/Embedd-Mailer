import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { connectDB } from "../lib/db";
import Template from "../modals/Templates";

async function main() {
    try {
        console.log("Connecting to DB...");
        await connectDB();
        console.log("Connected.");

        const globalTemplates = [
            {
                name: "Welcome Email",
                subject: "Welcome to our platform!",
                content: `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; }
  .content { padding: 20px 0; }
  .footer { font-size: 12px; color: #666; text-align: center; margin-top: 20px; }
  .button { display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome on board!</h1>
    </div>
    <div class="content">
      <p>Hi {{name}},</p>
      <p>We are thrilled to have you with us. This is a default template you can use to get started.</p>
      <p>Feel free to customize this content to match your brand.</p>
      <p style="text-align: center;">
        <a href="#" class="button">Get Started</a>
      </p>
    </div>
    <div class="footer">
      <p>&copy; {{year}} Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
                isGlobal: true
            },
            {
                name: "Password Reset",
                subject: "Reset your password",
                content: `<!DOCTYPE html>
<html>
<body>
  <p>Hello,</p>
  <p>We received a request to reset your password. Click the link below to proceed:</p>
  <p><a href="{{resetLink}}">Reset Password</a></p>
  <p>If you didn't ask for this, you can ignore this email.</p>
</body>
</html>`,
                isGlobal: true
            }
        ];

        console.log("Seeding global templates...");
        for (const t of globalTemplates) {
            const exists = await Template.findOne({ name: t.name, isGlobal: true });
            if (!exists) {
                await Template.create(t);
                console.log(`Created: ${t.name}`);
            } else {
                console.log(`Skipped (exists): ${t.name}`);
            }
        }

    } catch (error) {
        console.error("ERROR:", error);
    } finally {
        process.exit(0);
    }
}

main();

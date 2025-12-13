import mongoose from "mongoose";
import Project from "../modals/Projects";
import Submission from "../modals/Submissions";
import { connectDB } from "../lib/db";

// Mock environment variables if needed
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/quick";

async function main() {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected.");

    // 1. Create a Test Project
    const apiKey = "test-api-key-" + Date.now();
    const project = await Project.create({
        name: "Test Project",
        userId: "test-user",
        apiKey: apiKey,
        allowedDomains: ["localhost"],
        isActive: true,
    });
    console.log(`Created Project: ${project._id} with Key: ${apiKey}`);

    // 2. Simulate Form Submission (using fetch against the running server)
    // Note: This assumes the server is running on localhost:3000
    const projectId = project._id;
    const url = `http://localhost:3000/api/forms/${projectId}/submit`;

    console.log(`Submitting to ${url}...`);

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Origin": "http://localhost:3000"
        },
        body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            message: "Hello World",
        }),
    });

    const data = await res.json();
    console.log("Response:", res.status, data);

    if (res.status === 200 && data.success) {
        console.log("✅ Submission successful via API");
    } else {
        console.error("❌ Submission failed via API");
    }

    // 3. Verify in DB
    const submission = await Submission.findOne({ projectId: projectId });
    if (submission) {
        console.log("✅ Submission found in DB:", submission.data);
    } else {
        console.error("❌ Submission NOT found in DB");
    }

    // Cleanup
    await Project.deleteOne({ _id: project._id });
    await Submission.deleteMany({ projectId: project._id });
    console.log("Cleanup done.");

    await mongoose.disconnect();
}

main().catch(console.error);

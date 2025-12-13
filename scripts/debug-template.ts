import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { connectDB } from "../lib/db";
import Project from "../modals/Projects";
import Template from "../modals/Templates";

async function main() {
    try {
        console.log("Connecting to DB...");
        await connectDB();
        console.log("Connected.");

        console.log("Fetching a project...");
        const project = await Project.findOne();
        if (!project) {
            console.error("No projects found to test with.");
            return;
        }
        console.log("Found project:", project._id);

        console.log("Attempting to create a template...");
        const template = await Template.create({
            projectId: project._id,
            name: "Debug Template",
            subject: "Debug Subject",
            content: "<h1>Debug Content</h1>"
        });
        console.log("Template created successfully:", template._id);

        // Clean up
        await Template.findByIdAndDelete(template._id);
        console.log("Debug template deleted.");

    } catch (error) {
        console.error("ERROR:", error);
    } finally {
        process.exit(0);
    }
}

main();

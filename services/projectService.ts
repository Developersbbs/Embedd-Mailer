import { connectDB } from "@/lib/db";
import Project from "@/modals/Projects";

export interface CreateProjectInput {
  userId: string;
  name: string;
  description?: string;
}

function generateApiKey() {
  // 48-char random hex API key
  return Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createProject(input: CreateProjectInput) {
  await connectDB();

  if (!input.name?.trim()) {
    throw new Error("Project name is required");
  }

  const apiKey = generateApiKey();

  const project = await Project.create({
    name: input.name.trim(),
    description: input.description?.trim() || "",
    userId: input.userId,
    apiKey,
  });

  return project;
}

export async function listProjectsForUser(userId: string) {
  await connectDB();
  return Project.find({ userId }).sort({ createdAt: -1 }).lean();
}

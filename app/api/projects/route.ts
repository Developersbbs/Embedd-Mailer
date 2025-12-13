import { getCurrentUserFromRequest } from "@/lib/auth";
import { createProject, listProjectsForUser } from "@/services/projectService";

export async function GET(req: Request) {
  const user = await getCurrentUserFromRequest(req);

  if (!user) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const projects = await listProjectsForUser(user.uid);
    return new Response(JSON.stringify({ success: true, projects }), { status: 200 });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Failed to load projects" }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUserFromRequest(req);

  if (!user) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const body = await req.json();
    const name = (body.name ?? "").toString();
    const description = body.description ? body.description.toString() : undefined;

    const project = await createProject({
      userId: user.uid,
      name,
      description,
    });

    return new Response(JSON.stringify({ success: true, project }), { status: 201 });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Failed to create project" }),
      { status: 400 }
    );
  }
}

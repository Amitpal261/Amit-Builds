import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  coverImage: z.string().min(1),
  gallery: z.array(z.string()).default([]),
  description: z.string().min(1),
  problem: z.string().optional(),
  solution: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0)
});

export async function GET() {
  await connectDB();
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  await connectDB();
  const body = await req.json();
  const parsed = projectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const project = await Project.create(parsed.data);
    return NextResponse.json(project, { status: 201 });
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && err.code === 11000) {
      return NextResponse.json({ error: "A project with this slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
  }
}

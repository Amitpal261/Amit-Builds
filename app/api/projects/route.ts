import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const galleryItemSchema = z.union([
  z.string().trim().min(1),
  z.object({
    url: z.string().trim().min(1),
    size: z.enum(["small", "wide", "tall"]).optional()
  })
]);

function isCloudinaryOrRemoteUrl(value: string) {
  return Boolean(value) && !value.startsWith("data:") && !value.startsWith("blob:");
}

function normalizeGalleryInput(value: unknown): Array<string | { url: string; size?: string }> {
  if (Array.isArray(value)) {
    return value.filter((item) => {
      if (typeof item === "string") return isCloudinaryOrRemoteUrl(item.trim());
      if (item && typeof item === "object" && "url" in item) {
        const url = typeof item.url === "string" ? item.url.trim() : "";
        return isCloudinaryOrRemoteUrl(url);
      }
      return false;
    }) as Array<string | { url: string; size?: string }>;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? normalizeGalleryInput(parsed) : [];
    } catch {
      return [];
    }
  }

  return [];
}

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  coverImage: z.string().min(1),
  gallery: z.array(galleryItemSchema).default([]),
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
  const safeBody = {
    ...body,
    gallery: normalizeGalleryInput(body?.gallery)
  };
  const parsed = projectSchema.safeParse(safeBody);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const normalized = {
      ...parsed.data,
      gallery: parsed.data.gallery.map((item) =>
        typeof item === "string" ? { url: item, size: "small" } : { url: item.url, size: item.size || "small" }
      )
    };

    const project = await Project.create(normalized);
    return NextResponse.json(project, { status: 201 });
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && err.code === 11000) {
      return NextResponse.json({ error: "A project with this slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
  }
}

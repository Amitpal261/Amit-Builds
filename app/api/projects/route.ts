import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { requireAdmin } from "@/lib/auth";
import { memoryStore } from "@/lib/store";
import { z } from "zod";

export const dynamic = "force-dynamic";

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
  try {
    const db = await connectDB();
    if (db) {
      const projects = await Project.find().sort({ order: 1, createdAt: -1 });
      if (projects.length > 0) {
        return NextResponse.json(projects);
      }
    }
  } catch (err) {
    console.warn("[AI Studio] Projects GET fallback to memoryStore:", err);
  }
  return NextResponse.json(memoryStore.getProjects());
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  const body = await req.json();
  const safeBody = {
    ...body,
    gallery: normalizeGalleryInput(body?.gallery)
  };
  const parsed = projectSchema.safeParse(safeBody);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const normalized = {
    ...parsed.data,
    gallery: parsed.data.gallery.map((item) =>
      typeof item === "string" ? { url: item, size: "small" as const } : { url: item.url, size: item.size || "small" }
    )
  };

  try {
    const db = await connectDB();
    if (db) {
      const project = await Project.create(normalized);
      return NextResponse.json(project, { status: 201 });
    }
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && err.code === 11000) {
      return NextResponse.json({ error: "A project with this slug already exists." }, { status: 409 });
    }
    console.warn("[AI Studio] Project create fallback to memoryStore:", err);
  }

  const created = memoryStore.createProject(normalized);
  return NextResponse.json(created, { status: 201 });
}


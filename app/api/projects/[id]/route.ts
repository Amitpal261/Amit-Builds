import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { requireAdmin } from "@/lib/auth";
import { memoryStore } from "@/lib/store";

export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const db = await connectDB();
    if (db) {
      const project = await Project.findById(params.id);
      if (project) return NextResponse.json(project);
    }
  } catch (err) {
    console.warn("[AI Studio] Project GET id fallback to memoryStore:", err);
  }
  const mem = memoryStore.getProjectById(params.id) || memoryStore.getProjectBySlug(params.id);
  if (!mem) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(mem);
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  const body = await req.json();
  const galleryValue: Array<string | { url?: string; size?: string } | null> = Array.isArray(body?.gallery)
    ? body.gallery
    : typeof body?.gallery === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(body.gallery);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : [];

  const normalizedGallery: Array<{ url: string; size: "small" | "wide" | "tall" }> = [];

  for (const item of galleryValue) {
    if (typeof item === "string") {
      const url = item.trim();
      if (url && !url.startsWith("data:") && !url.startsWith("blob:")) {
        normalizedGallery.push({ url, size: "small" });
      }
      continue;
    }

    if (item && typeof item === "object" && "url" in item) {
      const typedItem = item as { url?: string; size?: string };
      const url = (typedItem.url || "").trim();
      if (!url || url.startsWith("data:") || url.startsWith("blob:")) continue;

      const size = typedItem.size === "wide" || typedItem.size === "tall" ? typedItem.size : "small";
      normalizedGallery.push({ url, size: size as "small" | "wide" | "tall" });
    }
  }

  try {
    const db = await connectDB();
    if (db) {
      const project = await Project.findByIdAndUpdate(
        params.id,
        { ...body, gallery: normalizedGallery },
        {
          new: true,
          runValidators: true
        }
      );
      if (project) return NextResponse.json(project);
    }
  } catch (err: unknown) {
    console.error("Project update failed:", err);

    if (typeof err === "object" && err !== null && "code" in err && err.code === 11000) {
      return NextResponse.json({ error: "A project with this slug already exists." }, { status: 409 });
    }
  }

  const updated = memoryStore.updateProject(params.id, { ...body, gallery: normalizedGallery });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  try {
    const db = await connectDB();
    if (db) {
      const project = await Project.findByIdAndDelete(params.id);
      if (project) return NextResponse.json({ success: true });
    }
  } catch (err) {
    console.warn("[AI Studio] Project DELETE fallback to memoryStore:", err);
  }

  const deleted = memoryStore.deleteProject(params.id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}


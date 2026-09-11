import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { requireAdmin } from "@/lib/auth";

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  await connectDB();
  const project = await Project.findById(params.id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  await connectDB();
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

  try {
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

    const project = await Project.findByIdAndUpdate(
      params.id,
      { ...body, gallery: normalizedGallery },
      {
        new: true,
        runValidators: true
      }
    );
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (err: unknown) {
    console.error("Project update failed:", err);

    if (typeof err === "object" && err !== null && "code" in err && err.code === 11000) {
      return NextResponse.json({ error: "A project with this slug already exists." }, { status: 409 });
    }

    const message =
      typeof err === "object" && err !== null && "message" in err && typeof err.message === "string"
        ? err.message
        : "Failed to update project.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  await connectDB();
  const project = await Project.findByIdAndDelete(params.id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}

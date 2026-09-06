import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

// NOTE: For simplicity (and to work out-of-the-box with zero external setup),
// uploaded images are converted to base64 data URIs and stored directly wherever
// you save them (e.g. a project's coverImage field in MongoDB).
// This is fine for a small portfolio, but for many/large images consider
// switching to a real object store (Vercel Blob, Cloudinary, S3, etc.) —
// swap out this route's implementation and keep the same request/response shape.

const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Image must be smaller than 4MB." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  return NextResponse.json({ url: dataUrl });
}

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/lib/auth";

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

function getPublicIdFromUrl(url: string) {
  try {
    const pathname = new URL(url).pathname;
    const parts = pathname.split("/").filter(Boolean);
    const uploadIndex = parts.findIndex((part) => part === "upload");

    if (uploadIndex === -1) return "";

    let remaining = parts.slice(uploadIndex + 1);

    if (remaining[0]?.startsWith("v") && /^v\d+$/i.test(remaining[0])) {
      remaining = remaining.slice(1);
    }

    if (!remaining.length) return "";

    return remaining.join("/").replace(/\.[^/.]+$/, "");
  } catch {
    return "";
  }
}

function getResourceTypeFromUrl(url: string) {
  try {
    return new URL(url).pathname.includes("/video/") ? "video" : "image";
  } catch {
    return "image";
  }
}

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

  if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
    return NextResponse.json({ error: "Only image and video files are allowed." }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Media must be smaller than 8MB." }, { status: 400 });
  }

  if (!isCloudinaryConfigured) {
    return NextResponse.json(
      {
        error:
          "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env.local file."
      },
      { status: 500 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${file.type};base64,${bytes.toString("base64")}`;

  const uploadResult = await cloudinary.uploader.upload(dataUrl, {
    folder: "amit-portfolio",
    resource_type: file.type.startsWith("video/") ? "video" : "image",
    use_filename: true,
    unique_filename: true
  });

  return NextResponse.json({
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    resourceType: uploadResult.resource_type
  });
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  const url = req.nextUrl.searchParams.get("url") || (await req.json().catch(() => null))?.url;

  if (!url) {
    return NextResponse.json({ error: "Image URL is required." }, { status: 400 });
  }

  if (!isCloudinaryConfigured) {
    return NextResponse.json({ success: true });
  }

  const publicId = getPublicIdFromUrl(url);

  if (!publicId) {
    return NextResponse.json({ success: true, skipped: true });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: getResourceTypeFromUrl(url)
    });

    if (result.result === "ok" || result.result === "not found") {
      return NextResponse.json({ success: true, result: result.result });
    }

    return NextResponse.json({ error: `Cloudinary delete failed: ${result.result || "unknown error"}` }, { status: 500 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Cloudinary delete failed."
      },
      { status: 500 }
    );
  }
}

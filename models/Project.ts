import  { Schema, models, model } from "mongoose";

export type GallerySize = "small" | "wide" | "tall" | "full";

export type GalleryItem = {
  url: string;
  size: GallerySize;
};

export interface IProject {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  gallery: GalleryItem[];
  description: string;
  problem?: string;
  solution?: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

function isRemoteMediaUrl(value: string) {
  return Boolean(value) && !value.startsWith("data:") && !value.startsWith("blob:");
}

function normalizeGallery(value: unknown): GalleryItem[] {
  const rawItems: unknown[] = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : [];

  return rawItems
    .map((item) => {
      if (typeof item === "string") {
        const url = item.trim();
        return isRemoteMediaUrl(url) ? { url, size: "small" as GallerySize } : null;
      }

      if (item && typeof item === "object" && "url" in item) {
        const typedItem = item as { url?: unknown; size?: unknown };
        const url = typeof typedItem.url === "string" ? typedItem.url.trim() : "";

        if (!isRemoteMediaUrl(url)) return null;

        const size =
          typedItem.size === "full" || typedItem.size === "wide" || typedItem.size === "tall"
            ? typedItem.size
            : typedItem.size === "two"
              ? "wide"
              : "small";
        return { url, size: size as GallerySize };
      }

      return null;
    })
    .filter((item): item is GalleryItem => item !== null && Boolean(item.url));
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: { type: String, required: true, trim: true },
    coverImage: { type: String, required: true },
    gallery: {
      type: [
        {
          url: { type: String, required: true, trim: true },
          size: { type: String, enum: ["small", "wide", "tall", "full"], default: "small" }
        }
      ],
      default: [],
      set: normalizeGallery
    },
    description: { type: String, required: true },
    problem: { type: String, default: "" },
    solution: { type: String, default: "" },
    techStack: { type: [String], default: [] },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default models.Project || model<IProject>("Project", ProjectSchema);

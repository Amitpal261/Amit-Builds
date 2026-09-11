"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IProject, type GallerySize } from "@/models/Project";
import ImageUploadField from "./ImageUploadField";
import GalleryUploadField, { type GalleryItem } from "./GalleryUploadField";

type Props = {
  initial?: Partial<IProject>;
  projectId?: string;
};

function normalizeGalleryItem(item: unknown): GalleryItem | null {
  if (!item || typeof item !== "object") return null;

  const candidate = item as { url?: unknown; size?: unknown };
  if (typeof candidate.url !== "string") return null;

  const url = candidate.url.trim();
  if (!url) return null;

  const size =
    candidate.size === "full" || candidate.size === "wide" || candidate.size === "tall"
      ? candidate.size
      : candidate.size === "two"
        ? "wide"
        : "small";
  return { url, size: size as GallerySize };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function ProjectForm({ initial, projectId }: Props) {
  const router = useRouter();
  const isEdit = Boolean(projectId);

  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [category, setCategory] = useState(initial?.category || "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage || "");
  const [gallery, setGallery] = useState<GalleryItem[]>(() =>
    (initial?.gallery || []).flatMap((item) => {
      const normalized = normalizeGalleryItem(item);
      return normalized ? [normalized] : [];
    })
  );
  const [description, setDescription] = useState(initial?.description || "");
  const [problem, setProblem] = useState(initial?.problem || "");
  const [solution, setSolution] = useState(initial?.solution || "");
  const [techStack, setTechStack] = useState((initial?.techStack || []).join(", "));
  const [liveUrl, setLiveUrl] = useState(initial?.liveUrl || "");
  const [githubUrl, setGithubUrl] = useState(initial?.githubUrl || "");
  const [featured, setFeatured] = useState(initial?.featured || false);
  const [order, setOrder] = useState(initial?.order ?? 0);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function removeGalleryImage(url: string) {
    if (!url) return;

    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || "Delete failed.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
      return;
    }

    setGallery((current) => current.filter((item) => item.url !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      slug: slug || slugify(title),
      category,
      coverImage,
      gallery: (gallery || [])
        .map((item) => normalizeGalleryItem(item))
        .filter((item): item is GalleryItem => Boolean(item))
        .map((item) => ({ url: item.url.trim(), size: item.size })),
      description,
      problem,
      solution,
      techStack: techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      liveUrl,
      githubUrl,
      featured,
      order: Number(order)
    };

    try {
      const res = await fetch(isEdit ? `/api/projects/${projectId}` : "/api/projects", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.error?.formErrors?.[0] || body.error || "Failed to save project.");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project.");
      setSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
      </div>

      <div>
        <label htmlFor="slug">Slug (URL)</label>
        <input
          id="slug"
          type="text"
          required
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value));
            setSlugTouched(true);
          }}
        />
      </div>

      <div>
        <label htmlFor="category">Category</label>
        <input
          id="category"
          type="text"
          required
          placeholder="e.g. Healthcare, E-commerce"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <ImageUploadField label="Cover image" value={coverImage} onChange={setCoverImage} />

      <div>
        <label htmlFor="gallery">Gallery image or video URLs (one per line, optional)</label>
        <GalleryUploadField
          value={gallery}
          onUpload={(items) => {
            setGallery((current) => {
              const currentUrls = current.map((item) => item.url);
              const merged = [...current, ...items.filter((item) => !currentUrls.includes(item.url))];
              return merged;
            });
          }}
          onRemove={(url) => {
            void removeGalleryImage(url);
          }}
          onReorder={(items) => {
            setGallery(items);
          }}
          onChangeSize={(url, size) => {
            setGallery((current) =>
              current.map((item) => (item.url === url ? { ...item, size } : item))
            );
          }}
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="problem">Client / Problem (optional)</label>
        <textarea id="problem" value={problem} onChange={(e) => setProblem(e.target.value)} />
      </div>

      <div>
        <label htmlFor="solution">Solution (optional)</label>
        <textarea id="solution" value={solution} onChange={(e) => setSolution(e.target.value)} />
      </div>

      <div>
        <label htmlFor="techStack">Tech stack (comma-separated)</label>
        <input
          id="techStack"
          type="text"
          placeholder="Next.js, MongoDB, Express"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="liveUrl">Live URL (optional)</label>
        <input
          id="liveUrl"
          type="url"
          value={liveUrl}
          onChange={(e) => setLiveUrl(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="githubUrl">GitHub URL (optional)</label>
        <input
          id="githubUrl"
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="order">Display order (lower = first)</label>
        <input
          id="order"
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
        />
      </div>

      <div className="admin-checkbox-row">
        <input
          id="featured"
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        <label htmlFor="featured" style={{ margin: 0, textTransform: "none", letterSpacing: 0 }}>
          Featured (shown on homepage)
        </label>
      </div>

      {error && <p style={{ color: "#c0392b", fontSize: "13px" }}>{error}</p>}

      <button type="submit" className="button button-dark" disabled={saving}>
        {saving ? "Saving..." : isEdit ? "Save changes" : "Create project"}
      </button>
    </form>
  );
}

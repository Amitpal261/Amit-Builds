"use client";

import { useState } from "react";

export type GallerySize = "small" | "wide" | "tall" | "full";

export type GalleryItem = {
  url: string;
  size: GallerySize;
};

type Props = {
  value?: GalleryItem[];
  onUpload: (items: GalleryItem[]) => void;
  onRemove?: (url: string) => void;
  onReorder?: (items: GalleryItem[]) => void;
  onChangeSize?: (url: string, size: GallerySize) => void;
};

export default function GalleryUploadField({ value = [], onUpload, onRemove, onReorder, onChangeSize }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || "Upload failed.");
    return body.url as string;
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    setUploading(true);
    setError("");

    try {
      const urls = await Promise.all(Array.from(files).map(uploadFile));
      onUpload(urls.map((url) => ({ url, size: "small" })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function moveItem(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || !value.length) return;

    const next = [...value];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onReorder?.(next);
  }

  function renderPreview(url: string) {
    const isVideo = /\.(mp4|webm|mov|ogg|m4v)(\?|$)/i.test(url);

    return isVideo ? (
      <video
        key={url}
        src={url}
        controls
        style={{ width: "100%", height: "auto", objectFit: "contain", borderRadius: "8px", display: "block" }}
      />
    ) : (
      <img
        key={url}
        src={url}
        alt="Gallery preview"
        style={{ width: "100%", height: "auto", objectFit: "contain", borderRadius: "8px", display: "block" }}
      />
    );
  }

  return (
    <div style={{ marginBottom: "12px" }}>
      <label
        htmlFor="gallery-upload"
        style={{
          display: "block",
          marginBottom: "8px",
          color: "#777",
          fontSize: "12px"
        }}
      >
        Upload gallery images or videos
      </label>
      <input
        id="gallery-upload"
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.currentTarget.value = "";
        }}
        disabled={uploading}
      />

      {value.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "10px",
            marginTop: "12px",
            marginBottom: "8px"
          }}
        >
          {value.map((item, index) => (
            <div
              key={`${item.url}-${index}`}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedIndex !== null && draggedIndex !== index) {
                  moveItem(draggedIndex, index);
                }
                setDraggedIndex(null);
              }}
              style={{
                position: "relative",
                cursor: "grab",
                border: "1px solid #eaeaea",
                borderRadius: "8px",
                padding: "4px",
                background: "#fff",
                gridColumn: item.size === "full" ? "1 / -1" : item.size === "wide" ? "span 2" : "span 1",
                gridRow: item.size === "tall" ? "span 2" : "span 1",
                width: "100%",
                alignSelf: "start"
              }}
            >
              {renderPreview(item.url)}
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  left: "8px",
                  background: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  borderRadius: "999px",
                  padding: "2px 6px",
                  fontSize: "10px",
                  fontWeight: 700
                }}
              >
                {index + 1}
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  left: "8px",
                  display: "flex",
                  gap: "4px",
                  flexWrap: "wrap"
                }}
              >
                {([
                  { value: "small", label: "small" },
                  { value: "wide", label: "wide" },
                  { value: "tall", label: "tall" },
                  { value: "full", label: "full" }
                ] as const).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onChangeSize?.(item.url, value)}
                    style={{
                      padding: "4px 6px",
                      fontSize: "9px",
                      border: item.size === value ? "1px solid #111" : "1px solid rgba(17,17,17,0.25)",
                      background: item.size === value ? "#111" : "rgba(255,255,255,0.8)",
                      color: item.size === value ? "#fff" : "#111",
                      borderRadius: "999px",
                      cursor: "pointer",
                      textTransform: "capitalize"
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(item.url)}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    background: "rgba(0,0,0,0.7)",
                    color: "white",
                    border: "none",
                    borderRadius: "999px",
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                  aria-label="Remove image"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {uploading && <p style={{ fontSize: "12px", color: "#777" }}>Uploading...</p>}
      {error && <p style={{ fontSize: "12px", color: "#c0392b" }}>{error}</p>}
    </div>
  );
}

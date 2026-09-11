"use client";

import { useState } from "react";

type Props = {
  value?: string[];
  onUpload: (urls: string[]) => void;
  onRemove?: (url: string) => void;
  onReorder?: (urls: string[]) => void;
};

export default function GalleryUploadField({ value = [], onUpload, onRemove, onReorder }: Props) {
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
      onUpload(urls);
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
        style={{ width: "120px", height: "90px", objectFit: "cover", borderRadius: "8px" }}
      />
    ) : (
      <img
        key={url}
        src={url}
        alt="Gallery preview"
        style={{ width: "120px", height: "90px", objectFit: "cover", borderRadius: "8px" }}
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
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "12px",
            marginBottom: "8px"
          }}
        >
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
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
                background: "#fff"
              }}
            >
              {renderPreview(url)}
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
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(url)}
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

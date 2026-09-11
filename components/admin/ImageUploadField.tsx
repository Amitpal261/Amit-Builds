"use client";

import { useState } from "react";

export default function ImageUploadField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Upload failed.");
      onChange(body.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!value) return;

    setUploading(true);
    setError("");

    try {
      const res = await fetch(`/api/upload?url=${encodeURIComponent(value)}`, { method: "DELETE" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Delete failed.");
      onChange("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        style={{
          fontSize: "12px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: ".08em",
          color: "#999",
          marginBottom: "8px",
          display: "block"
        }}
      >
        {label}
      </label>

      {value && (
        <div style={{ marginBottom: "10px" }}>
          <img
            src={value}
            alt="Preview"
            style={{
              width: "100%",
              maxWidth: "320px",
              aspectRatio: "1.5 / 1",
              objectFit: "cover",
              borderRadius: "4px",
              border: "1px solid #e9e9e7",
              display: "block"
            }}
          />
          <button
            type="button"
            onClick={() => {
              void handleDelete();
            }}
            style={{
              marginTop: "8px",
              background: "transparent",
              border: "1px solid #d9d9d9",
              color: "#333",
              padding: "6px 10px",
              cursor: "pointer"
            }}
          >
            Remove image
          </button>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
        disabled={uploading}
      />

      <input
        type="text"
        placeholder="...or paste an image URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ marginTop: "8px" }}
      />

      {uploading && <p style={{ fontSize: "12px", color: "#777" }}>Uploading...</p>}
      {error && <p style={{ fontSize: "12px", color: "#c0392b" }}>{error}</p>}
    </div>
  );
}

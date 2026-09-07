"use client";

import { useState } from "react";

type Props = {
  onUpload: (urls: string[]) => void;
};

export default function GalleryUploadField({ onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

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
      {uploading && <p style={{ fontSize: "12px", color: "#777" }}>Uploading...</p>}
      {error && <p style={{ fontSize: "12px", color: "#c0392b" }}>{error}</p>}
    </div>
  );
}

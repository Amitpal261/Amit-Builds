"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ITestimonial } from "@/models/Testimonial";

type Props = {
  initial?: Partial<ITestimonial>;
  testimonialId?: string;
};

export default function TestimonialForm({ initial, testimonialId }: Props) {
  const router = useRouter();
  const isEdit = Boolean(testimonialId);

  const [name, setName] = useState(initial?.name || "");
  const [role, setRole] = useState(initial?.role || "");
  const [company, setCompany] = useState(initial?.company || "");
  const [message, setMessage] = useState(initial?.message || "");
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [featured, setFeatured] = useState(initial?.featured || false);
  const [order, setOrder] = useState(initial?.order ?? 0);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name,
      role,
      company,
      message,
      rating: Number(rating),
      featured,
      order: Number(order)
    };

    try {
      const res = await fetch(
        isEdit ? `/api/testimonials/${testimonialId}` : "/api/testimonials",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error?.formErrors?.[0] || body.error || "Failed to save testimonial.");
      }

      router.push("/admin/testimonials");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save testimonial.");
      setSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Client name</label>
        <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <label htmlFor="role">Role</label>
        <input id="role" type="text" placeholder="Founder" value={role} onChange={(e) => setRole(e.target.value)} />
      </div>

      <div>
        <label htmlFor="company">Company (optional)</label>
        <input id="company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} />
      </div>

      <div>
        <label htmlFor="message">Testimonial</label>
        <textarea id="message" required value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      <div>
        <label htmlFor="rating">Rating (1–5)</label>
        <input
          id="rating"
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
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
          Show on homepage
        </label>
      </div>

      {error && <p style={{ color: "#c0392b", fontSize: "13px" }}>{error}</p>}

      <button type="submit" className="button button-dark" disabled={saving}>
        {saving ? "Saving..." : isEdit ? "Save changes" : "Create testimonial"}
      </button>
    </form>
  );
}

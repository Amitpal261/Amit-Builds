"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ITestimonial } from "@/models/Testimonial";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/testimonials");
    setTestimonials(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete testimonial from "${name}"? This can't be undone.`)) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <>
      <div className="admin-header">
        <h1>Testimonials</h1>
        <Link href="/admin/testimonials/new" className="button button-dark">
          + New Testimonial
        </Link>
      </div>

      <div className="admin-card">
        {loading ? (
          <p style={{ color: "#999" }}>Loading...</p>
        ) : testimonials.length === 0 ? (
          <p style={{ color: "#999", fontSize: "14px" }}>
            No testimonials yet. Click &quot;New Testimonial&quot; to add your first one.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Rating</th>
                <th>Featured</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t._id}>
                  <td>{t.name}</td>
                  <td>
                    {t.role}
                    {t.company ? ` · ${t.company}` : ""}
                  </td>
                  <td>{"★".repeat(t.rating)}</td>
                  <td>
                    <span className={`admin-badge${t.featured ? " on" : ""}`}>
                      {t.featured ? "On homepage" : "Hidden"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Link href={`/admin/testimonials/${t._id}`}>Edit</Link>
                      <button
                        className="danger"
                        onClick={() => handleDelete(t._id as string, t.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

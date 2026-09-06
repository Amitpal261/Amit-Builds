"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IProject } from "@/models/Project";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <>
      <div className="admin-header">
        <h1>Projects</h1>
        <Link href="/admin/projects/new" className="button button-dark">
          + New Project
        </Link>
      </div>

      <div className="admin-card">
        {loading ? (
          <p style={{ color: "#999" }}>Loading...</p>
        ) : projects.length === 0 ? (
          <p style={{ color: "#999", fontSize: "14px" }}>
            No projects yet. Click &quot;New Project&quot; to add your first one.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Featured</th>
                <th>Order</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id}>
                  <td>{project.title}</td>
                  <td>{project.category}</td>
                  <td>
                    <span className={`admin-badge${project.featured ? " on" : ""}`}>
                      {project.featured ? "Featured" : "Hidden"}
                    </span>
                  </td>
                  <td>{project.order}</td>
                  <td>
                    <div className="admin-actions">
                      <Link href={`/admin/projects/${project._id}`}>Edit</Link>
                      <button
                        className="danger"
                        onClick={() => handleDelete(project._id as string, project.title)}
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

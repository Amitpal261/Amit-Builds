"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { IProject } from "@/models/Project";

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/projects/${params.id}`);
      if (!res.ok) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setProject(await res.json());
      setLoading(false);
    })();
  }, [params.id]);

  return (
    <>
      <div className="admin-header">
        <h1>Edit Project</h1>
      </div>
      <div className="admin-card">
        {loading && <p style={{ color: "#999" }}>Loading...</p>}
        {notFound && <p style={{ color: "#c0392b" }}>Project not found.</p>}
        {project && <ProjectForm initial={project} projectId={params.id} />}
      </div>
    </>
  );
}

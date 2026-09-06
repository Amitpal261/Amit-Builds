import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <div className="admin-header">
        <h1>New Project</h1>
      </div>
      <div className="admin-card">
        <ProjectForm />
      </div>
    </>
  );
}

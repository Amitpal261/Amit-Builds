import ServiceForm from "@/components/admin/ServiceForm";

export default function NewServicePage() {
  return (
    <>
      <div className="admin-header">
        <h1>New Service</h1>
      </div>
      <div className="admin-card">
        <ServiceForm />
      </div>
    </>
  );
}

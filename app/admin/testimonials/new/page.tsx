import TestimonialForm from "@/components/admin/TestimonialForm";

export default function NewTestimonialPage() {
  return (
    <>
      <div className="admin-header">
        <h1>New Testimonial</h1>
      </div>
      <div className="admin-card">
        <TestimonialForm />
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { ITestimonial } from "@/models/Testimonial";

export default function EditTestimonialPage() {
  const params = useParams<{ id: string }>();
  const [testimonial, setTestimonial] = useState<ITestimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/testimonials/${params.id}`);
      if (!res.ok) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setTestimonial(await res.json());
      setLoading(false);
    })();
  }, [params.id]);

  return (
    <>
      <div className="admin-header">
        <h1>Edit Testimonial</h1>
      </div>
      <div className="admin-card">
        {loading && <p style={{ color: "#999" }}>Loading...</p>}
        {notFound && <p style={{ color: "#c0392b" }}>Testimonial not found.</p>}
        {testimonial && <TestimonialForm initial={testimonial} testimonialId={params.id} />}
      </div>
    </>
  );
}

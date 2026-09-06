"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ServiceForm from "@/components/admin/ServiceForm";
import { IService } from "@/models/Service";

export default function EditServicePage() {
  const params = useParams<{ id: string }>();
  const [service, setService] = useState<IService | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/services/${params.id}`);
      if (!res.ok) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setService(await res.json());
      setLoading(false);
    })();
  }, [params.id]);

  return (
    <>
      <div className="admin-header">
        <h1>Edit Service</h1>
      </div>
      <div className="admin-card">
        {loading && <p style={{ color: "#999" }}>Loading...</p>}
        {notFound && <p style={{ color: "#c0392b" }}>Service not found.</p>}
        {service && <ServiceForm initial={service} serviceId={params.id} />}
      </div>
    </>
  );
}

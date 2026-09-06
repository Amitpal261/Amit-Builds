"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IService } from "@/models/Service";

export default function AdminServicesPage() {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/services");
    setServices(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <>
      <div className="admin-header">
        <h1>Services</h1>
        <Link href="/admin/services/new" className="button button-dark">
          + New Service
        </Link>
      </div>

      <div className="admin-card">
        {loading ? (
          <p style={{ color: "#999" }}>Loading...</p>
        ) : services.length === 0 ? (
          <p style={{ color: "#999", fontSize: "14px" }}>
            No services yet. Click &quot;New Service&quot; to add your first one.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Starting Price</th>
                <th>Delivery</th>
                <th>Featured</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td>{service.title}</td>
                  <td>{service.startingPrice}</td>
                  <td>{service.deliveryTime}</td>
                  <td>
                    <span className={`admin-badge${service.featured ? " on" : ""}`}>
                      {service.featured ? "Popular" : "Standard"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Link href={`/admin/services/${service._id}`}>Edit</Link>
                      <button
                        className="danger"
                        onClick={() => handleDelete(service._id as string, service.title)}
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

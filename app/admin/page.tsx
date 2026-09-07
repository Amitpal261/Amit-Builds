import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Service from "@/models/Service";
import Testimonial from "@/models/Testimonial";
import Lead from "@/models/Lead";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await connectDB();

  const [projectCount, serviceCount, testimonialCount, newLeads] = await Promise.all([
    Project.countDocuments(),
    Service.countDocuments(),
    Testimonial.countDocuments(),
    Lead.countDocuments({ status: "new" })
  ]);

  const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(5).lean();

  return (
    <>
      <div className="admin-header">
        <h1>Dashboard</h1>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat-number">{projectCount}</div>
          <div className="admin-stat-label">Projects</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-number">{serviceCount}</div>
          <div className="admin-stat-label">Services</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-number">{testimonialCount}</div>
          <div className="admin-stat-label">Testimonials</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-header" style={{ marginBottom: "16px" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.6rem" }}>
            Recent leads {newLeads > 0 && <span className="admin-badge on">{newLeads} new</span>}
          </h2>
        </div>

        {recentLeads.length === 0 ? (
          <p style={{ color: "#999", fontSize: "14px" }}>
            No contact form submissions yet. They&apos;ll show up here.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Budget</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={String(lead._id)}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.budget || "—"}</td>
                  <td style={{ maxWidth: "320px" }}>{lead.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-card">
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", marginBottom: "16px" }}>
          Quick links
        </h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/admin/projects/new" className="button button-dark">
            + New Project
          </Link>
          <Link href="/admin/services/new" className="button button-light">
            + New Service
          </Link>
          <Link href="/admin/testimonials/new" className="button button-light">
            + New Testimonial
          </Link>
        </div>
      </div>
    </>
  );
}

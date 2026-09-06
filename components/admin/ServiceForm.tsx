"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IService } from "@/models/Service";

type Props = {
  initial?: Partial<IService>;
  serviceId?: string;
};

export default function ServiceForm({ initial, serviceId }: Props) {
  const router = useRouter();
  const isEdit = Boolean(serviceId);

  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [startingPrice, setStartingPrice] = useState(initial?.startingPrice || "");
  const [deliveryTime, setDeliveryTime] = useState(initial?.deliveryTime || "");
  const [features, setFeatures] = useState((initial?.features || []).join("\n"));
  const [icon, setIcon] = useState(initial?.icon || "✦");
  const [featured, setFeatured] = useState(initial?.featured || false);
  const [order, setOrder] = useState(initial?.order ?? 0);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      description,
      startingPrice,
      deliveryTime,
      features: features
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      icon,
      featured,
      order: Number(order)
    };

    try {
      const res = await fetch(isEdit ? `/api/services/${serviceId}` : "/api/services", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error?.formErrors?.[0] || body.error || "Failed to save service.");
      }

      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save service.");
      setSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="startingPrice">Starting price</label>
        <input
          id="startingPrice"
          type="text"
          required
          placeholder="₹5,000"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="deliveryTime">Delivery time</label>
        <input
          id="deliveryTime"
          type="text"
          required
          placeholder="5–7 days"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="features">Features (one per line)</label>
        <textarea
          id="features"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder={"Responsive design\nSEO basics\nWhatsApp integration"}
        />
      </div>

      <div>
        <label htmlFor="icon">Icon (emoji or symbol)</label>
        <input id="icon" type="text" value={icon} onChange={(e) => setIcon(e.target.value)} />
      </div>

      <div>
        <label htmlFor="order">Display order (lower = first)</label>
        <input
          id="order"
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
        />
      </div>

      <div className="admin-checkbox-row">
        <input
          id="featured"
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        <label htmlFor="featured" style={{ margin: 0, textTransform: "none", letterSpacing: 0 }}>
          Mark as &quot;Most popular&quot;
        </label>
      </div>

      {error && <p style={{ color: "#c0392b", fontSize: "13px" }}>{error}</p>}

      <button type="submit" className="button button-dark" disabled={saving}>
        {saving ? "Saving..." : isEdit ? "Save changes" : "Create service"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      budget: (form.elements.namedItem("budget") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="detail-block">
        <h3>Thanks — got it! 🎉</h3>
        <p>I&apos;ll get back to you within a day with a quote and timeline.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required placeholder="Your name" />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required placeholder="you@company.com" />
      </div>

      <div>
        <label htmlFor="phone">Phone (optional)</label>
        <input id="phone" name="phone" placeholder="+91 ..." />
      </div>

      <div>
        <label htmlFor="budget">Budget</label>
        <select id="budget" name="budget" defaultValue="">
          <option value="" disabled>
            Select a range
          </option>
          <option value="under-10k">Under ₹10,000</option>
          <option value="10k-25k">₹10,000 – ₹25,000</option>
          <option value="25k-50k">₹25,000 – ₹50,000</option>
          <option value="50k-plus">₹50,000+</option>
        </select>
      </div>

      <div>
        <label htmlFor="message">Tell me about your project</label>
        <textarea
          id="message"
          name="message"
          required
          placeholder="What are you building, and when do you need it?"
        />
      </div>

      {status === "error" && (
        <p style={{ color: "#c0392b", fontSize: "13px" }}>{errorMsg}</p>
      )}

      <button type="submit" className="button button-dark" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send message ↗"}
      </button>
    </form>
  );
}

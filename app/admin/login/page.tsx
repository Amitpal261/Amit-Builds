"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const body = await res.json();

      if (!res.ok) {
        setError(body.error || "Login failed.");
        setLoading(false);
        return;
      }

      const redirectTo = params.get("from") || "/admin";
      window.location.href = redirectTo;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <h1>Admin Login</h1>
        <p className="sub">Sign in to manage your portfolio content.</p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@amit.dev"
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p style={{ color: "#c0392b", fontSize: "13px" }}>{error}</p>}

          <button type="submit" className="button button-dark" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "12px", textAlign: "center" }}>
            Demo credentials: <strong>admin@amit.dev</strong> / <strong>admin123</strong>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

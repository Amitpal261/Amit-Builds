"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log non-circular error message
    console.error("[Application Error]:", error?.message || error);
  }, [error]);

  return (
    <div
      id="app-error-boundary"
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        background: "var(--bg, #fbfbf9)",
        color: "var(--ink, #111111)"
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          width: "100%",
          textAlign: "center"
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: "var(--muted, #666)",
            marginBottom: "12px"
          }}
        >
          Something went wrong
        </div>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 400,
            lineHeight: 1.15,
            fontFamily: "var(--font-serif), Georgia, serif",
            marginBottom: "16px"
          }}
        >
          An unexpected issue occurred.
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "var(--muted, #666)",
            lineHeight: 1.6,
            marginBottom: "32px"
          }}
        >
          We&apos;ve restored the previous application state. You can try reloading this view or return to the homepage.
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap"
          }}
        >
          <button
            type="button"
            className="button button-dark"
            onClick={() => reset()}
          >
            Try again ↻
          </button>
          <Link href="/" className="button button-light">
            Back home ↗
          </Link>
        </div>
      </div>
    </div>
  );
}

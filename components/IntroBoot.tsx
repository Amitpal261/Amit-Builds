"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "amit-portfolio-intro-seen";

export default function IntroBoot() {
  const [mounted, setMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window === "undefined") {
      return;
    }

    const hasSeenIntro = sessionStorage.getItem(STORAGE_KEY) === "true";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hasSeenIntro || prefersReducedMotion) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      return;
    }

    setShowIntro(true);

    const exitTimer = window.setTimeout(() => {
      setExiting(true);
    }, 1500);

    const endTimer = window.setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem(STORAGE_KEY, "true");
    }, 2200);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(endTimer);
    };
  }, []);

  if (!mounted || !showIntro) {
    return null;
  }

  return (
    <div
      className="intro-screen"
      style={{
        transition: "opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "translateY(-20px) scale(0.99)" : "translateY(0) scale(1)",
        pointerEvents: "none"
      }}
    >
      <div className="intro-shell">
        <div className="intro-glow" aria-hidden="true" />

        <div className="intro-word-wrap" aria-label="Amit Builds">
          <span
            className="intro-word intro-word-shadow"
            style={{
              transition: "all 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
              opacity: 0.18,
              transform: "translateY(0) scale(1)"
            }}
          >
            AMIT BUILDS
          </span>

          <span
            className="intro-word intro-word-reveal"
            style={{
              transition: "all 0.95s cubic-bezier(0.22, 1, 0.36, 1)",
              opacity: 1,
              transform: "translateY(0)"
            }}
          >
            AMIT BUILDS
          </span>

          <span className="intro-word-sweep" />
        </div>

        <div
          className="intro-subtitle"
          style={{
            transition: "all 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.25s",
            opacity: 1,
            transform: "translateY(0)"
          }}
        >
          DIGITAL EXPERIENCES
        </div>
      </div>
    </div>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const STORAGE_KEY = "amit-portfolio-intro-seen";

export default function IntroBoot() {
  const reduceMotion = useReducedMotion();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const hasSeenIntro = sessionStorage.getItem(STORAGE_KEY) === "true";
    const prefersReducedMotion =
      reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hasSeenIntro || prefersReducedMotion) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      return;
    }

    setShowIntro(true);

    const timeout = window.setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem(STORAGE_KEY, "true");
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          className="intro-screen"
          initial={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)", y: 0, scale: 1 }}
          exit={{
            opacity: [1, 1, 0],
            clipPath: [
              "inset(0% 0% 0% 0%)",
              "inset(0% 0% 0% 0%)",
              "inset(0% 0% 100% 0%)"
            ],
            y: [0, 0, -22],
            scale: [1, 1, 0.985]
          }}
          transition={{
            duration: reduceMotion ? 0.2 : 1.8,
            times: [0, 0.72, 1],
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <div className="intro-shell">
            <div className="intro-glow" aria-hidden="true" />

            <div className="intro-word-wrap" aria-label="Amit Builds">
              <motion.span
                className="intro-word intro-word-shadow"
                initial={{ opacity: 0, filter: "blur(14px)", scale: 1.1, y: 24 }}
                animate={{
                  opacity: [0, 0.18, 0.18],
                  filter: ["blur(14px)", "blur(2px)", "blur(0px)"],
                  scale: [1.1, 1.03, 1],
                  y: [24, 6, 0]
                }}
                transition={{
                  duration: reduceMotion ? 0.2 : 0.9,
                  delay: reduceMotion ? 0 : 0.12,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                AMIT BUILDS
              </motion.span>

              <motion.span
                className="intro-word intro-word-reveal"
                initial={{ opacity: 0, filter: "blur(14px)", y: 18, clipPath: "inset(0 100% 0 0 round 10px)" }}
                animate={{
                  opacity: [0, 1, 1],
                  filter: ["blur(14px)", "blur(1px)", "blur(0px)"],
                  y: [18, 6, 0],
                  clipPath: [
                    "inset(0 100% 0 0 round 10px)",
                    "inset(0 0% 0 0 round 10px)",
                    "inset(0 0% 0 0 round 10px)"
                  ]
                }}
                transition={{
                  duration: reduceMotion ? 0.2 : 0.95,
                  delay: reduceMotion ? 0 : 0.12,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                AMIT BUILDS
              </motion.span>

              <motion.span
                className="intro-word-sweep"
                initial={{ opacity: 0, x: "-26%" }}
                animate={{
                  opacity: [0, 0.16, 0.16, 0],
                  x: ["-26%", "0%", "26%", "52%"]
                }}
                transition={{
                  duration: reduceMotion ? 0.2 : 0.9,
                  delay: reduceMotion ? 0 : 0.28,
                  ease: [0.22, 1, 0.36, 1]
                }}
              />
            </div>

            <motion.div
              className="intro-subtitle"
              initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: reduceMotion ? 0.2 : 0.75,
                delay: reduceMotion ? 0 : 0.25,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              DIGITAL EXPERIENCES
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

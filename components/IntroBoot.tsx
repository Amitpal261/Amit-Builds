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
          initial={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)", y: 0 }}
          animate={{
            opacity: [1, 1, 0],
            clipPath: [
              "inset(0% 0% 0% 0%)",
              "inset(0% 0% 0% 0%)",
              "inset(0% 0% 100% 0%)"
            ],
            y: [0, 0, -18]
          }}
          transition={{
            duration: reduceMotion ? 0.2 : 1.85,
            times: [0, 0.74, 1],
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <div className="intro-shell">
            <div className="intro-meta" aria-label="portfolio identity metadata">
              <span>AMIT BUILDS</span>
              <span>DIGITAL EXPERIENCES</span>
              <span>SYSTEM / 001</span>
            </div>

            <motion.div
              className="intro-grid"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: [0, 0.9, 0.35], scale: [1.06, 1, 1] }}
              transition={{
                duration: reduceMotion ? 0.2 : 0.9,
                delay: 0.08,
                times: [0, 0.6, 1],
                ease: [0.22, 1, 0.36, 1]
              }}
            />

            <div className="intro-word-wrap" aria-label="Amit Builds">
              <motion.span
                className="intro-word intro-word-shadow"
                initial={{ opacity: 0, y: 18, clipPath: "inset(0 100% 0 0)" }}
                animate={{
                  opacity: [0, 0.18, 0.18],
                  y: [18, 0, 0],
                  clipPath: [
                    "inset(0 100% 0 0)",
                    "inset(0 0% 0 0)",
                    "inset(0 0% 0 0)"
                  ]
                }}
                transition={{
                  duration: reduceMotion ? 0.2 : 0.72,
                  delay: 0.35,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                AMIT BUILDS
              </motion.span>

              <motion.span
                className="intro-word intro-word-reveal"
                initial={{ opacity: 0, y: 18, clipPath: "inset(0 100% 0 0)" }}
                animate={{
                  opacity: [0, 1, 1],
                  y: [18, 0, 0],
                  clipPath: [
                    "inset(0 100% 0 0)",
                    "inset(0 0% 0 0)",
                    "inset(0 0% 0 0)"
                  ]
                }}
                transition={{
                  duration: reduceMotion ? 0.2 : 0.72,
                  delay: 0.35,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                AMIT BUILDS
              </motion.span>
            </div>

            <motion.div
              className="intro-route"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{
                opacity: [0, 1, 1],
                scaleX: [0, 1, 1]
              }}
              transition={{
                duration: reduceMotion ? 0.2 : 0.8,
                delay: 0.6,
                ease: [0.22, 1, 0.36, 1]
              }}
            />

            <motion.div
              className="intro-node"
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [0, 220, 270, 280],
                y: [0, 0, -8, 0]
              }}
              transition={{
                duration: reduceMotion ? 0.2 : 0.75,
                delay: 0.72,
                ease: [0.22, 1, 0.36, 1]
              }}
            />

            <motion.span
              className="intro-shipped"
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: [0, 1, 1],
                y: [8, 0, 0]
              }}
              transition={{
                duration: reduceMotion ? 0.2 : 0.32,
                delay: 1.12,
                ease: "easeOut"
              }}
            >
              SHIPPED
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

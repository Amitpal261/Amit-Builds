"use client";

import { useEffect } from "react";

export default function ScrollNavClass() {
  useEffect(() => {
    const update = () => {
      if (window.scrollY > 120) {
        document.body.classList.add("scrolled");
      } else {
        document.body.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", update);
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return null;
}

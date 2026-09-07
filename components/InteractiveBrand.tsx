"use client";

import { useEffect, useRef } from "react";

const BRAND_NAME = "AMIT BUILDS";
const BRAND_QUOTE = "We don't just build websites. We build experiences.";
const DOT_SIZE = 0.8;
const DOT_SPACING = 10.5;
const INTERACTION_RADIUS = 135;
const DISPLACEMENT_STRENGTH = 30;
const RETURN_SPEED = 0.085;
const POINTER_SMOOTHING = 0.16;
const MAX_DEVICE_PIXEL_RATIO = 2;

interface Dot {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  brandWeight: number;
}

export default function InteractiveBrand() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const textCanvas = document.createElement("canvas");
    const textContext = textCanvas.getContext("2d");
    if (!textContext) return;

    let dots: Dot[] = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let pointer = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.floor(width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const columns = Math.ceil(width / DOT_SPACING) + 1;
      const rows = Math.ceil(height / DOT_SPACING) + 1;
      const offsetX = (width - (columns - 1) * DOT_SPACING) / 2;
      const offsetY = (height - (rows - 1) * DOT_SPACING) / 2;
      const titleSize = Math.max(26, Math.min(54, width * 0.16));

      const sourceWidth = Math.ceil(width);
      const sourceHeight = Math.ceil(height);
      if (sourceWidth < 1 || sourceHeight < 1) return;

      textCanvas.width = sourceWidth;
      textCanvas.height = sourceHeight;
      textContext.clearRect(0, 0, width, height);
      textContext.fillStyle = "#111";
      textContext.font = `700 ${titleSize}px Arial, sans-serif`;
      textContext.textAlign = "center";
      textContext.textBaseline = "middle";
      textContext.fillText(BRAND_NAME, width / 2, height * 0.45);
      const textPixels = textContext.getImageData(0, 0, sourceWidth, sourceHeight).data;

      dots = [];
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = offsetX + column * DOT_SPACING;
          const y = offsetY + row * DOT_SPACING;
          const pixelX = Math.min(sourceWidth - 1, Math.max(0, Math.floor(x)));
          const pixelY = Math.min(sourceHeight - 1, Math.max(0, Math.floor(y)));
          const alpha = textPixels[(pixelY * sourceWidth + pixelX) * 4 + 3] / 255;
          dots.push({ x, y, offsetX: 0, offsetY: 0, brandWeight: alpha });
        }
      }
    };

    const setPointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.targetX = event.clientX - bounds.left;
      pointer.targetY = event.clientY - bounds.top;
      pointer.active = true;
    };

    const clearPointer = () => {
      pointer.active = false;
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      pointer.x += (pointer.targetX - pointer.x) * POINTER_SMOOTHING;
      pointer.y += (pointer.targetY - pointer.y) * POINTER_SMOOTHING;

      dots.forEach((dot) => {
        const distanceX = dot.x - pointer.x;
        const distanceY = dot.y - pointer.y;
        const distance = Math.hypot(distanceX, distanceY);
        const interactive = pointer.active && !reducedMotion.matches && distance < INTERACTION_RADIUS;

        if (interactive && distance > 0) {
          const falloff = 1 - distance / INTERACTION_RADIUS;
          const ripple = Math.sin(distance * 0.09 - time * 0.004) * 0.2 + 0.8;
          const force = falloff * falloff * DISPLACEMENT_STRENGTH * ripple;
          dot.offsetX += ((distanceX / distance) * force - dot.offsetX) * 0.2;
          dot.offsetY += ((distanceY / distance) * force - dot.offsetY) * 0.2;
        } else {
          dot.offsetX += (0 - dot.offsetX) * RETURN_SPEED;
          dot.offsetY += (0 - dot.offsetY) * RETURN_SPEED;
        }

        const currentDistance = Math.hypot(dot.x + dot.offsetX - pointer.x, dot.y + dot.offsetY - pointer.y);
        const glow = pointer.active && currentDistance < INTERACTION_RADIUS
          ? 1 - currentDistance / INTERACTION_RADIUS
          : 0;
        const radius = DOT_SIZE + dot.brandWeight * 0.46 + glow * 0.36;
        const opacity = 0.08 + dot.brandWeight * 0.34 + glow * 0.28;

        context.beginPath();
        context.arc(dot.x + dot.offsetX, dot.y + dot.offsetY, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(17, 17, 17, ${opacity})`;
        context.fill();
      });

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", setPointer);
    canvas.addEventListener("pointerleave", clearPointer);
    canvas.addEventListener("pointercancel", clearPointer);
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", setPointer);
      canvas.removeEventListener("pointerleave", clearPointer);
      canvas.removeEventListener("pointercancel", clearPointer);
    };
  }, []);

  return (
    <div className="interactive-brand" aria-label={`${BRAND_NAME}. ${BRAND_QUOTE}`}>
      <canvas ref={canvasRef} className="interactive-brand-canvas" aria-hidden="true" />
      <p className="interactive-brand-quote">{BRAND_QUOTE}</p>
    </div>
  );
}

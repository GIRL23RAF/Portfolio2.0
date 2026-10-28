import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const DOT_SPACING = 24;
const DOT_RADIUS = 1.5;
const AMBIENT_ALPHA = 0.08;
const GLOW_ALPHA = 0.35;
const GLOW_RADIUS_PX = 280;

const dots = (alpha: number) =>
  [
    `radial-gradient(circle, rgba(255, 255, 255, ${alpha}) ${DOT_RADIUS}px, transparent ${DOT_RADIUS}px)`,
    `radial-gradient(circle, rgba(255, 255, 255, ${alpha}) ${DOT_RADIUS}px, transparent ${DOT_RADIUS}px)`,
  ].join(", ");

const GRID_STYLE = {
  backgroundSize: `${DOT_SPACING}px ${DOT_SPACING}px`,
  backgroundPosition: `0 0, ${DOT_SPACING / 2}px ${DOT_SPACING / 2}px`,
};

const GLOW_MASK = `radial-gradient(circle ${GLOW_RADIUS_PX}px at var(--mouse-x, -9999px) var(--mouse-y, -9999px), black 0%, transparent 80%)`;

/**
 * Figma 2238:175039 — staggered 24px dot grid on #1b1b1b, with a cursor proximity glow.
 * Tracks the pointer on the parent element; mask position is written straight to CSS vars.
 */
export function DesignFileDotGrid({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const glow = glowRef.current;
    const target = root?.parentElement;
    if (!root || !glow || !target) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const flush = () => {
      frame = 0;
      root.style.setProperty("--mouse-x", `${x}px`);
      root.style.setProperty("--mouse-y", `${y}px`);
    };
    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      glow.style.opacity = "1";
      if (!frame) frame = requestAnimationFrame(flush);
    };
    const onLeave = () => {
      glow.style.opacity = "0";
    };

    target.addEventListener("pointermove", onMove, { passive: true });
    target.addEventListener("pointerleave", onLeave);
    return () => {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 bg-[#1b1b1b]", className)}
    >
      <div className="absolute inset-0" style={{ ...GRID_STYLE, backgroundImage: dots(AMBIENT_ALPHA) }} />
      <div
        ref={glowRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          ...GRID_STYLE,
          backgroundImage: dots(GLOW_ALPHA),
          maskImage: GLOW_MASK,
          WebkitMaskImage: GLOW_MASK,
        }}
      />
    </div>
  );
}

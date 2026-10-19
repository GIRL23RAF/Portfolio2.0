import { cn } from "@/lib/utils";

/** Figma Rfaea Frame 48 (1991:75621) — 3px dots on a 19px square grid. */
export function DesignFileDotGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 bg-[#121515]", className)}
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(163, 170, 180, 0.45) 1.5px, transparent 1.5px)",
        backgroundSize: "19px 19px",
        backgroundPosition: "0 0",
      }}
    />
  );
}

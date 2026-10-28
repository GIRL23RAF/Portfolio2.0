import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Moon, Sun } from "lucide-react";

const TOGGLE_EASE = [0.22, 1, 0.36, 1] as const;

/** Sun / moon switch above the device — live araguiar.design control. */
export function CrcleThemeToggle({
  light,
  onToggle,
  disabled = false,
  className = "",
}: {
  light: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      disabled={disabled}
      onClick={onToggle}
      className={`relative z-30 mb-2 flex h-8 w-[52px] shrink-0 items-center rounded-full border border-zinc-200/80 bg-white/75 p-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] backdrop-blur-sm disabled:pointer-events-none disabled:opacity-40 ${className}`}
    >
      <motion.span
        aria-hidden
        className="absolute inset-y-0.5 w-[calc(50%-2px)] rounded-full bg-zinc-100 shadow-sm"
        initial={false}
        animate={{ left: light ? 2 : "calc(50% + 0px)" }}
        transition={{ duration: 0.22, ease: TOGGLE_EASE }}
      />
      <span
        className={`relative z-[1] flex flex-1 items-center justify-center transition-colors duration-300 ${
          light ? "text-zinc-800" : "text-zinc-400"
        }`}
      >
        <Sun className="size-3.5" strokeWidth={2} aria-hidden />
      </span>
      <span
        className={`relative z-[1] flex flex-1 items-center justify-center transition-colors duration-300 ${
          light ? "text-zinc-400" : "text-zinc-800"
        }`}
      >
        <Moon className="size-3.5" strokeWidth={2} fill="currentColor" aria-hidden />
      </span>
    </motion.button>
  );
}

/**
 * Figma CRCLE artboard 257:62672 — 402×874 display.
 */
export function CrclePhoneFrame({
  children,
  overlay,
  light = false,
  className = "",
}: {
  children: ReactNode;
  /** Full-device overlays (modals/scrims) — sits above the screen, covers the wireframe. */
  overlay?: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative ml-auto h-[874px] w-[402px] shrink-0 overflow-hidden rounded-[58px] ${className}`}
      style={{ clipPath: "inset(0 round 58px)" }}
      data-device="iphone-crcle-402x874"
    >
      {/* Hardware buttons — flush to rim (clipped by rounded frame) */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-[126px] z-20 h-[29px] w-[3px] rounded-r-[2px] bg-gradient-to-b from-[#6b6b70] via-[#3d3d42] to-[#2a2a2e]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-[176px] z-20 h-[56px] w-[3px] rounded-r-[2px] bg-gradient-to-b from-[#6b6b70] via-[#3d3d42] to-[#2a2a2e]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-[241px] z-20 h-[56px] w-[3px] rounded-r-[2px] bg-gradient-to-b from-[#6b6b70] via-[#3d3d42] to-[#2a2a2e]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-[207px] z-20 h-[90px] w-[3px] rounded-l-[2px] bg-gradient-to-b from-[#6b6b70] via-[#3d3d42] to-[#2a2a2e]"
      />

      {/* Titanium outer rim */}
      <div
        className="relative h-full w-full shrink-0 rounded-[58px] p-[2px] shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
        style={{
          background:
            "linear-gradient(160deg, #8a8a90 0%, #4a4a50 22%, #1c1c20 55%, #5a5a60 78%, #3a3a40 100%)",
        }}
      >
        {/* Slim black bezel — wireframe fills the display */}
        <div
          className={`crcle-phone relative h-full w-full overflow-hidden rounded-[56px] bg-black p-[3px] ${
            light ? "crcle-phone--light" : ""
          }`}
        >
          {/* Dynamic Island — above full-wireframe overlays */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[12px] z-[70] flex h-[33px] w-[113px] -translate-x-1/2 items-center justify-end rounded-full bg-black px-2.5"
          >
            <span className="relative size-[10px] rounded-full bg-[#0c0c14] ring-1 ring-white/10">
              <span className="absolute left-1/2 top-1/2 size-[3.5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a2744]" />
            </span>
          </div>

          {/* Screen — clips all overlays (modals, blur) to the device curve */}
          <div
            className="relative flex h-full w-full flex-col overflow-hidden rounded-[53px] bg-[#020617] transition-colors duration-300 [.crcle-phone--light_&]:bg-[var(--crcle-bg)]"
            style={{ clipPath: "inset(0 round 53px)" }}
          >
            {children}

            {/* Home indicator */}
            <div
              aria-hidden
              className={`pointer-events-none absolute bottom-[7px] left-1/2 z-50 h-[4px] w-[133px] -translate-x-1/2 rounded-full ${
                light ? "bg-black/30" : "bg-white/35"
              }`}
            />
          </div>

          {/* Full-wireframe overlays (above screen + bezel); inert until a modal mounts */}
          {overlay ? (
            <div
              className="pointer-events-none absolute inset-0 z-[60] overflow-hidden rounded-[56px]"
              style={{ clipPath: "inset(0 round 56px)" }}
            >
              {overlay}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

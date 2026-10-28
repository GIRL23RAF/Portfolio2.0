import { forwardRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import arrowLeft from "@/assets/firstDesign/preview/arrow-left.svg";
import arrowRight from "@/assets/firstDesign/preview/arrow-right.svg";
import bracket from "@/assets/firstDesign/preview/bracket.svg";
import closeIcon from "@/assets/firstDesign/preview/close.svg";
import devToggleOn from "@/assets/firstDesign/preview/dev-toggle-on.svg";
import toggleKnob from "@/assets/firstDesign/preview/toggle-knob.svg";
import { cn } from "@/lib/utils";

type InspectorModalHeaderProps = {
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  isDevModeActive: boolean;
  onToggleDevMode: () => void;
  frameLabel: string;
  frameIndex: number;
  frameCount: number;
  className?: string;
};

const SPRING = { type: "spring" as const, stiffness: 90, damping: 10, mass: 0.65 };
const HEADER_H = 40;
type HeaderSlot = "toggle" | "close";

function slotScale(hovered: HeaderSlot | null, id: HeaderSlot) {
  if (hovered === id) return 1.16;
  if (hovered === null) return 1;
  return 1.05;
}

/** Figma 2220:174984 — floating pills on the canvas, not a full-bleed bar. */
export const InspectorModalHeader = forwardRef<HTMLElement, InspectorModalHeaderProps>(
  function InspectorModalHeader(
    {
      onPrev,
      onNext,
      onClose,
      isDevModeActive,
      onToggleDevMode,
      frameLabel,
      frameIndex,
      frameCount,
      className,
    },
    ref,
  ) {
    const [hovered, setHovered] = useState<HeaderSlot | null>(null);

    return (
      <header
        ref={ref}
        onMouseLeave={() => setHovered(null)}
        className={cn("relative flex h-10 w-full shrink-0 items-center", className)}
      >
        <div className="relative z-[1] flex h-7 items-center gap-1 rounded-xl bg-white/70 px-1.5 py-0.5 shadow-inner backdrop-blur-md dark:bg-white/20">
          <button type="button" onClick={onPrev} className="flex size-6 items-center justify-center" aria-label="Previous frame">
            <img alt="" src={arrowLeft} className="size-6" />
          </button>
          <button type="button" onClick={onNext} className="flex size-6 items-center justify-center" aria-label="Next frame">
            <img alt="" src={arrowRight} className="size-6" />
          </button>
          <span className="sr-only">
            Frame {frameIndex + 1} of {frameCount}: {frameLabel}
          </span>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
          <HeaderBounceSlot
            id="toggle"
            hovered={hovered}
            onHover={setHovered}
            baseWidth={71}
            baseHeight={37}
          >
            <motion.button
              type="button"
              onClick={onToggleDevMode}
              animate={{ scale: slotScale(hovered, "toggle") }}
              transition={SPRING}
              whileTap={{ scale: slotScale(hovered, "toggle") * 0.9 }}
              className={cn(
                "pointer-events-auto relative flex h-[37px] w-[71px] items-center gap-2.5 overflow-hidden rounded-full",
                isDevModeActive
                  ? "bg-white/70 shadow-inner backdrop-blur-md dark:bg-white/20"
                  : "justify-end border border-white/40 bg-white/30 px-1 py-0.5 backdrop-blur-xl dark:border-white/10 dark:bg-black/40",
              )}
              aria-pressed={isDevModeActive}
              aria-label={isDevModeActive ? "Inspector on — switch to preview" : "Preview — switch to inspector"}
            >
              {isDevModeActive ? (
                <img alt="" src={devToggleOn} className="block h-[37px] w-[71px]" data-node-id="2244:195187" />
              ) : (
                <>
                  <img alt="" src={bracket} className="ml-0.5" />
                  <img alt="" src={toggleKnob} />
                </>
              )}
            </motion.button>
          </HeaderBounceSlot>
        </div>

        <HeaderBounceSlot
          id="close"
          hovered={hovered}
          onHover={setHovered}
          baseWidth={40}
          baseHeight={32}
          className="relative z-[1] ml-auto origin-right"
        >
          <motion.button
            type="button"
            onClick={onClose}
            animate={{ scale: slotScale(hovered, "close") }}
            transition={SPRING}
            whileTap={{ scale: slotScale(hovered, "close") * 0.9 }}
            className="flex h-8 w-10 items-center justify-center rounded-xl bg-white/70 px-2 py-1 shadow-inner backdrop-blur-md dark:bg-white/20"
            aria-label="Close preview"
          >
            <img alt="" src={closeIcon} className="size-6" />
          </motion.button>
        </HeaderBounceSlot>
      </header>
    );
  },
);

function HeaderBounceSlot({
  id,
  hovered,
  onHover,
  baseWidth,
  baseHeight,
  className,
  children,
}: {
  id: HeaderSlot;
  hovered: HeaderSlot | null;
  onHover: (id: HeaderSlot | null) => void;
  baseWidth: number;
  baseHeight: number;
  className?: string;
  children: ReactNode;
}) {
  const scale = slotScale(hovered, id);
  const width = Math.ceil(baseWidth * scale);
  const height = Math.min(HEADER_H, Math.ceil(baseHeight * scale));

  return (
    <motion.div
      layout
      onMouseEnter={() => onHover(id)}
      animate={{ width, height }}
      transition={SPRING}
      className={cn("relative flex shrink-0 items-center justify-center", className)}
    >
      {children}
    </motion.div>
  );
}

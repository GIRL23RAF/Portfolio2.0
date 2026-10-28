import type { RefObject } from "react";
import { cn } from "@/lib/utils";
import type { InspectorFrameId } from "./inspectorTypes";
import {
  PRODUCTIVE_ONBOARDING_ASPECT,
  PRODUCTIVE_ONBOARDING_FIGMA_W,
  PRODUCTIVE_ONBOARDING_RADIUS,
} from "./ProductiveOnboardingScreen";
import { ProductiveFrameScreen } from "./ProductiveScreens";

/** Figma 2238:194780 artboard (302.9965 × 656.878), rendered at 390px wide on the canvas. */
export const UNFRAMED_ARTBOARD_W = 390;
export const UNFRAMED_ARTBOARD_H = UNFRAMED_ARTBOARD_W / PRODUCTIVE_ONBOARDING_ASPECT;
const UNFRAMED_RADIUS = PRODUCTIVE_ONBOARDING_RADIUS * (UNFRAMED_ARTBOARD_W / PRODUCTIVE_ONBOARDING_FIGMA_W);

type ProductiveUnframedArtboardProps = {
  frameId: InspectorFrameId;
  className?: string;
  devMode?: boolean;
  highlightHotspotId?: string | null;
  artboardRef?: RefObject<HTMLDivElement | null>;
  onSelect?: () => void;
  onHotspotHover?: (id: string | null) => void;
  ariaLabel?: string;
};

export function ProductiveUnframedArtboard({
  frameId,
  className,
  devMode,
  highlightHotspotId,
  artboardRef,
  onSelect,
  onHotspotHover,
  ariaLabel,
}: ProductiveUnframedArtboardProps) {
  return (
    <div
      ref={artboardRef}
      data-productive-unframed-artboard
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-label={ariaLabel}
      onClick={onSelect}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect();
              }
            }
          : undefined
      }
      className={cn(
        "relative shrink-0 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400",
        frameId === "onboarding" ? "bg-[#1b0616]" : "border border-white bg-black",
        onSelect && "cursor-pointer",
        className,
      )}
      style={{ width: UNFRAMED_ARTBOARD_W, height: UNFRAMED_ARTBOARD_H, borderRadius: UNFRAMED_RADIUS }}
    >
      <ProductiveFrameScreen
        frameId={frameId}
        devMode={devMode}
        highlightHotspotId={highlightHotspotId}
        onHotspotHover={onHotspotHover}
        standalone
      />
    </div>
  );
}

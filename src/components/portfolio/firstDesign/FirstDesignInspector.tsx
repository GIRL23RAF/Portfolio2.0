import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CrclePhoneFrame } from "@/components/portfolio/CrclePhoneFrame";
import type { InspectorFrameId } from "./inspectorTypes";
import { ProductiveWireframePhone } from "./ProductiveWireframePhone";
import { cn } from "@/lib/utils";
import { DesignSystemInspectorModal } from "./DesignSystemInspectorModal";
import { InspectorTetheredSpecs } from "./InspectorTetheredSpecs";
import {
  DEFAULT_ZOOM,
  DESIGN_FILE_MAX_W,
  ProductiveDesignFileFrame,
} from "./ProductiveDesignFileFrame";
import { INSPECTOR_FRAMES } from "./inspectorTypes";
import { ProductiveFrameScreen } from "./ProductiveScreens";
import { ProductiveUnframedArtboard, UNFRAMED_ARTBOARD_W } from "./ProductiveUnframedArtboard";

const HORIZONTAL_ORDER = [0, 1, 2, 3] as const;
const DRAWER_TO_ARTBOARD_GAP = 40;
/** Matches the `gap-12` on the canvas strip in ProductiveDesignFileFrame. */
const CANVAS_STRIP_GAP = 48;
/** Left drawer: 24px inset + phone scaled to the 874px viewport (~360px). */
const INSPECTOR_DRAWER_RIGHT_PX = 384;
const INSPECTOR_ARTBOARD_ZOOM = 0.85;

/**
 * Bending Spoons / Productive — Figma 2238:175039 file mockup:
 * dotted canvas, left pinned phone preview, center unframed artboards, right spec column.
 */
export function FirstDesignInspector() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFrameIndex, setModalFrameIndex] = useState(0);
  const [isDevModeActive, setIsDevModeActive] = useState(false);
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);

  const [inspectorCamX, setInspectorCamX] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const previewPhoneRef = useRef<HTMLDivElement>(null);

  const frame = INSPECTOR_FRAMES[modalFrameIndex];
  const annotations = frame.annotations ?? [];

  const openModal = (frameIndex: number) => {
    const viewportW = Math.min(wrapperRef.current?.clientWidth ?? 1200, DESIGN_FILE_MAX_W);
    const z = INSPECTOR_ARTBOARD_ZOOM;
    const stripW =
      HORIZONTAL_ORDER.length * UNFRAMED_ARTBOARD_W + (HORIZONTAL_ORDER.length - 1) * CANVAS_STRIP_GAP;
    // The strip is centred on the camera; shift it so the opened frame sits just right of the drawer.
    const selectedLeftInStrip = frameIndex * (UNFRAMED_ARTBOARD_W + CANVAS_STRIP_GAP);
    const targetLeft = INSPECTOR_DRAWER_RIGHT_PX + DRAWER_TO_ARTBOARD_GAP;
    setInspectorCamX(Math.round(targetLeft - viewportW / 2 + (stripW / 2 - selectedLeftInStrip) * z));
    setModalFrameIndex(frameIndex);
    setModalOpen(true);
  };

  const selectFrame = (frameIndex: number) => {
    setActiveAnnotationId(null);
    setModalFrameIndex(frameIndex);
  };

  return (
    <div ref={wrapperRef} className="flex w-full justify-center">
      {modalOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              aria-hidden
              className={cn(
                "pointer-events-none fixed inset-0 z-40 h-screen w-screen transition-all duration-300",
                isDevModeActive ? "bg-zinc-900/20 backdrop-blur-md" : "bg-transparent backdrop-blur-none",
              )}
            />,
            document.body,
          )
        : null}
      <ProductiveDesignFileFrame
        key={modalOpen ? `inspector-open-${inspectorCamX}` : "inspector-closed"}
        initialCamera={
          modalOpen
            ? { x: inspectorCamX, y: 0, z: INSPECTOR_ARTBOARD_ZOOM }
            : { x: 0, y: 0, z: DEFAULT_ZOOM }
        }
        overlayAboveDocument={modalOpen}
        immersive={modalOpen && isDevModeActive}
        overlay={
          <>
            <DesignSystemInspectorModal
              open={modalOpen}
              initialFrameIndex={modalFrameIndex}
              phoneRef={previewPhoneRef}
              highlightHotspotId={activeAnnotationId}
              onHotspotHover={setActiveAnnotationId}
              isDevModeActive={isDevModeActive}
              onToggleDevMode={() => setIsDevModeActive((v) => !v)}
              onClose={() => {
                setModalOpen(false);
                setActiveAnnotationId(null);
              }}
              onFrameIndexChange={setModalFrameIndex}
            />
            {modalOpen && isDevModeActive ? (
              <InspectorTetheredSpecs
                annotations={annotations}
                artboardRef={previewPhoneRef}
                activeId={activeAnnotationId}
                onActiveChange={setActiveAnnotationId}
              />
            ) : null}
          </>
        }
      >
        {modalOpen ? (
          HORIZONTAL_ORDER.map((frameIndex) => {
            const f = INSPECTOR_FRAMES[frameIndex];
            const selected = frameIndex === modalFrameIndex;
            return (
              <ProductiveUnframedArtboard
                key={f.id}
                frameId={f.id}
                onSelect={selected ? undefined : () => selectFrame(frameIndex)}
                ariaLabel={selected ? undefined : `Inspect ${f.label}`}
                className={cn(!selected && frameIndex > 1 && "opacity-70")}
              />
            );
          })
        ) : (
          HORIZONTAL_ORDER.map((frameIndex) => {
            const f = INSPECTOR_FRAMES[frameIndex];
            const isHero = f.kind === "hero";
            return (
              <WireframePhone
                key={f.id}
                frameId={f.id}
                interactive={isHero}
                onClick={isHero ? () => openModal(frameIndex) : undefined}
                ariaLabel={
                  isHero
                    ? "Open onboarding frame in design system inspector"
                    : `${f.label} — coming soon`
                }
                dimmed={!isHero && frameIndex > 1}
              >
                <ProductiveFrameScreen frameId={f.id} />
              </WireframePhone>
            );
          })
        )}
      </ProductiveDesignFileFrame>
    </div>
  );
}

function WireframePhone({
  frameId,
  children,
  interactive,
  onClick,
  ariaLabel,
  dimmed,
}: {
  frameId: InspectorFrameId;
  children: React.ReactNode;
  interactive?: boolean;
  onClick?: () => void;
  ariaLabel: string;
  dimmed?: boolean;
}) {
  const shellClassName = interactive ? "transition-transform group-hover:scale-[1.01]" : undefined;
  const phone = (
    <div
      className={cn(
        "shrink-0 transition-opacity",
        dimmed && "opacity-70",
        interactive && "group",
      )}
    >
      {frameId === "onboarding" ? (
        <CrclePhoneFrame className={shellClassName}>{children}</CrclePhoneFrame>
      ) : (
        <ProductiveWireframePhone className={shellClassName}>{children}</ProductiveWireframePhone>
      )}
    </div>
  );

  if (interactive && onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="shrink-0 cursor-pointer rounded-[58px] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1b]"
        aria-label={ariaLabel}
      >
        {phone}
      </button>
    );
  }

  return (
    <div className="shrink-0" aria-label={ariaLabel}>
      {phone}
    </div>
  );
}

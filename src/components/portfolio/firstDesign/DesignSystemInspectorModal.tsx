import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { CrclePhoneFrame } from "@/components/portfolio/CrclePhoneFrame";
import { ProductiveWireframePhone } from "./ProductiveWireframePhone";
import { InspectorModalHeader } from "./InspectorModalHeader";
import { INSPECTOR_FRAMES } from "./inspectorTypes";
import { ProductiveFrameScreen } from "./ProductiveScreens";

type DesignSystemInspectorModalProps = {
  open: boolean;
  initialFrameIndex?: number;
  onClose: () => void;
  isDevModeActive: boolean;
  onToggleDevMode: () => void;
  onFrameIndexChange: (index: number) => void;
  /** Phone shell the dev-mode spec tethers attach to. */
  phoneRef?: RefObject<HTMLDivElement | null>;
  highlightHotspotId?: string | null;
  onHotspotHover?: (id: string | null) => void;
};

const PHONE_W = 402;
const PHONE_H = 874;
/** Figma 2238:195139 — drawer inset from file mockup edge. */
const CANVAS_INSET_PX = 24;
const COLUMN_GAP_PX = 12;
const MAX_COLUMN_W = 407;

/**
 * Left-pinned preview (Figma 2238:195139 / 2220:174982).
 */
export function DesignSystemInspectorModal({
  open,
  initialFrameIndex = 0,
  onClose,
  isDevModeActive,
  onToggleDevMode,
  onFrameIndexChange,
  phoneRef,
  highlightHotspotId,
  onHotspotHover,
}: DesignSystemInspectorModalProps) {
  const [frameIndex, setFrameIndex] = useState(initialFrameIndex);
  const [phoneScale, setPhoneScale] = useState(0.72);

  const asideRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const frame = INSPECTOR_FRAMES[frameIndex];

  useEffect(() => {
    if (open) setFrameIndex(initialFrameIndex);
  }, [open, initialFrameIndex]);

  const setFrame = useCallback(
    (index: number) => {
      setFrameIndex(index);
      onFrameIndexChange(index);
    },
    [onFrameIndexChange],
  );

  const measurePhoneScale = useCallback(() => {
    const aside = asideRef.current;
    const header = headerRef.current;
    const viewport = aside?.closest("[data-productive-design-viewport]") as HTMLElement | null;
    if (!aside || !header || !viewport) return;

    const inset = CANVAS_INSET_PX * 2;
    const maxColW = Math.min(MAX_COLUMN_W, viewport.clientWidth - inset);
    const columnH = aside.clientHeight;
    const availH = columnH - header.offsetHeight - COLUMN_GAP_PX;
    const byHeight = availH / PHONE_H;
    const byWidth = maxColW / PHONE_W;
    const next = Math.min(byHeight, byWidth, 1);
    setPhoneScale(Math.max(0.48, next));
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    measurePhoneScale();
    const aside = asideRef.current;
    if (!aside) return;

    const viewport = aside.closest("[data-productive-design-viewport]") as HTMLElement | null;
    const ro = new ResizeObserver(() => measurePhoneScale());
    ro.observe(aside);
    if (viewport) ro.observe(viewport);
    return () => ro.disconnect();
  }, [open, frameIndex, measurePhoneScale]);

  const goPrev = useCallback(() => {
    setFrame((frameIndex - 1 + INSPECTOR_FRAMES.length) % INSPECTOR_FRAMES.length);
  }, [frameIndex, setFrame]);

  const goNext = useCallback(() => {
    setFrame((frameIndex + 1) % INSPECTOR_FRAMES.length);
  }, [frameIndex, setFrame]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, goPrev, goNext]);

  const phoneW = PHONE_W * phoneScale;
  const phoneH = PHONE_H * phoneScale;

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          ref={asideRef}
          key="device-drawer"
          role="dialog"
          aria-label="Device preview"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto absolute z-50 flex flex-col overflow-hidden"
          style={{
            top: CANVAS_INSET_PX,
            bottom: CANVAS_INSET_PX,
            left: CANVAS_INSET_PX,
            width: phoneW,
            maxWidth: `calc(100% - ${CANVAS_INSET_PX * 2}px)`,
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="flex h-full min-h-0 w-full flex-1 flex-col items-stretch gap-3">
            <InspectorModalHeader
              ref={headerRef}
              className="mt-[3px] w-full shrink-0"
              frameIndex={frameIndex}
              frameCount={INSPECTOR_FRAMES.length}
              frameLabel={frame.label}
              isDevModeActive={isDevModeActive}
              onToggleDevMode={onToggleDevMode}
              onPrev={goPrev}
              onNext={goNext}
              onClose={onClose}
            />

            <div
              className="relative w-full min-h-0 flex-1 drop-shadow-[32px_32px_32px_rgba(16,24,40,0.2),16px_16px_16px_rgba(16,24,40,0.08)]"
              style={{ minHeight: phoneH }}
            >
              <div
                ref={phoneRef}
                className="origin-top-left"
                style={{
                  width: PHONE_W,
                  height: PHONE_H,
                  transform: `scale(${phoneScale})`,
                }}
              >
                {frame.id === "onboarding" ? (
                  <CrclePhoneFrame>
                    <ProductiveFrameScreen
                      frameId={frame.id}
                      devMode={isDevModeActive && frame.kind === "hero"}
                      highlightHotspotId={isDevModeActive ? highlightHotspotId : null}
                      onHotspotHover={onHotspotHover}
                    />
                  </CrclePhoneFrame>
                ) : (
                  <ProductiveWireframePhone>
                    <ProductiveFrameScreen frameId={frame.id} standalone={false} />
                  </ProductiveWireframePhone>
                )}
              </div>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

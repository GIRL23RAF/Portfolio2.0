import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CrclePhoneFrame } from "@/components/portfolio/CrclePhoneFrame";
import { AnnotationLayer } from "./AnnotationLayer";
import { InspectorModalHeader } from "./InspectorModalHeader";
import { INSPECTOR_FRAMES } from "./inspectorTypes";
import { ProductiveFrameScreen } from "./ProductiveScreens";

type DesignSystemInspectorModalProps = {
  open: boolean;
  initialFrameIndex?: number;
  onClose: () => void;
};

export function DesignSystemInspectorModal({
  open,
  initialFrameIndex = 0,
  onClose,
}: DesignSystemInspectorModalProps) {
  const [frameIndex, setFrameIndex] = useState(initialFrameIndex);
  const [isDevModeActive, setIsDevModeActive] = useState(false);
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);
  const deviceRef = useRef<HTMLDivElement>(null);

  const frame = INSPECTOR_FRAMES[frameIndex];
  const annotations = frame.annotations ?? [];

  useEffect(() => {
    if (open) setFrameIndex(initialFrameIndex);
  }, [open, initialFrameIndex]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!isDevModeActive) setActiveAnnotationId(null);
  }, [isDevModeActive]);

  const goPrev = useCallback(() => {
    setFrameIndex((i) => (i - 1 + INSPECTOR_FRAMES.length) % INSPECTOR_FRAMES.length);
  }, []);

  const goNext = useCallback(() => {
    setFrameIndex((i) => (i + 1) % INSPECTOR_FRAMES.length);
  }, []);

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

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="inspector-modal"
          className="fixed inset-0 z-[200] flex flex-col bg-[#0b0f14]/95 p-4 sm:p-6 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal
          aria-label="Design system inspector"
        >
          <InspectorModalHeader
            frameIndex={frameIndex}
            frameCount={INSPECTOR_FRAMES.length}
            frameLabel={frame.label}
            isDevModeActive={isDevModeActive}
            onToggleDevMode={() => setIsDevModeActive((v) => !v)}
            onPrev={goPrev}
            onNext={goNext}
            onClose={onClose}
          />

          <div className="relative mx-auto mt-4 flex min-h-0 w-full max-w-[1400px] flex-1 items-center justify-center gap-6">
            {isDevModeActive && frame.kind === "hero" ? (
              <aside
                className="hidden h-[min(72vh,720px)] w-[min(28%,420px)] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-[#121515] shadow-2xl lg:block"
                aria-label="Design file preview"
              >
                <div className="border-b border-white/10 px-4 py-3 text-xs font-medium text-white/50">
                  Rfaea · Onboarding frame
                </div>
                <div
                  className="h-full bg-[length:12px_12px] bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] p-6"
                >
                  <div className="mx-auto max-w-[240px] rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-center text-[11px] leading-relaxed text-white/35">
                    Linked Figma artboard — swap in embed or export when the file is wired to production.
                  </div>
                </div>
              </aside>
            ) : null}

            <div className="relative flex min-h-0 flex-1 items-center justify-center">
              <div ref={deviceRef} className="relative z-10">
                <CrclePhoneFrame className="shadow-[0_32px_96px_rgba(0,0,0,0.55)]">
                  <ProductiveFrameScreen
                    frameId={frame.id}
                    devMode={isDevModeActive && frame.kind === "hero"}
                    highlightHotspotId={activeAnnotationId}
                  />
                </CrclePhoneFrame>
              </div>

              {isDevModeActive && annotations.length > 0 ? (
                <AnnotationLayer
                  annotations={annotations}
                  deviceRef={deviceRef}
                  activeId={activeAnnotationId}
                  onActiveChange={setActiveAnnotationId}
                />
              ) : null}
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-white/35">
            {frame.label}
            {frame.kind === "coming-soon" ? " · prototype slot" : ""}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

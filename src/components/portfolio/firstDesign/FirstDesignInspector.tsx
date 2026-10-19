import { useState } from "react";
import { CrclePhoneFrame } from "@/components/portfolio/CrclePhoneFrame";
import { cn } from "@/lib/utils";
import { DesignSystemInspectorModal } from "./DesignSystemInspectorModal";
import { ProductiveDesignFileFrame } from "./ProductiveDesignFileFrame";
import { INSPECTOR_FRAMES } from "./inspectorTypes";
import { ProductiveFrameScreen } from "./ProductiveScreens";

const HORIZONTAL_ORDER = [0, 1, 2, 3] as const;

/**
 * Bending Spoons / Productive — horizontal design-file strip (Figma 1991:75620) + inspector modal.
 */
export function FirstDesignInspector() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFrameIndex, setModalFrameIndex] = useState(0);

  const openModal = (frameIndex: number) => {
    setModalFrameIndex(frameIndex);
    setModalOpen(true);
  };

  return (
    <>
      <ProductiveDesignFileFrame>
        {HORIZONTAL_ORDER.map((frameIndex) => {
          const frame = INSPECTOR_FRAMES[frameIndex];
          const isHero = frame.kind === "hero";
          return (
            <WireframePhone
              key={frame.id}
              interactive={isHero}
              onClick={isHero ? () => openModal(frameIndex) : undefined}
              ariaLabel={
                isHero
                  ? "Open onboarding frame in design system inspector"
                  : `${frame.label} — coming soon`
              }
              dimmed={!isHero && frameIndex > 1}
            >
              <ProductiveFrameScreen frameId={frame.id} />
            </WireframePhone>
          );
        })}
      </ProductiveDesignFileFrame>

      <DesignSystemInspectorModal
        open={modalOpen}
        initialFrameIndex={modalFrameIndex}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

function WireframePhone({
  children,
  interactive,
  onClick,
  ariaLabel,
  dimmed,
}: {
  children: React.ReactNode;
  interactive?: boolean;
  onClick?: () => void;
  ariaLabel: string;
  dimmed?: boolean;
}) {
  const phone = (
    <div
      className={cn(
        "shrink-0 transition-opacity",
        dimmed && "opacity-70",
        interactive && "group",
      )}
    >
      <CrclePhoneFrame className={interactive ? "transition-transform group-hover:scale-[1.01]" : undefined}>
        {children}
      </CrclePhoneFrame>
    </div>
  );

  if (interactive && onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="shrink-0 cursor-pointer rounded-[58px] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121515]"
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

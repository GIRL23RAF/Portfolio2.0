import type { InspectorFrameId } from "./inspectorTypes";
import { ProductiveComingSoonWireframe2317 } from "./ProductiveComingSoonWireframe2317";
import { ProductiveOnboardingScreen } from "./ProductiveOnboardingScreen";

export { ProductiveOnboardingScreen } from "./ProductiveOnboardingScreen";

/** Placeholder slots use the same Figma wireframe until those frames ship. */
export function ProductiveComingSoonScreen({
  standalone = false,
}: {
  compact?: boolean;
  standalone?: boolean;
}) {
  return <ProductiveComingSoonWireframe2317 standalone={standalone} />;
}

export function ProductiveSessionSetupScreen({ standalone = false }: { standalone?: boolean }) {
  return <ProductiveComingSoonWireframe2317 standalone={standalone} />;
}

function ProductiveSessionActiveScreen({
  standalone = false,
}: {
  compact?: boolean;
  standalone?: boolean;
}) {
  return <ProductiveComingSoonWireframe2317 standalone={standalone} />;
}

export function ProductiveFrameScreen({
  frameId,
  compact,
  devMode,
  highlightHotspotId,
  standalone,
  onHotspotHover,
}: {
  frameId: InspectorFrameId;
  compact?: boolean;
  devMode?: boolean;
  highlightHotspotId?: string | null;
  standalone?: boolean;
  onHotspotHover?: (id: string | null) => void;
}) {
  if (frameId === "onboarding") {
    return (
      <ProductiveOnboardingScreen
        compact={compact}
        devMode={devMode}
        highlightHotspotId={highlightHotspotId}
        standalone={standalone}
        onHotspotHover={onHotspotHover}
      />
    );
  }
  return <ProductiveComingSoonWireframe2317 standalone={standalone} />;
}

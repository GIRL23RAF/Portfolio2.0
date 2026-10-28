import {
  ProductiveArtboardStage,
  ProductiveListMark,
  ProductiveWireframeFrostedPanel,
  ProductiveWireframeStatusBar,
} from "./productiveArtboardStage";

/** Figma 2317:95972 — iPhone 16 - 3 (Coming Soon wireframe). */
export function ProductiveComingSoonWireframe2317({ standalone = false }: { standalone?: boolean }) {
  return (
    <ProductiveArtboardStage bg="#000000" standalone={standalone} figmaNode="2317:95972">
      <ProductiveWireframeFrostedPanel />
      <div
        className="absolute left-[28px] top-[26px] flex w-[244px] flex-col items-center gap-[10px]"
        data-node-id="2317:95974"
      >
        <div
          className="relative flex h-[323px] w-full shrink-0 flex-col items-center justify-between"
          data-node-id="2317:95975"
        >
          <ProductiveWireframeStatusBar />
          <ProductiveListMark />
        </div>
        <p
          className="w-full text-center text-[16px] font-medium leading-[16.962px] text-[rgba(255,255,255,0.8)]"
          data-node-id="2317:96013"
        >
          Coming Soon
        </p>
      </div>
    </ProductiveArtboardStage>
  );
}

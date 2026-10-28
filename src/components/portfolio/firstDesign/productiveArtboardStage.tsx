import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import ellipse158 from "@/assets/firstDesign/onboarding-2238/ellipse-158.svg";
import ellipse159 from "@/assets/firstDesign/onboarding-2238/ellipse-159.svg";
import ellipse160 from "@/assets/firstDesign/onboarding-2238/ellipse-160.svg";
import statusBar from "@/assets/firstDesign/onboarding-2238/status-bar.svg";
import {
  PRODUCTIVE_ONBOARDING_FIGMA_H,
  PRODUCTIVE_ONBOARDING_FIGMA_W,
  PRODUCTIVE_ONBOARDING_RADIUS,
} from "./ProductiveOnboardingScreen";

export const PRODUCTIVE_ARTBOARD_W = PRODUCTIVE_ONBOARDING_FIGMA_W;
export const PRODUCTIVE_ARTBOARD_H = PRODUCTIVE_ONBOARDING_FIGMA_H;
export const PRODUCTIVE_ARTBOARD_RADIUS = PRODUCTIVE_ONBOARDING_RADIUS;
export const PRODUCTIVE_WIREFRAME_FONT =
  '"M PLUS Rounded 1c", "Nunito", ui-rounded, system-ui, sans-serif';

function useArtboardScale() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ scale: 1, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      if (width === 0 || height === 0) return;
      const scale = Math.max(width / PRODUCTIVE_ARTBOARD_W, height / PRODUCTIVE_ARTBOARD_H);
      setLayout({
        scale,
        offsetX: (width - PRODUCTIVE_ARTBOARD_W * scale) / 2,
        offsetY: (height - PRODUCTIVE_ARTBOARD_H * scale) / 2,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { stageRef, ...layout };
}

const STANDALONE_RIM: CSSProperties = {
  background:
    "linear-gradient(160deg, rgba(255,255,255,0.9), rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.7))",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
};

export function ProductiveArtboardStage({
  bg,
  standalone = false,
  figmaNode,
  className,
  children,
}: {
  bg: string;
  standalone?: boolean;
  figmaNode?: string;
  className?: string;
  children: ReactNode;
}) {
  const { stageRef, scale, offsetX, offsetY } = useArtboardScale();

  return (
    <div
      ref={stageRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{
        background: bg,
        borderRadius: standalone ? PRODUCTIVE_ARTBOARD_RADIUS * scale : undefined,
      }}
      data-figma-node={figmaNode}
    >
      <div
        className="absolute left-0 top-0 origin-top-left overflow-hidden"
        style={{
          width: PRODUCTIVE_ARTBOARD_W,
          height: PRODUCTIVE_ARTBOARD_H,
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          fontFamily: PRODUCTIVE_WIREFRAME_FONT,
          borderRadius: standalone ? PRODUCTIVE_ARTBOARD_RADIUS : undefined,
        }}
      >
        {children}
        {standalone ? (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute left-[calc(50%-0.27px)] top-[15px] h-[26.239px] w-[87.465px] -translate-x-1/2 rounded-[26.239px] bg-black"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[52px] p-px"
              style={STANDALONE_RIM}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

export function ProductiveWireframeStatusBar({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative h-[10.707px] w-full shrink-0", className)}
      data-name="status bar"
    >
      <img alt="" src={statusBar} className="absolute inset-0 block size-full max-w-none" />
    </div>
  );
}

function MarkRow({ src, bar }: { src: string; bar: string }) {
  return (
    <div className="flex w-full items-center gap-[2.313px]">
      <img alt="" src={src} className="block size-[3.084px] shrink-0" />
      <span className={cn("h-[3.084px] w-[15.42px] rounded-[27.755px]", bar)} />
    </div>
  );
}

/** Figma list mark (#0e1325 + colored bars) — 2238:194862 */
export function ProductiveListMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-[36.236px] shrink-0 flex-col items-center justify-center rounded-[6.168px] bg-[#0e1325] p-[7.71px]",
        className,
      )}
    >
      <div className="flex w-full flex-col items-start gap-[3.084px]">
        <MarkRow src={ellipse158} bar="bg-[#11c883]" />
        <MarkRow src={ellipse159} bar="bg-[#e29929]" />
        <MarkRow src={ellipse160} bar="bg-[#2295ff]" />
      </div>
    </div>
  );
}

export function ProductiveWireframeFrostedPanel() {
  return (
    <div
      aria-hidden
      className="absolute left-[calc(50%-0.39px)] top-[-14.88px] h-[686.946px] w-[362.362px] -translate-x-1/2 bg-[rgba(255,255,255,0.03)]"
    />
  );
}

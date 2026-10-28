import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import ellipse151 from "@/assets/firstDesign/onboarding-2238/ellipse-151.svg";
import ellipse152 from "@/assets/firstDesign/onboarding-2238/ellipse-152.svg";
import ellipse153 from "@/assets/firstDesign/onboarding-2238/ellipse-153.svg";
import ellipse154 from "@/assets/firstDesign/onboarding-2238/ellipse-154.svg";
import ellipse155 from "@/assets/firstDesign/onboarding-2238/ellipse-155.svg";
import ellipse158 from "@/assets/firstDesign/onboarding-2238/ellipse-158.svg";
import ellipse159 from "@/assets/firstDesign/onboarding-2238/ellipse-159.svg";
import ellipse160 from "@/assets/firstDesign/onboarding-2238/ellipse-160.svg";
import arrowRight from "@/assets/firstDesign/onboarding-2238/arrow-right.svg";
import statusBar from "@/assets/firstDesign/onboarding-2238/status-bar.svg";

/** Figma 2238:194780 — iPhone 16 - 1 */
export const PRODUCTIVE_ONBOARDING_FIGMA_W = 302.9965;
export const PRODUCTIVE_ONBOARDING_FIGMA_H = 656.878;
export const PRODUCTIVE_ONBOARDING_ASPECT =
  PRODUCTIVE_ONBOARDING_FIGMA_W / PRODUCTIVE_ONBOARDING_FIGMA_H;
export const PRODUCTIVE_ONBOARDING_RADIUS = 52;

const FONT = "Poppins, ui-sans-serif, system-ui, sans-serif";
/** Figma GLASS frost on Frame 54 (radius 47) — CSS blur sigma is half the Figma radius. */
const BACKDROP_FROST_PX = 23.5;

type ProductiveOnboardingScreenProps = {
  compact?: boolean;
  highlightHotspotId?: string | null;
  devMode?: boolean;
  /** Draws the artboard's own stroke + Dynamic Island (when not inside a device frame). */
  standalone?: boolean;
  onHotspotHover?: (id: string | null) => void;
};

const INSPECT_RING = "ring-2 ring-purple-500 bg-purple-500/10";

export function ProductiveOnboardingScreen({
  highlightHotspotId,
  devMode = false,
  standalone = false,
  onHotspotHover,
}: ProductiveOnboardingScreenProps) {
  const inspect = (id: string) =>
    devMode
      ? {
          className: cn(
            "cursor-pointer transition-all hover:bg-purple-500/10 hover:ring-2 hover:ring-purple-500",
            highlightHotspotId === id && INSPECT_RING,
          ),
          onMouseEnter: () => onHotspotHover?.(id),
          onMouseLeave: () => onHotspotHover?.(null),
        }
      : { className: undefined };
  const stageRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ scale: 1, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      // Layout size (pre-transform): the phone drawer and canvas camera both scale this element.
      const width = el.clientWidth;
      const height = el.clientHeight;
      if (width === 0 || height === 0) return;
      const scale = Math.max(width / PRODUCTIVE_ONBOARDING_FIGMA_W, height / PRODUCTIVE_ONBOARDING_FIGMA_H);
      setLayout({
        scale,
        offsetX: (width - PRODUCTIVE_ONBOARDING_FIGMA_W * scale) / 2,
        offsetY: (height - PRODUCTIVE_ONBOARDING_FIGMA_H * scale) / 2,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scale, offsetX, offsetY } = layout;

  return (
    <div
      ref={stageRef}
      className="absolute inset-0 overflow-hidden bg-[#1b0616]"
      style={standalone ? { borderRadius: PRODUCTIVE_ONBOARDING_RADIUS * scale } : undefined}
      data-figma-node="2238:194780"
    >
      <div
        className="absolute left-0 top-0 origin-top-left overflow-hidden"
        style={{
          width: PRODUCTIVE_ONBOARDING_FIGMA_W,
          height: PRODUCTIVE_ONBOARDING_FIGMA_H,
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          fontFamily: FONT,
          borderRadius: standalone ? PRODUCTIVE_ONBOARDING_RADIUS : undefined,
        }}
        data-productive-onboarding-artboard
      >
        {/* Background circles, frosted by Frame 54's glass layer */}
        <FrostedCircle src={ellipse151} left={-96.6} top={-61.91} size={353.881} nodeId="2238:194781" />
        <FrostedCircle src={ellipse152} left={-34.15} top={521.73} size={161.907} nodeId="2238:194782" />
        <FrostedCircle src={ellipse153} left={187.12} top={301.23} size={187.349} nodeId="2238:194783" />

        <div
          className="absolute left-[calc(50%-0.39px)] top-[-14.88px] h-[686.946px] w-[362.362px] -translate-x-1/2 bg-[rgba(255,255,255,0.03)]"
          data-node-id="2238:194784"
        >
          <button
            type="button"
            className={cn(
              "absolute left-[calc(50%-0.39px)] top-[584.41px] flex -translate-x-1/2 items-center gap-[9.252px] whitespace-nowrap rounded-[19.275px] border-[0.771px] border-solid border-[#e29929] bg-[#e29929] px-[18.504px] py-[6.168px]",
              inspect("primary-cta").className,
            )}
            data-inspect-id="primary-cta"
            onMouseEnter={inspect("primary-cta").onMouseEnter}
            onMouseLeave={inspect("primary-cta").onMouseLeave}
            data-node-id="2238:194785"
          >
            <span className="w-[120.273px] text-[15px] font-medium leading-[20px] text-black">
              Begin Session
            </span>
            <img alt="" src={arrowRight} className="block size-[15px] shrink-0" />
          </button>
        </div>

        <div
          aria-hidden
          className="absolute left-[197.91px] top-[79.18px] flex size-[82.495px] items-center justify-center"
          data-node-id="2238:194788"
        >
          <div className="-scale-y-100 flex-none">
            <div className="size-[82.495px] rounded-bl-[12.336px] rounded-tl-[12.336px] rounded-tr-[12.336px] bg-[rgba(217,217,217,0.2)] backdrop-blur-[6.168px]" />
          </div>
        </div>

        <GlassCircle src={ellipse154} left={-34.15} top={211.79} size={123.357} nodeId="2238:194789" />

        <div
          className={cn(
            "absolute left-[40.63px] top-[301.23px] flex w-[219.73px] flex-col items-start gap-[6.168px] text-center",
            devMode && "rounded-[4px]",
            inspect("headline").className,
          )}
          data-inspect-id="headline"
            onMouseEnter={inspect("headline").onMouseEnter}
          onMouseLeave={inspect("headline").onMouseLeave}
          data-node-id="2238:194790"
        >
          <p className="h-[52.427px] w-full text-[24.671px] font-medium leading-[24.671px] text-white">
            Tap to never look back
          </p>
          <p className="w-full text-[9.252px] font-medium leading-[16.962px] text-[rgba(255,255,255,0.8)]">
            Initiate your deep work blocks
          </p>
        </div>

        <GlassCircle src={ellipse155} left={197.91} top={452.34} size={82.495} nodeId="2238:194793" dispersion />

        <div
          className="absolute left-[calc(50%-0.5px)] top-[26px] flex h-[113px] w-[244px] -translate-x-1/2 flex-col items-center justify-between"
          data-node-id="2238:194794"
        >
          <div className="relative h-[10.707px] w-full shrink-0" data-node-id="2238:194795" data-name="status bar">
            <img alt="" src={statusBar} className="absolute inset-0 block size-full max-w-none" />
          </div>
          {standalone ? (
            <div
              className="absolute left-[calc(50%-0.27px)] top-[-11px] h-[26.239px] w-[87.465px] -translate-x-1/2 rounded-[26.239px] bg-black"
              data-node-id="2238:194820"
            />
          ) : null}
          <div
            className={cn(
              "flex size-[36.236px] shrink-0 flex-col items-center justify-center rounded-[6.168px] bg-[#0e1325] p-[7.71px]",
              inspect("app-mark").className,
            )}
            data-inspect-id="app-mark"
            onMouseEnter={inspect("app-mark").onMouseEnter}
            onMouseLeave={inspect("app-mark").onMouseLeave}
            data-node-id="2238:194821"
          >
            <div className="flex w-full flex-col items-start gap-[3.084px]">
              <MarkRow src={ellipse158} bar="bg-[#11c883]" />
              <MarkRow src={ellipse159} bar="bg-[#e29929]" />
              <MarkRow src={ellipse160} bar="bg-[#2295ff]" />
            </div>
          </div>
        </div>

        {standalone ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[52px] p-px"
            style={{
              background: "linear-gradient(160deg, rgba(255,255,255,0.9), rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.7))",
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        ) : null}

      </div>
    </div>
  );
}

function FrostedCircle({
  src,
  left,
  top,
  size,
  nodeId,
}: {
  src: string;
  left: number;
  top: number;
  size: number;
  nodeId: string;
}) {
  return (
    <div className="absolute" style={{ left, top, width: size, height: size }} data-node-id={nodeId}>
      <img
        alt=""
        src={src}
        className="absolute inset-0 block size-full max-w-none"
        style={{ filter: `blur(${BACKDROP_FROST_PX}px)` }}
      />
    </div>
  );
}

const GLASS_RIM: CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.75), rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0.6))",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
};

/** Figma GLASS effect (frost 3, light −45°) on Ellipse 154 / 155. */
function GlassCircle({
  src,
  left,
  top,
  size,
  nodeId,
  dispersion = false,
}: {
  src: string;
  left: number;
  top: number;
  size: number;
  nodeId: string;
  dispersion?: boolean;
}) {
  return (
    <div
      className="absolute overflow-hidden rounded-full backdrop-blur-[1.5px]"
      style={{ left, top, width: size, height: size }}
      data-node-id={nodeId}
    >
      <img alt="" src={src} className="absolute inset-0 block size-full max-w-none" />
      {dispersion ? (
        <div
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse 38% 16% at 58% 14%, rgba(120,140,255,0.85), rgba(120,140,255,0) 100%)",
          }}
        />
      ) : null}
      <div aria-hidden className="absolute inset-0 rounded-full p-[0.75px]" style={GLASS_RIM} />
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
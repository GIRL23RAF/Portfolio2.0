import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type PointerEvent,
  type Ref,
  type RefObject,
} from "react";
import { Eye, Image as ImageIcon, Link, Maximize, Sun, Type, Wrench } from "lucide-react";
import buttonIcon from "@/assets/firstDesign/annotations/button.svg";
import colourIcon from "@/assets/firstDesign/annotations/colour.svg";
import frameIcon from "@/assets/firstDesign/annotations/frame.svg";
import spacingIcon from "@/assets/firstDesign/annotations/spacing.svg";
import toastIcon from "@/assets/firstDesign/annotations/toast.svg";
import { cn } from "@/lib/utils";
import type { SpecAnnotation, SpecKind } from "./inspectorTypes";

type KeyEntry = {
  kind: SpecKind;
  label: string;
  bg: string;
  border: string;
  text: string;
  icon: string | ComponentType<{ className?: string; color?: string; strokeWidth?: number }>;
};

/** Figma 1992:35174 — Annotation Button variants. */
const SPEC_KEY: KeyEntry[] = [
  { kind: "image", label: "Image", bg: "#0091ff", border: "#b0ddff", text: "#ffffff", icon: ImageIcon },
  { kind: "focus", label: "Focus", bg: "#ff9500", border: "#ffdeb0", text: "#ffffff", icon: Sun },
  { kind: "link", label: "Link", bg: "#2b00ff", border: "#bdb0ff", text: "#ffffff", icon: Link },
  { kind: "font", label: "Font", bg: "#00d1c3", border: "#b0f1ec", text: "#004944", icon: Type },
  { kind: "reading", label: "Reading", bg: "#111111", border: "#8d8d8d", text: "#ffffff", icon: Eye },
  { kind: "spacing", label: "Spacing", bg: "#ff5126", border: "#ffc9bc", text: "#ffffff", icon: spacingIcon },
  { kind: "button", label: "Button", bg: "#c701d5", border: "#eeb0f2", text: "#ffffff", icon: buttonIcon },
  { kind: "padding", label: "Padding", bg: "#ff0088", border: "#ffb0da", text: "#ffffff", icon: Maximize },
  { kind: "icon", label: "Icon", bg: "#99e000", border: "#dff5b0", text: "#364e00", icon: Wrench },
  { kind: "colour", label: "Colour", bg: "#838383", border: "#f0f0f0", text: "#ffffff", icon: colourIcon },
  { kind: "toast", label: "Toast", bg: "#d57d00", border: "#ffdeb0", text: "#ffffff", icon: toastIcon },
  { kind: "frame", label: "Frame", bg: "#0356e5", border: "#b0ddff", text: "#ffffff", icon: frameIcon },
];

const KEY_BY_KIND = Object.fromEntries(SPEC_KEY.map((k) => [k.kind, k])) as Record<SpecKind, KeyEntry>;

const PANEL_INSET = 24;
/** Phone shell → key pills; the dashed tethers route through this gap. */
const PANEL_GAP_FROM_ARTBOARD = 112;
const KEY_TO_CARDS_GAP = 16;
const CARD_GAP = 16;
/** 15% smaller than the Figma 466 card so both sides of the phone can hold a cluster. */
const CARD_W = 396;
const ELBOW_OFFSET = 36;
const ELBOW_STAGGER = 10;
/** Prefer the right-hand side unless the left fits noticeably larger. */
const RIGHT_SIDE_BIAS = 0.04;
const MIN_SCALE = 0.3;

type InspectorTetheredSpecsProps = {
  annotations: SpecAnnotation[];
  artboardRef: RefObject<HTMLDivElement | null>;
  activeId: string | null;
  onActiveChange: (id: string | null) => void;
};

type Tether = { id: string; kind: SpecKind; d: string; dot: { x: number; y: number } };
type PanelSide = "left" | "right";
type CardFlow = "stack" | "row";
type ClusterLayout = {
  left: number;
  top: number;
  scale: number;
  side: PanelSide;
  flow: CardFlow;
  showKey: boolean;
  annotationIds: string[];
};

type ClusterPlan = {
  side: PanelSide;
  flow: CardFlow;
  showKey: boolean;
  annotationIds: string[];
};

function clusterBox(
  plan: ClusterPlan,
  keyW: number,
  keyH: number,
  heightById: Record<string, number>,
): { w: number; h: number } {
  const heights = plan.annotationIds.map((id) => heightById[id] ?? 0);
  const n = heights.length;
  const cardsW = n === 0 ? 0 : plan.flow === "stack" ? CARD_W : CARD_W * n + CARD_GAP * (n - 1);
  const cardsH = n === 0 ? 0 : plan.flow === "stack" ? heights.reduce((s, h) => s + h, 0) + CARD_GAP * (n - 1) : Math.max(...heights, 0);
  const w = plan.showKey ? (n ? keyW + KEY_TO_CARDS_GAP + cardsW : keyW) : cardsW;
  const h = plan.showKey ? Math.max(keyH, cardsH) : cardsH;
  return { w: Math.max(1, w), h: Math.max(1, h) };
}

function placeCluster(
  plan: ClusterPlan,
  box: { w: number; h: number },
  scale: number,
  board: DOMRect,
  stage: DOMRect,
  vh: number,
): ClusterLayout {
  const w = box.w * scale;
  const h = box.h * scale;
  const winLeft =
    plan.side === "right" ? board.right + PANEL_GAP_FROM_ARTBOARD : board.left - PANEL_GAP_FROM_ARTBOARD - w;
  const centeredTop = board.top + (board.height - h) / 2;
  const winTop = Math.min(Math.max(centeredTop, PANEL_INSET), Math.max(PANEL_INSET, vh - PANEL_INSET - h));
  return {
    ...plan,
    scale,
    left: Math.round(winLeft - stage.left),
    top: Math.round(winTop - stage.top),
  };
}

function scoreLayout(scales: number[], keyOnRight: boolean, scattered: boolean) {
  const min = Math.min(...scales);
  const full = scales.every((s) => s >= 0.999) ? 0.2 : 0;
  return min + full + (keyOnRight ? RIGHT_SIDE_BIAS : 0) + (scattered ? 0.05 : 0);
}

/**
 * Figma 1992:35567 hand-off — key column (1992:35174) tethered to the artboard with
 * orthogonal dashed lines, spec cards (1992:35214) beside it. Cards sit 15% smaller;
 * when a single side would have to scale, they scatter left and right of the phone.
 */
export function InspectorTetheredSpecs({
  annotations,
  artboardRef,
  activeId,
  onActiveChange,
}: InspectorTetheredSpecsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const keyColumnRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Partial<Record<string, HTMLElement | null>>>({});
  const pillRefs = useRef<Partial<Record<SpecKind, HTMLDivElement | null>>>({});
  const [tethers, setTethers] = useState<Tether[]>([]);
  const [clusters, setClusters] = useState<ClusterLayout[]>([
    { left: 0, top: PANEL_INSET, scale: 1, side: "right", flow: "stack", showKey: true, annotationIds: [] },
  ]);

  useEffect(() => {
    let frame = 0;
    let lastKey = "";
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const root = rootRef.current;
      const artboard = artboardRef.current;
      const keyColumn = keyColumnRef.current;
      if (!root || !artboard || !keyColumn) return;

      const stage = root.getBoundingClientRect();
      const board = artboard.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const keyW = keyColumn.offsetWidth;
      const keyH = keyColumn.offsetHeight;
      const heightById: Record<string, number> = {};
      for (const a of annotations) {
        heightById[a.id] = cardRefs.current[a.id]?.offsetHeight ?? 0;
      }
      const allIds = annotations.map((a) => a.id);
      const availH = vh - PANEL_INSET * 2;
      const availW: Record<PanelSide, number> = {
        right: vw - board.right - PANEL_GAP_FROM_ARTBOARD - PANEL_INSET,
        left: board.left - PANEL_GAP_FROM_ARTBOARD - PANEL_INSET,
      };

      const scaleFor = (plan: ClusterPlan) => {
        const box = clusterBox(plan, keyW, keyH, heightById);
        return Math.max(MIN_SCALE, Math.min(1, availW[plan.side] / box.w, availH / box.h));
      };

      type Candidate = { plans: ClusterPlan[]; scales: number[]; score: number };
      let best: Candidate | null = null;
      const consider = (plans: ClusterPlan[]) => {
        const scales = plans.map(scaleFor);
        const keyOnRight = plans.some((p) => p.showKey && p.side === "right");
        const next = { plans, scales, score: scoreLayout(scales, keyOnRight, plans.length > 1) };
        if (!best || next.score > best.score) best = next;
      };

      for (const side of ["right", "left"] as const) {
        for (const flow of ["stack", "row"] as const) {
          consider([{ side, flow, showKey: true, annotationIds: allIds }]);
        }
      }

      const leftIds = annotations.filter((a) => a.toast.side === "left").map((a) => a.id);
      const rightIds = annotations.filter((a) => a.toast.side === "right").map((a) => a.id);
      if (leftIds.length && rightIds.length) {
        for (const keySide of ["right", "left"] as const) {
          for (const leftFlow of ["stack", "row"] as const) {
            for (const rightFlow of ["stack", "row"] as const) {
              consider([
                { side: "left", flow: leftFlow, showKey: keySide === "left", annotationIds: leftIds },
                { side: "right", flow: rightFlow, showKey: keySide === "right", annotationIds: rightIds },
              ]);
            }
          }
        }
      }

      const chosen = best!;
      const nextClusters = chosen.plans.map((plan, i) =>
        placeCluster(plan, clusterBox(plan, keyW, keyH, heightById), chosen.scales[i], board, stage, vh),
      );
      const keyCluster = nextClusters.find((c) => c.showKey) ?? nextClusters[0];
      const keySide = keyCluster.side;

      const boardEdge = (keySide === "right" ? board.right : board.left) - stage.left;
      const r = (v: number) => Math.round(v * 2) / 2;
      const next: Tether[] = annotations.flatMap((a, i) => {
        const pill = pillRefs.current[a.kind];
        if (!pill) return [];
        const p = pill.getBoundingClientRect();
        const x1 = (keySide === "right" ? p.left : p.right) - stage.left;
        const y1 = p.top - stage.top + p.height / 2;
        const node = artboard.querySelector<HTMLElement>(`[data-inspect-id="${a.id}"]`)?.getBoundingClientRect();
        const hx = node
          ? (keySide === "right" ? node.right : node.left) - stage.left
          : board.left - stage.left + (board.width * a.hotspot.x) / 100;
        const hy = node
          ? node.top - stage.top + node.height / 2
          : board.top - stage.top + (board.height * a.hotspot.y) / 100;
        const offset = ELBOW_OFFSET + i * ELBOW_STAGGER;
        const elbowX =
          keySide === "right" ? Math.min(x1 - 8, boardEdge + offset) : Math.max(x1 + 8, boardEdge - offset);
        return [
          {
            id: a.id,
            kind: a.kind,
            d: `M ${r(x1)} ${r(y1)} H ${r(elbowX)} V ${r(hy)} H ${r(hx)}`,
            dot: { x: r(hx), y: r(hy) },
          },
        ];
      });

      const key = `${nextClusters
        .map((c) => `${c.left}|${c.top}|${c.scale.toFixed(3)}|${c.side}|${c.flow}|${c.showKey}|${c.annotationIds.join(",")}`)
        .join("/")}|${next.map((t) => t.d).join(";")}`;
      if (key === lastKey) return;
      lastKey = key;
      setClusters(nextClusters);
      setTethers(next);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [annotations, artboardRef]);

  if (annotations.length === 0) return null;

  const activeKinds = new Set(annotations.map((a) => a.kind));
  const activeKind = annotations.find((a) => a.id === activeId)?.kind ?? null;
  const renderedIds = new Set(clusters.flatMap((c) => c.annotationIds));
  const pendingIds = annotations.map((a) => a.id).filter((id) => !renderedIds.has(id));

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 z-50">
      <svg className="absolute inset-0 size-full overflow-visible" aria-hidden>
        {tethers.map((t) => {
          const on = activeId === t.id;
          return (
            <g
              key={t.id}
              className="transition-colors duration-200"
              color={on ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)"}
            >
              <path
                d={t.d}
                fill="none"
                stroke="currentColor"
                strokeWidth={on ? 1.75 : 1.25}
                strokeDasharray="6 4"
                strokeLinejoin="round"
              />
              <circle cx={t.dot.x} cy={t.dot.y} r={on ? 3.5 : 3} fill="currentColor" />
            </g>
          );
        })}
      </svg>

      {clusters.map((cluster, index) => (
        <SpecCluster
          key={`${cluster.side}-${index}`}
          cluster={cluster}
          annotations={annotations}
          activeId={activeId}
          activeKind={activeKind}
          activeKinds={activeKinds}
          keyColumnRef={cluster.showKey ? keyColumnRef : undefined}
          pillRefs={pillRefs}
          cardRefs={cardRefs}
          onActiveChange={onActiveChange}
        />
      ))}

      {/* Measure any cards not in the live clusters yet so the first layout pass has heights. */}
      {pendingIds.length > 0 ? (
        <div className="pointer-events-none absolute -left-[200vw] top-0 opacity-0" aria-hidden>
          {pendingIds.map((id) => {
            const annotation = annotations.find((a) => a.id === id);
            if (!annotation) return null;
            return (
              <SpecDetailCard
                key={id}
                ref={(el) => {
                  cardRefs.current[id] = el;
                }}
                annotation={annotation}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function SpecCluster({
  cluster,
  annotations,
  activeId,
  activeKind,
  activeKinds,
  keyColumnRef,
  pillRefs,
  cardRefs,
  onActiveChange,
}: {
  cluster: ClusterLayout;
  annotations: SpecAnnotation[];
  activeId: string | null;
  activeKind: SpecKind | null;
  activeKinds: Set<SpecKind>;
  keyColumnRef?: RefObject<HTMLDivElement | null>;
  pillRefs: RefObject<Partial<Record<SpecKind, HTMLDivElement | null>>>;
  cardRefs: RefObject<Partial<Record<string, HTMLElement | null>>>;
  onActiveChange: (id: string | null) => void;
}) {
  const items = cluster.annotationIds
    .map((id) => annotations.find((a) => a.id === id))
    .filter((a): a is SpecAnnotation => Boolean(a));

  return (
    <div
      className="pointer-events-auto absolute origin-top-left"
      style={{ left: cluster.left, top: cluster.top, transform: `scale(${cluster.scale})` }}
    >
      <div
        className={cn(
          "flex items-start gap-4 font-['Inter',sans-serif]",
          cluster.side === "left" && "flex-row-reverse",
        )}
      >
        {cluster.showKey ? (
          <div
            ref={keyColumnRef}
            className={cn(
              "relative flex shrink-0 flex-col gap-2.5 overflow-hidden rounded-2xl border border-white/40 bg-white/30 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent dark:border-white/10 dark:bg-black/40",
              cluster.side === "left" ? "items-end" : "items-start",
            )}
            data-node-id="1992:35174"
          >
            {SPEC_KEY.map((entry) => {
              const match = annotations.find((a) => a.kind === entry.kind);
              const active = activeKind === entry.kind;
              return (
                <div
                  key={entry.kind}
                  ref={(el) => {
                    pillRefs.current[entry.kind] = el;
                  }}
                  onMouseEnter={() => match && onActiveChange(match.id)}
                  onMouseLeave={() => match && onActiveChange(null)}
                  className={cn(
                    "transition-all duration-300 ease-out hover:scale-[1.04]",
                    !activeKinds.has(entry.kind) && "opacity-45",
                    activeKind && !active && "opacity-35",
                  )}
                >
                  <KeyPill entry={entry} active={active} />
                </div>
              );
            })}
          </div>
        ) : null}

        {items.length > 0 ? (
          <div
            className={cn(
              "flex shrink-0 items-start gap-3 [perspective:1200px]",
              cluster.flow === "stack" ? "flex-col" : "flex-row",
              cluster.side === "left" && cluster.flow === "row" && "flex-row-reverse",
            )}
          >
            {items.map((annotation, i) => (
              <SpecDetailCard
                key={annotation.id}
                ref={(el) => {
                  cardRefs.current[annotation.id] = el;
                }}
                annotation={annotation}
                active={activeId === annotation.id}
                depth={i}
                onHover={onActiveChange}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function KindIcon({ entry, className }: { entry: KeyEntry; className?: string }) {
  if (typeof entry.icon === "string") {
    return <img alt="" src={entry.icon} className={cn("block size-3.5 shrink-0", className)} />;
  }
  const Icon = entry.icon;
  return <Icon className={cn("size-3.5 shrink-0", className)} color={entry.text} strokeWidth={2} />;
}

function KeyPill({ entry, active = false }: { entry: KeyEntry; active?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-solid px-3 py-1.5 text-[14px] font-normal leading-normal transition-all duration-300 ease-out",
        active && "bg-white/70 shadow-inner backdrop-blur-md dark:bg-white/20",
      )}
      style={
        active
          ? { borderColor: entry.border, color: entry.bg, boxShadow: `inset 0 0 0 1px ${entry.border}, 0 0 18px ${entry.border}` }
          : { backgroundColor: entry.bg, borderColor: entry.border, color: entry.text }
      }
    >
      <KindIcon entry={entry} />
      <span>{entry.label}</span>
    </div>
  );
}

/** Figma 1992:35214 — Button Details card, 15% smaller than the source frame. */
function SpecDetailCard({
  ref,
  annotation,
  active,
  depth = 0,
  onHover,
}: {
  ref?: Ref<HTMLElement>;
  annotation: SpecAnnotation;
  active?: boolean;
  depth?: number;
  onHover?: (id: string | null) => void;
}) {
  const entry = KEY_BY_KIND[annotation.kind];
  const rows: { label: string; value: string }[] = [
    { label: "Target", value: annotation.target },
    { label: "Accessible Name", value: annotation.accessibleName },
    { label: "Description", value: annotation.description },
  ];
  const [tilt, setTilt] = useState({ x: 0, y: 0, hover: false });

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 8, hover: true });
  };

  return (
    <article
      ref={ref}
      className="w-[396px] [transform-style:preserve-3d]"
      style={{ transform: `translateY(${depth * 5}px)` }}
    >
    <div
      className="relative flex w-full flex-col items-start gap-3 overflow-hidden rounded-2xl border border-white/40 bg-white/30 p-2.5 text-[#1e1e1e] shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-[transform,box-shadow] duration-300 ease-out before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent dark:border-white/10 dark:bg-black/40 dark:text-white"
      style={{
        transform: `translateZ(${depth * 18}px) translateY(${tilt.hover ? -4 : 0}px) scale(${tilt.hover ? 1.02 : 1}) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        boxShadow: active
          ? `0 0 0 2px ${entry.border}, 0 28px 60px rgba(0,0,0,0.16)`
          : tilt.hover
            ? "0 28px 60px rgba(0,0,0,0.16)"
            : undefined,
      }}
      onMouseEnter={() => {
        onHover?.(annotation.id);
        setTilt((t) => ({ ...t, hover: true }));
      }}
      onMouseLeave={() => {
        onHover?.(null);
        setTilt({ x: 0, y: 0, hover: false });
      }}
      onPointerMove={onPointerMove}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/45 via-white/10 to-transparent"
      />
      <header className="relative z-[1] flex w-full items-center gap-2">
        <div className="flex items-center gap-2 self-stretch">
          <div
            className="flex items-start rounded-[20px] border border-solid p-1.5"
            style={{ backgroundColor: entry.bg, borderColor: entry.border }}
          >
            <KindIcon entry={entry} />
          </div>
          <span aria-hidden className="w-px self-stretch bg-white/50" />
        </div>
        <h4 className="flex-1 text-[17px] font-semibold leading-normal">{entry.label} Details</h4>
      </header>

      <dl className="relative z-[1] flex w-full flex-col gap-3">
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full items-start">
            <dt className="flex-1 self-stretch text-[17px] font-medium leading-normal">Element</dt>
            <dd className="flex flex-1 items-center justify-center rounded-xl bg-white/70 px-2.5 py-1.5 shadow-inner backdrop-blur-md dark:bg-white/20">
              <span className="w-full text-[14px] font-medium leading-normal">{annotation.element}</span>
            </dd>
          </div>
          <span aria-hidden className="h-px w-full bg-white/40" />
        </div>

        {rows.map((row) => (
          <div key={row.label} className="flex w-full flex-col gap-1">
            <div className="flex w-full items-center justify-between text-[17px] leading-normal">
              <dt className="flex-1 font-medium">{row.label}</dt>
              <dd className="flex-1 font-normal">{row.value}</dd>
            </div>
            <span aria-hidden className="h-px w-full bg-white/40" />
          </div>
        ))}
      </dl>
    </div>
    </article>
  );
}

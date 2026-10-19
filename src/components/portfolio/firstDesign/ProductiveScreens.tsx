import { ArrowRight, ListChecks, Sparkles, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InspectorFrameId } from "./inspectorTypes";

function StatusBar({ light = false }: { light?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-11 shrink-0 items-end justify-between px-6 pb-1 text-[13px] font-semibold tabular-nums",
        light ? "text-black/90" : "text-white/90",
      )}
    >
      <span>9:41</span>
      <div className="flex items-center gap-1.5 opacity-90" aria-hidden>
        <span className="h-2.5 w-3.5 rounded-[2px] border border-current" />
        <span className="h-2 w-3 rounded-sm bg-current opacity-80" />
        <span className="h-2.5 w-5 rounded-[3px] border border-current p-[1px]">
          <span className="block h-full w-[70%] rounded-[2px] bg-current" />
        </span>
      </div>
    </div>
  );
}

export function ProductiveComingSoonScreen({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex h-full flex-col bg-[#0c1018] text-white">
      <StatusBar />
      <div className={cn("flex flex-1 flex-col items-center justify-center px-8 text-center", compact && "px-5")}>
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/35">Productive</p>
        <div className="relative mt-8 h-[120px] w-[140px]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute inset-x-0 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm"
              style={{
                top: i * 10,
                height: 100 - i * 8,
                transform: `rotate(${i === 0 ? -4 : i === 1 ? 2 : 6}deg)`,
                opacity: 1 - i * 0.12,
              }}
            />
          ))}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <ListChecks className="size-7 text-sky-300/80" strokeWidth={1.5} />
            <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/40">Coming soon</span>
          </div>
        </div>
        <h2 className={cn("mt-8 font-semibold tracking-tight text-white", compact ? "text-lg" : "text-2xl")}>
          Coming soon
        </h2>
        <p className={cn("mt-3 max-w-[260px] text-white/45", compact ? "text-[11px] leading-relaxed" : "text-sm leading-relaxed")}>
          The core loop is on its way. These frames hold the mark until the prototype lands.
        </p>
      </div>
    </div>
  );
}

/** Figma 2000:35713 — Tap to never look back (first wireframe). */
export function ProductiveOnboardingScreen({
  highlightHotspotId,
  devMode = false,
}: {
  compact?: boolean;
  highlightHotspotId?: string | null;
  devMode?: boolean;
}) {
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden bg-[#1b0616] text-white"
      data-figma-node="2000:35713"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[30%] -top-[8%] size-[min(90%,360px)] rounded-full bg-[#6b3460]/55 blur-[90px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[6%] -left-[8%] size-[160px] rounded-full bg-[#e29929]/30 blur-[55px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[32%] right-[-6%] size-[200px] rounded-full bg-[#2295ff]/22 blur-[65px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-8%] top-[32%] size-[130px] overflow-hidden rounded-full bg-gradient-to-br from-[#7c3aed]/75 to-[#4c1d95]/55"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-[12%] size-[72px] rounded-2xl rounded-bl-none bg-white/10 backdrop-blur-md"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[38%] right-[8%] size-[72px] overflow-hidden rounded-full bg-gradient-to-br from-[#f5c4a8] to-[#c97856]"
      />

      <StatusBar />

      <div className="relative z-10 flex flex-col items-center px-8 pt-1">
        <div
          className={cn(
            "flex size-[46px] items-center justify-center rounded-[10px] bg-[#0e1325] p-2.5",
            devMode &&
              highlightHotspotId === "app-mark" &&
              "ring-2 ring-sky-400/70 ring-offset-2 ring-offset-[#1b0616]",
          )}
        >
          <ProductiveListMark large />
        </div>
      </div>

      <div
        className={cn(
          "relative z-10 mx-auto flex flex-1 flex-col justify-center px-8 pb-6 pt-4 text-center",
          devMode &&
            highlightHotspotId === "headline" &&
            "rounded-xl ring-2 ring-sky-400/60 ring-offset-4 ring-offset-[#1b0616]",
        )}
      >
        <h1 className="text-[28px] font-bold leading-[1.15] tracking-tight">Tap to never look back</h1>
        <p className="mx-auto mt-3 max-w-[260px] text-[12px] font-medium leading-relaxed text-white/80">
          Initiate your deep work blocks
        </p>
      </div>

      <div className="relative z-10 flex shrink-0 justify-center px-8 pb-10 pt-2">
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2.5 rounded-full border border-[#e29929] bg-[#e29929] px-7 py-3.5 text-[17px] font-medium text-black shadow-[0_12px_40px_rgba(226,153,41,0.35)]",
            devMode &&
              highlightHotspotId === "primary-cta" &&
              "ring-2 ring-sky-400 ring-offset-2 ring-offset-[#1b0616]",
          )}
        >
          Begin Session
          <ArrowRight className="size-[18px]" strokeWidth={2.5} />
        </button>
      </div>

      {devMode ? (
        <>
          <Hotspot annotationId="app-mark" x={50} y={16} active={highlightHotspotId === "app-mark"} />
          <Hotspot annotationId="headline" x={50} y={46} active={highlightHotspotId === "headline"} />
          <Hotspot annotationId="primary-cta" x={50} y={89} active={highlightHotspotId === "primary-cta"} />
        </>
      ) : null}
    </div>
  );
}

const SESSION_OPTIONS = [
  { id: "deep", label: "Deep work session", detail: "90 min · notifications muted", icon: Sparkles },
  { id: "sprint", label: "Focus sprint", detail: "25 min · single task", icon: Timer },
  { id: "review", label: "Review & plan", detail: "45 min · light checklist", icon: ListChecks },
] as const;

/** Session type picker — second wireframe in the design file strip. */
export function ProductiveSessionSetupScreen() {
  return (
    <div className="relative flex h-full flex-col bg-[#0a0f16] text-white">
      <StatusBar />
      <div className="flex flex-1 flex-col px-6 pb-8 pt-2">
        <p className="text-[22px] font-semibold leading-tight tracking-tight text-white">
          What kind of focused session starts this focus?
        </p>

        <ul className="mt-6 flex flex-1 flex-col gap-3">
          {SESSION_OPTIONS.map((opt, index) => {
            const selected = index === 0;
            const Icon = opt.icon;
            return (
              <li key={opt.id}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left",
                    selected
                      ? "border-sky-400/50 bg-sky-500/10"
                      : "border-white/10 bg-white/[0.03]",
                  )}
                >
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/5">
                    <Icon className="size-4 text-sky-300" strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-white">{opt.label}</span>
                    <span className="mt-0.5 block text-xs text-white/45">{opt.detail}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="mt-4 w-full rounded-2xl bg-white py-4 text-center text-[15px] font-semibold text-[#0a0f16]"
        >
          Begin Session
        </button>
      </div>
    </div>
  );
}

function ProductiveListMark({ large = false }: { large?: boolean }) {
  const rows = [
    { dot: "bg-[#11c883]", bar: "bg-[#11c883]" },
    { dot: "bg-[#e29929]", bar: "bg-[#e29929]" },
    { dot: "bg-[#2295ff]", bar: "bg-[#2295ff]" },
  ] as const;
  return (
    <div className={cn("flex w-full flex-col", large ? "gap-1.5" : "gap-1")}>
      {rows.map((row) => (
        <div key={row.bar} className="flex items-center gap-1.5">
          <span className={cn("rounded-full", large ? "size-1.5" : "size-1", row.dot)} />
          <span className={cn("rounded-full", large ? "h-1.5 w-5" : "h-1 w-4", row.bar)} />
        </div>
      ))}
    </div>
  );
}

function Hotspot({
  x,
  y,
  active,
}: {
  annotationId: string;
  x: number;
  y: number;
  active?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-20 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-sky-300/70 bg-sky-400/15",
        active && "border-solid border-sky-300 bg-sky-400/30 shadow-[0_0_0_6px_rgba(56,189,248,0.15)]",
      )}
      style={{ left: `${x}%`, top: `${y}%` }}
    />
  );
}

export function ProductiveFrameScreen({
  frameId,
  compact,
  devMode,
  highlightHotspotId,
}: {
  frameId: InspectorFrameId;
  compact?: boolean;
  devMode?: boolean;
  highlightHotspotId?: string | null;
}) {
  if (frameId === "onboarding") {
    return (
      <ProductiveOnboardingScreen
        compact={compact}
        devMode={devMode}
        highlightHotspotId={highlightHotspotId}
      />
    );
  }
  if (frameId === "session-setup") {
    return <ProductiveSessionSetupScreen />;
  }
  if (frameId === "session-active") {
    return <ProductiveSessionActiveScreen compact={compact} />;
  }
  return <ProductiveComingSoonScreen compact={compact} />;
}

function ProductiveSessionActiveScreen({ compact }: { compact?: boolean }) {
  return (
    <div className="flex h-full flex-col bg-[#0a0f16] text-white">
      <StatusBar />
      <div className={cn("flex flex-1 flex-col items-center justify-center px-8", compact && "px-5")}>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Session active</p>
        <p className={cn("mt-6 font-light tabular-nums text-white", compact ? "text-4xl" : "text-6xl")}>
          42:18
        </p>
        <p className="mt-3 text-sm text-white/45">Deep work session</p>
        <button
          type="button"
          className={cn(
            "mt-10 rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white/80",
            compact && "mt-6 text-xs",
          )}
        >
          End session
        </button>
      </div>
    </div>
  );
}

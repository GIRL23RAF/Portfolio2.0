import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Code2, ScanSearch, X } from "lucide-react";
import { cn } from "@/lib/utils";

type InspectorModalHeaderProps = {
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  isDevModeActive: boolean;
  onToggleDevMode: () => void;
  frameLabel: string;
  frameIndex: number;
  frameCount: number;
};

export function InspectorModalHeader({
  onPrev,
  onNext,
  onClose,
  isDevModeActive,
  onToggleDevMode,
  frameLabel,
  frameIndex,
  frameCount,
}: InspectorModalHeaderProps) {
  return (
    <header className="relative z-10 flex shrink-0 items-center justify-between gap-4 px-2 py-1">
      <div className="flex min-w-[120px] items-center gap-1 rounded-full bg-white px-2 py-1 shadow-sm">
        <IconPill label="Previous frame" onClick={onPrev}>
          <ChevronLeft className="size-5 text-[#121515]" strokeWidth={2} />
        </IconPill>
        <IconPill label="Next frame" onClick={onNext}>
          <ChevronRight className="size-5 text-[#121515]" strokeWidth={2} />
        </IconPill>
        <span className="sr-only">
          Frame {frameIndex + 1} of {frameCount}: {frameLabel}
        </span>
      </div>

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center">
        <div
          className="flex items-center rounded-full border border-[#121515]/80 bg-[rgba(142,152,168,0.4)] p-0.5 backdrop-blur-sm"
          role="group"
          aria-label="Preview mode"
        >
          <ModeSegment
            active={!isDevModeActive}
            onClick={() => !isDevModeActive || onToggleDevMode()}
            icon={<Code2 className="size-3.5" strokeWidth={2} />}
            label="Dev Mode"
          />
          <ModeSegment
            active={isDevModeActive}
            onClick={() => isDevModeActive || onToggleDevMode()}
            icon={<ScanSearch className="size-3.5" strokeWidth={2} />}
            label="Inspector"
          />
        </div>
      </div>

      <div className="flex min-w-[120px] justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white p-2 shadow-sm transition hover:bg-zinc-50"
          aria-label="Close inspector"
        >
          <X className="size-5 text-[#121515]" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}

function IconPill({ children, label, onClick }: { children: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full p-1 transition hover:bg-zinc-100"
      aria-label={label}
    >
      {children}
    </button>
  );
}

function ModeSegment({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium tracking-tight transition",
        active ? "bg-white text-[#121515] shadow-sm" : "text-white/90 hover:text-white",
      )}
      aria-pressed={active}
    >
      <span className="opacity-80" aria-hidden>
        &lt; / &gt;
      </span>
      {icon}
      <span>{label}</span>
    </button>
  );
}

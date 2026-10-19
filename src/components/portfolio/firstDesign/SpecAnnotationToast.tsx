import { cn } from "@/lib/utils";
import type { SpecAnnotation } from "./inspectorTypes";

type SpecAnnotationToastProps = {
  annotation: SpecAnnotation;
  active?: boolean;
  className?: string;
  onHover?: (id: string | null) => void;
};

export function SpecAnnotationToast({
  annotation,
  active = false,
  className,
  onHover,
}: SpecAnnotationToastProps) {
  const rows: { label: string; value: string }[] = [
    { label: "Element", value: annotation.element },
    { label: "Target", value: annotation.target },
    { label: "Accessible Name", value: annotation.accessibleName },
    { label: "Description", value: annotation.description },
  ];

  return (
    <article
      className={cn(
        "w-[min(100%,320px)] rounded-2xl border border-white/10 bg-neutral-900/80 p-4 text-left shadow-[0_24px_64px_rgba(0,0,0,0.45)] backdrop-blur-md transition-[box-shadow,border-color,transform]",
        active && "scale-[1.02] border-sky-400/40 shadow-[0_28px_72px_rgba(56,189,248,0.15)]",
        className,
      )}
      onMouseEnter={() => onHover?.(annotation.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/90">
        {annotation.category}
      </span>

      <dl className="mt-3 space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[11px] leading-snug">
            <dt className="font-medium text-white/45">{row.label}</dt>
            <dd className="text-white/85">{row.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

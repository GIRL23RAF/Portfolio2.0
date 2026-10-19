import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { SpecAnnotationToast } from "./SpecAnnotationToast";
import type { SpecAnnotation } from "./inspectorTypes";

type AnnotationLayerProps = {
  annotations: SpecAnnotation[];
  deviceRef: React.RefObject<HTMLDivElement | null>;
  activeId: string | null;
  onActiveChange: (id: string | null) => void;
};

type LineSegment = { x1: number; y1: number; x2: number; y2: number; id: string };

export function AnnotationLayer({
  annotations,
  deviceRef,
  activeId,
  onActiveChange,
}: AnnotationLayerProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const toastRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [lines, setLines] = useState<LineSegment[]>([]);

  const recompute = useCallback(() => {
    const stage = stageRef.current;
    const device = deviceRef.current;
    if (!stage || !device) return;

    const stageRect = stage.getBoundingClientRect();
    const deviceRect = device.getBoundingClientRect();

    const next: LineSegment[] = annotations.map((a) => {
      const hx = deviceRect.left + (deviceRect.width * a.hotspot.x) / 100;
      const hy = deviceRect.top + (deviceRect.height * a.hotspot.y) / 100;
      const toastEl = toastRefs.current[a.id];
      if (!toastEl) {
        return { id: a.id, x1: hx - stageRect.left, y1: hy - stageRect.top, x2: hx - stageRect.left, y2: hy - stageRect.top };
      }
      const tr = toastEl.getBoundingClientRect();
      const x2 = a.toast.side === "right" ? tr.left - stageRect.left : tr.right - stageRect.left;
      const y2 = tr.top - stageRect.top + tr.height / 2;
      return { id: a.id, x1: hx - stageRect.left, y1: hy - stageRect.top, x2, y2 };
    });
    setLines(next);
  }, [annotations, deviceRef]);

  useLayoutEffect(() => {
    recompute();
    const ro = new ResizeObserver(recompute);
    if (stageRef.current) ro.observe(stageRef.current);
    if (deviceRef.current) ro.observe(deviceRef.current);
    window.addEventListener("resize", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [recompute, deviceRef, annotations]);

  const left = annotations.filter((a) => a.toast.side === "left");
  const right = annotations.filter((a) => a.toast.side === "right");

  return (
    <div ref={stageRef} className="pointer-events-none absolute inset-0">
      <svg className="absolute inset-0 size-full overflow-visible" aria-hidden>
        {lines.map((line) => (
          <line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={activeId === line.id ? "rgba(56, 189, 248, 0.85)" : "rgba(255, 255, 255, 0.35)"}
            strokeWidth={activeId === line.id ? 2 : 1.5}
            strokeDasharray="6 5"
          />
        ))}
      </svg>

      <div className="absolute inset-y-8 left-0 flex w-[min(34%,320px)] flex-col gap-4 pointer-events-auto">
        {left.map((a) => (
          <div
            key={a.id}
            ref={(el) => {
              toastRefs.current[a.id] = el;
            }}
            style={{ marginTop: a.toast.top * 4 }}
          >
            <SpecAnnotationToast
              annotation={a}
              active={activeId === a.id}
              onHover={onActiveChange}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-y-8 right-0 flex w-[min(34%,320px)] flex-col gap-4 pointer-events-auto">
        {right.map((a) => (
          <div
            key={a.id}
            ref={(el) => {
              toastRefs.current[a.id] = el;
            }}
            style={{ marginTop: a.toast.top * 4 }}
          >
            <SpecAnnotationToast
              annotation={a}
              active={activeId === a.id}
              onHover={onActiveChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

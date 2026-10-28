import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Figma wireframe device — white border, 402×874 (portfolio strip). */
export const PRODUCTIVE_WIREFRAME_PHONE_W = 402;
export const PRODUCTIVE_WIREFRAME_PHONE_H = 874;

export function ProductiveWireframePhone({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative ml-auto h-[874px] w-[402px] shrink-0 overflow-hidden rounded-[58px] border border-white bg-black shadow-[0_28px_80px_rgba(0,0,0,0.45)]",
        className,
      )}
      data-device="productive-wireframe-402x874"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[18px] z-20 h-[26px] w-[87px] -translate-x-1/2 rounded-full bg-black"
      />
      <div className="relative h-full w-full overflow-hidden rounded-[56px]">{children}</div>
    </div>
  );
}

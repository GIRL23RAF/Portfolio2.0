import type { ReactNode } from "react";
import { DesignFileDotGrid } from "./DesignFileDotGrid";

/** Matches OdicciBrowserFrame outer shell width; viewport height fits 402×874 phones. */
export function ProductiveDesignFileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full min-w-0 max-w-[980px] overflow-hidden rounded-2xl border border-white/10 bg-[#121515] shadow-2xl shadow-black/40">
      <div className="relative h-[874px] w-full overflow-x-auto overflow-y-hidden overscroll-x-contain">
        <div className="relative h-full w-max min-w-full">
          <DesignFileDotGrid className="absolute inset-0" />
          <div className="relative flex h-full items-center gap-12 px-10">{children}</div>
        </div>
      </div>
    </div>
  );
}

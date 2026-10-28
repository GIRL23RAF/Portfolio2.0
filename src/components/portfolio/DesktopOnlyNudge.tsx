import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const PILL_VISIBLE_MS = 2400;

/** Shake + "desktop-only" pill for things phones can't open (Figma 2263:58115). */
export function useDesktopOnlyNudge() {
  const reduceMotion = useReducedMotion();
  const controls = useAnimationControls();
  const [pillVisible, setPillVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const nudge = useCallback(() => {
    if (!reduceMotion) {
      void controls.start({
        x: [0, -10, 10, -7, 7, -3, 3, 0],
        transition: { duration: 0.5, ease: "easeInOut" },
      });
    }
    setPillVisible(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPillVisible(false), PILL_VISIBLE_MS);
  }, [reduceMotion, controls]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { controls, pillVisible, nudge };
}

export function DesktopOnlyPill({ visible, className }: { visible: boolean; className?: string }) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.p
          key="desktop-only-pill"
          role="status"
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "pointer-events-none absolute z-20 whitespace-nowrap rounded-[64px] border border-[#bb9ffa] bg-[linear-gradient(161.4deg,rgba(3,86,229,0.284)_19.75%,rgba(1,208,129,0.052)_86.39%)] px-4 py-1 text-center text-[10px] font-bold uppercase text-[#090e15] backdrop-blur-[4px]",
            className,
          )}
        >
          Psst… desktop-only
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

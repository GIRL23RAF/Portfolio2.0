import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

/** Commit to the work section once its top crosses this fraction of the viewport. */
const COMMIT_VIEWPORT_RATIO = 0.52;
const WORK_SECTION_ID = "work";

const getWorkSection = () => document.getElementById(WORK_SECTION_ID);

/**
 * One-way hand-off from the full-screen hero to `#work`.
 * Once committed, the page can't scroll (or wheel / swipe) back up into the hero.
 */
export function useWorkCommit() {
  const reduceMotion = useReducedMotion();
  const [workCommitted, setWorkCommitted] = useState(false);
  const committedRef = useRef(false);
  const scrollingRef = useRef(false);

  const workTop = useCallback(() => getWorkSection()?.offsetTop ?? 0, []);

  const commitToWork = useCallback(
    (behavior?: ScrollBehavior) => {
      const work = getWorkSection();
      if (!work || scrollingRef.current || committedRef.current) return;
      const resolved = behavior ?? (reduceMotion ? "auto" : "smooth");
      committedRef.current = true;
      setWorkCommitted(true);
      scrollingRef.current = true;
      window.scrollTo({ top: work.offsetTop, behavior: resolved });
      window.setTimeout(
        () => {
          scrollingRef.current = false;
        },
        resolved === "smooth" ? 900 : 0,
      );
    },
    [reduceMotion],
  );

  useEffect(() => {
    committedRef.current = workCommitted;
  }, [workCommitted]);

  useEffect(() => {
    const clampAboveWork = () => {
      if (!committedRef.current || scrollingRef.current) return;
      const top = workTop();
      if (window.scrollY < top - 1) window.scrollTo({ top, behavior: "auto" });
    };

    const onScroll = () => {
      const work = getWorkSection();
      if (!work) return;
      if (!committedRef.current) {
        if (work.getBoundingClientRect().top < window.innerHeight * COMMIT_VIEWPORT_RATIO) {
          commitToWork();
        }
        return;
      }
      clampAboveWork();
    };

    const atWorkTop = () =>
      committedRef.current && !scrollingRef.current && window.scrollY <= workTop() + 2;

    const onWheel = (event: WheelEvent) => {
      if (atWorkTop() && event.deltaY < 0) event.preventDefault();
    };

    let touchStartY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (atWorkTop() && (event.touches[0]?.clientY ?? 0) - touchStartY > 0) event.preventDefault();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("resize", clampAboveWork);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", clampAboveWork);
    };
  }, [commitToWork, workTop]);

  return { workCommitted, commitToWork };
}

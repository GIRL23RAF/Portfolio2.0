import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import playSolid from "@/assets/portfolio/hover/play-solid.svg";
import { isPhoneViewport } from "@/lib/viewport";

const PREVIEW_MAX = 440;
const RADIUS_FROM = 120 / 4096;
const SPRING = { damping: 15, stiffness: 150, mass: 0.2 };
const PLAY_COLOR = "#060A0C";
const LOGO_RIGHT = 64 / 4096;
const LOGO_BOTTOM = 64 / 2730;
const LOGO_WIDTH = 248 / 4096;

export interface HoverPreviewMedia {
  src: string;
  alt: string;
  width: number;
  height: number;
  glassLogo?: boolean;
  playColor?: string;
  logo?: { src: string; width: number; height: number };
}

function previewSize(media: HoverPreviewMedia) {
  const width = Math.min(PREVIEW_MAX, window.innerWidth - 32);
  return { width, height: width * (media.height / media.width) };
}

/** Cursor-following case-study preview (live araguiar.design). Hidden while the row is open. */
export function useRowHoverPreview(media: HoverPreviewMedia | undefined, enabled: boolean) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = reduceMotion ? { duration: 0 } : SPRING;
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);
  const rotate = useSpring(useTransform(rawX, [-800, 800], [-3, 3]), spring);

  const onMouseEnter = (event: MouseEvent) => {
    if (isPhoneViewport()) return;
    rawX.set(event.clientX);
    rawY.set(event.clientY);
    x.jump(event.clientX);
    y.jump(event.clientY);
    if (media && enabled) setOpen(true);
  };
  const onMouseMove = (event: MouseEvent) => {
    rawX.set(event.clientX);
    rawY.set(event.clientY);
  };
  const onMouseLeave = () => setOpen(false);

  useEffect(() => {
    if (!enabled) setOpen(false);
  }, [enabled]);

  return {
    open: open && enabled && !!media,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    x,
    y,
    rotate,
    reduceMotion: !!reduceMotion,
  };
}

export function RowHoverPreview({
  open,
  media,
  x,
  y,
  rotate,
  reduceMotion,
}: {
  open: boolean;
  media: HoverPreviewMedia;
  x: ReturnType<typeof useSpring>;
  y: ReturnType<typeof useSpring>;
  rotate: ReturnType<typeof useSpring>;
  reduceMotion: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const { width, height } = previewSize(media);
  const radius = RADIUS_FROM * width;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key={media.src}
          className="pointer-events-none fixed top-0 left-0 z-[100] will-change-transform"
          style={{ x, y, rotate: reduceMotion ? 0 : rotate }}
          aria-hidden
        >
          <motion.div
            className="pointer-events-none -translate-x-1/2 -translate-y-1/2"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
            transition={reduceMotion ? { duration: 0.15 } : { type: "spring", ...SPRING }}
          >
            <div
              className="relative overflow-hidden shadow-[0_24px_60px_rgba(6,10,12,0.22)]"
              style={{ width, height, borderRadius: radius }}
            >
              <img
                src={media.src}
                alt={media.alt}
                width={media.width}
                height={media.height}
                draggable={false}
                className="pointer-events-none size-full max-w-none object-cover"
              />
              <div
                className={
                  "absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full py-1 pr-3 pl-2 " +
                  (media.glassLogo
                    ? "border border-white/55 bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-xl"
                    : "bg-white/20 backdrop-blur-md")
                }
              >
                <PlayGlyph color={media.playColor ?? PLAY_COLOR} />
                <span className="whitespace-nowrap text-[13px] leading-none tracking-[-0.5px] text-[#292d32]">
                  Play me
                </span>
              </div>
              {media.logo ? <PreviewLogo media={media} /> : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function PreviewLogo({ media }: { media: HoverPreviewMedia }) {
  const logo = media.logo;
  if (!logo) return null;
  return (
    <div
      className={
        "pointer-events-none absolute overflow-hidden rounded-full " +
        (media.glassLogo
          ? "border border-white/55 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_20px_rgba(6,10,12,0.12)] backdrop-blur-xl"
          : "")
      }
      style={{
        right: `${LOGO_RIGHT * 100}%`,
        bottom: `${LOGO_BOTTOM * 100}%`,
        width: `${LOGO_WIDTH * 100}%`,
        aspectRatio: `${logo.width} / ${logo.height}`,
      }}
    >
      <img
        src={logo.src}
        alt=""
        width={logo.width}
        height={logo.height}
        draggable={false}
        className="pointer-events-none size-full max-w-none"
      />
    </div>
  );
}

function PlayGlyph({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none inline-block size-3.5 shrink-0"
      style={{
        backgroundColor: color,
        maskImage: `url("${playSolid}")`,
        WebkitMaskImage: `url("${playSolid}")`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskMode: "alpha",
      }}
    />
  );
}

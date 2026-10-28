import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import featuredHero from "@/assets/portfolio/graduate/featured-hero.png";
import { GRADUATE_PROJECTS } from "@/components/portfolio/graduateProjects";

const EASE = [0.22, 1, 0.36, 1] as const;
const NOTICE_MS = 2400;
const MONTSERRAT = { fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif" };

/** Featured project leads; the rest loop on the rail (doubled so `translateY(-50%)` wraps seamlessly). */
const RAIL_PROJECTS = GRADUATE_PROJECTS.slice(1);
const RAIL_CARDS = [...RAIL_PROJECTS, ...RAIL_PROJECTS];

/** Industrial Design graduate work modal — mirrors the live araguiar.design overlay. */
export function GraduateWorkOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) return;
    clearTimeout(noticeTimer.current);
    setNoticeVisible(false);
  }, [open]);

  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  const showNotice = () => {
    setNoticeVisible(true);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNoticeVisible(false), NOTICE_MS);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="graduate-work"
          role="dialog"
          aria-modal="true"
          aria-label="Industrial Design Graduate Work"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 md:p-8"
        >
          <button
            type="button"
            aria-label="Close graduate work"
            onClick={onClose}
            className="absolute inset-0 cursor-default border-0 bg-zinc-950/50 backdrop-blur-[8px]"
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="graduate-work-overlay relative z-[1] flex flex-col overflow-hidden shadow-[0_28px_80px_rgba(11,14,20,0.35)]"
          >
            <div
              aria-hidden
              className="graduate-work-overlay__blur pointer-events-none absolute inset-0 bg-white/20 backdrop-blur-[12px]"
            />

            <div className="relative z-[1] flex flex-col gap-3 p-4 max-sm:gap-2.5 max-sm:p-3">
              <header className="graduate-work-overlay__header shrink-0 bg-[rgba(9,14,21,0.5)] pr-10">
                <div className="min-w-0 leading-[1.2] tracking-[-0.41px] text-white">
                  <p
                    className="text-[clamp(10px,1.1vw,16px)] font-normal uppercase"
                    style={MONTSERRAT}
                  >
                    Industrial Design Graduate Work
                  </p>
                  <h2 className="mt-1 text-[clamp(18px,2.6vw,38px)] font-medium" style={MONTSERRAT}>
                    Oh... I also do Industrial Design
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                  className="graduate-work-overlay__close"
                >
                  <svg
                    className="graduate-work-overlay__close-icon"
                    viewBox="0 0 36 36"
                    fill="none"
                    aria-hidden
                  >
                    <circle cx="18" cy="18" r="18" fill="white" fillOpacity="0.15" />
                    <path
                      d="M14 14L22 22M22 14L14 22"
                      stroke="white"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </header>

              <div className="flex flex-col gap-3">
                <p
                  className="shrink-0 text-[clamp(10px,1.1vw,15px)] leading-[1.35] tracking-[-0.41px] text-white/60"
                  style={MONTSERRAT}
                >
                  Physical product explorations from my Industrial Design Technology degree at
                  Loughborough — tactile interfaces, street hardware, and objects that bridge
                  digital intent with material craft. Case studies are being prepared for the
                  portfolio.
                </p>

                <div className="graduate-work-media-stage">
                  <div className="graduate-work-hero">
                    <img
                      src={featuredHero}
                      alt="Artaeka — featured graduate project"
                      className="graduate-work-hero__image absolute inset-0 size-full"
                      draggable={false}
                      decoding="async"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-black/10" />
                    <div className="graduate-work-hero__badge absolute right-3 top-3 bg-black/10 px-3 py-2 backdrop-blur-[4px]">
                      <span
                        className="whitespace-nowrap text-[clamp(10px,1.1vw,14px)] leading-[1.2] tracking-[-0.41px] text-white"
                        style={MONTSERRAT}
                      >
                        Coming Soon
                      </span>
                    </div>
                  </div>

                  <div className="graduate-escalator-rail">
                    <div className="relative h-full min-h-0 w-fit overflow-hidden">
                      <div className="graduate-escalator-track">
                        {RAIL_CARDS.map((project, i) => (
                          <button
                            key={`${project.id}-${i}`}
                            type="button"
                            aria-label={`${project.title} — not available yet`}
                            aria-hidden={i >= RAIL_PROJECTS.length || undefined}
                            tabIndex={i >= RAIL_PROJECTS.length ? -1 : undefined}
                            onClick={showNotice}
                            className="graduate-escalator-card group relative aspect-[584/634] shrink-0 cursor-pointer border-0 bg-transparent p-0 text-left"
                          >
                            <img
                              src={project.hero}
                              alt=""
                              className="graduate-escalator-card__image absolute inset-0 size-full"
                              draggable={false}
                              loading="lazy"
                              decoding="async"
                            />
                            <div
                              aria-hidden
                              className="absolute inset-0 rounded-[inherit] bg-black/20 transition-colors duration-200 group-hover:bg-black/30"
                            />
                            <div className="graduate-escalator-card__action">
                              <svg
                                className="graduate-escalator-card__action-icon"
                                viewBox="0 0 32 32"
                                fill="none"
                                aria-hidden
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M11.8382 7.51472C11.8382 6.77834 12.4352 6.18138 13.1716 6.18138H24.4853C25.2217 6.18138 25.8186 6.77834 25.8186 7.51472V18.8284C25.8186 19.5648 25.2217 20.1618 24.4853 20.1618C23.7489 20.1618 23.1519 19.5648 23.1519 18.8284V10.7337L8.45753 25.4281C7.93683 25.9488 7.09261 25.9488 6.57191 25.4281C6.05121 24.9074 6.05121 24.0632 6.57191 23.5425L21.2663 8.84805H13.1716C12.4352 8.84805 11.8382 8.2511 11.8382 7.51472Z"
                                  fill="white"
                                />
                              </svg>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {noticeVisible ? (
                <motion.output
                  key="graduate-notice"
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className="pointer-events-none absolute bottom-4 left-1/2 z-[4] -translate-x-1/2 whitespace-nowrap rounded-full border border-white/35 bg-zinc-900/90 px-4 py-2 text-[clamp(11px,1.1vw,13px)] font-medium tracking-[-0.2px] text-white shadow-[0_10px_28px_rgba(11,14,20,0.28)] backdrop-blur-md"
                  style={MONTSERRAT}
                >
                  Not available yet.
                </motion.output>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

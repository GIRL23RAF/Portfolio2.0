import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { forwardRef, useState } from "react";

// Tabs shown inside every expanded project row.
// Add/remove entries here to change the case-study steps globally.
const TABS = ["Create Workspace\u00a0", "Brand Personality", "V2: Iteration", "V3: Final Screen"] as const;
type Tab = (typeof TABS)[number];

export interface Project {
  id: string; // e.g. "01"
  slug: string; // e.g. "crcle" — used by the dock to target this row
  title: string;
  role: string;
  year: string;
  // Per-tab content slots. Each returns whatever prototype/text you want to drop in later.
  content?: Partial<Record<Tab, ProjectTabContent>>;
}

export interface ProjectTabContent {
  label?: string;
  subtitle?: string;
  hypothesis?: string;
  notes?: string;
  // Slot for your live interactive prototype / mockup asset.
  mockup?: React.ReactNode;
  // Optional: fully replace the default two-column body with a custom render.
  // When a function is provided, it receives tab helpers so nested CTAs can advance.
  customBody?: React.ReactNode | ((helpers: { onNextTab: () => void }) => React.ReactNode);
}

interface Props {
  project: Project;
  isOpen: boolean;
  onToggle: () => void;
}

export const ProjectAccordion = forwardRef<HTMLDivElement, Props>(function ProjectAccordion(
  { project, isOpen, onToggle },
  ref,
) {
  const [activeTab, setActiveTab] = useState<Tab>("Create Workspace\u00a0");
  const tabContent = project.content?.[activeTab] ?? {};

  return (
    <div ref={ref} className="border-t border-zinc-200 last:border-b">
      {/* Row header — click to toggle */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 px-2 md:px-6 group text-left"
      >
        <div className="flex items-center gap-6 md:gap-10">
          <span className="text-xs font-medium tracking-widest text-zinc-400 tabular-nums">
            {project.id}
          </span>
          <span className="text-xl md:text-2xl font-medium tracking-tight text-zinc-900">
            {project.title}
          </span>
        </div>
        <div className="text-xs md:text-sm text-zinc-500 tracking-tight hidden sm:block">
          {project.role} <span className="text-zinc-300 mx-2">|</span> {project.year}
        </div>
      </button>

      {/* Expanded body — Framer Motion vertical slide */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="relative px-2 md:px-6 pb-16 pt-4">
              {/* Tab switcher (capsule pills) */}
              <div className="flex justify-center mb-12">
                <div className="inline-flex items-center gap-1 rounded-full border border-white bg-white/70 backdrop-blur-xl shadow-2xl shadow-slate-200/50 p-1">
                  {TABS.map((tab) => {
                    const active = tab === activeTab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={
                          "px-4 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all border " +
                          (active
                            ? "bg-zinc-950/50 backdrop-blur border-white/25 text-white shadow-sm"
                            : "text-zinc-500 hover:text-zinc-900 hover:bg-white/30 border-transparent")
                        }
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Absolute-positioned navigation arrows flanking the content */}
              <NavArrow
                direction="prev"
                onClick={() => {
                  const i = TABS.indexOf(activeTab);
                  setActiveTab(TABS[(i - 1 + TABS.length) % TABS.length]);
                }}
              />
              <NavArrow
                direction="next"
                onClick={() => {
                  const i = TABS.indexOf(activeTab);
                  setActiveTab(TABS[(i + 1) % TABS.length]);
                }}
              />

              {tabContent.customBody ? (
                <div className="max-w-6xl mx-auto px-4 md:px-12">
                  {typeof tabContent.customBody === "function"
                    ? tabContent.customBody({ onNextTab: () => {
                        const i = TABS.indexOf(activeTab);
                        setActiveTab(TABS[(i + 1) % TABS.length]);
                      }})
                    : tabContent.customBody}
                </div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-5xl mx-auto px-8 md:px-16">
                {/* LEFT — text column */}
                <div className="flex flex-col justify-center">
                  <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-400">
                    {tabContent.label ?? `${project.title} — ${activeTab}`}
                  </span>
                  <h3 className="mt-3 text-3xl md:text-4xl font-medium tracking-tight text-zinc-900 leading-tight">
                    {tabContent.subtitle ?? "A system that teaches itself"}
                  </h3>

                  <div className="mt-8 space-y-6">
                    <TextBlock heading="Design Hypothesis">
                      {tabContent.hypothesis ??
                        "Drop your hypothesis narrative here — the initial premise, the constraints considered, and the users we designed for."}
                    </TextBlock>
                    <TextBlock heading="Iterative Notes">
                      {tabContent.notes ??
                        "Drop iterative notes here — what was tested, what broke, and the observations that pushed the design toward the final screen."}
                    </TextBlock>
                  </div>
                </div>

                {/* RIGHT — mockup viewport. Drop your live prototype here. */}
                <div className="relative">
                  <div className="rounded-3xl overflow-hidden bg-zinc-100 aspect-[4/5] w-full flex items-center justify-center">
                    {tabContent.mockup ?? (
                      <div className="text-xs text-zinc-400 tracking-widest uppercase">
                        {project.slug} · {activeTab}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

function TextBlock({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-900">
        {heading}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500 max-w-md">{children}</p>
    </div>
  );
}

function NavArrow({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Previous step" : "Next step"}
      className={
        "hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full border border-zinc-200 bg-white/80 backdrop-blur hover:bg-white text-black transition-colors " +
        (isPrev ? "left-2" : "right-2")
      }
    >
      {isPrev ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
    </button>
  );
}
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  StickyNote,
  Mail,
  CalendarDays,
  Smile,
  ListChecks,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import girlPleaseLogo from "@/assets/girl-please.svg";

/**
 * ProfileSidebar — floating "Clay-style" profile card.
 *
 * A semi-opaque frosted panel that sits alongside the main portfolio
 * layout. Warm mesh-gradient glow behind icing-white glass, crisp type,
 * and a vertical track line stitching a chronological timeline together.
 */

interface TimelineNode {
  icon: typeof StickyNote;
  iconBg: string;
  title: string;
  date: string;
  details?: string;
}

const TIMELINE: TimelineNode[] = [
  {
    icon: StickyNote,
    iconBg: "#FFFFFF",
    title: "Promoted to Product Designer (Odicci)",
    date: "MARCH 2026",
    details:
      "Stepped up as the sole designer managing the end-to-end core product UX ecosystem.",
  },
  {
    icon: Mail,
    iconBg: "#FFFFFF",
    title: "Crcle V1 Launch (Part-Time)",
    date: "DEC 2025 — PRESENT",
    details:
      "Acting as the sole designer to architect, execute, and deliver the complete V1 product layout — work is ongoing.",
  },
  {
    icon: CalendarDays,
    iconBg: "#FFFFFF",
    title: "Product Design Intern (Odicci)",
    date: "JULY 2025",
  },
  {
    icon: CalendarDays,
    iconBg: "#FFFFFF",
    title: "Product Design Intern (Hybytes)",
    date: "OCT 2024",
    details: "6-month intensive framework and interface layout sprint.",
  },
];

export function ProfileSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.aside
            key="profile-panel"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="hidden xl:block fixed left-6 top-1/2 -translate-y-1/2 z-40 w-[320px]"
          >
            <div className="relative rounded-[26px] overflow-hidden">
              {/* Cool blue mesh-gradient glow */}
              <div aria-hidden className="absolute inset-0 -z-10">
                <div className="absolute -top-16 -left-10 w-64 h-64 rounded-full bg-[#A8C8FF] blur-3xl opacity-70" />
                <div className="absolute top-1/3 -right-16 w-72 h-72 rounded-full bg-[#5B9DFF] blur-3xl opacity-60" />
                <div className="absolute -bottom-20 left-10 w-60 h-60 rounded-full bg-[#C5E0FF] blur-3xl opacity-70" />
              </div>

              {/* Icing glass panel */}
              <div className="relative rounded-[26px] bg-white/70 backdrop-blur-2xl border border-white shadow-2xl shadow-slate-900/15 p-6">
                {/* Top-right smiley chip */}
                <button
                  type="button"
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/80 border border-white flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-white transition-colors shadow-sm"
                  aria-label="Mood"
                >
                  <Smile className="w-4 h-4 text-black" strokeWidth={1.6} />
                </button>

                {/* Close toggle */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="absolute top-5 right-14 w-8 h-8 rounded-full bg-white/80 border border-white flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-white transition-colors shadow-sm"
                  aria-label="Close profile panel"
                >
                  <ChevronLeft className="w-4 h-4 text-black" strokeWidth={2} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-4 pr-14">
                  <div className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center overflow-hidden bg-transparent">

                    <img
                      src={girlPleaseLogo}
                      alt="Personal logo"
                      className="w-[70%] h-[70%] object-contain opacity-90"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[17px] font-semibold tracking-tight text-zinc-900 leading-tight truncate">
                      Ana Aguiar
                    </div>
                    <div className="text-[10px] font-medium tracking-[0.14em] uppercase text-zinc-500 mt-1">
                      Product Designer • 24 y/o
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[10.5px] font-medium tracking-tight bg-white/90 text-zinc-700 border border-white/80 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                    Loughborough Graduate
                  </span>
                  <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[10.5px] font-semibold tracking-tight bg-white/90 text-zinc-700 border border-white/80 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                    Sole Designer
                  </span>
                </div>

                {/* Section: Timeline */}
                <SectionHeader icon={ListChecks} label="Timeline" />

                <div className="relative mt-5 pl-6">
                  {/* Vertical track line */}
                  <div
                    aria-hidden
                    className="absolute left-[10px] top-1 bottom-1 w-px"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent, rgba(24,24,27,0.18) 12%, rgba(24,24,27,0.18) 88%, transparent)",
                    }}
                  />

                  <ul className="flex flex-col gap-5">
                    {TIMELINE.map((n, i) => {
                      const Icon = n.icon;
                      return (
                        <li key={i} className="relative">
                          {/* Node icon anchored on the track */}
                          <div
                            className="absolute -left-6 top-0 w-[21px] h-[21px] rounded-[6px] flex items-center justify-center text-black shadow-sm ring-2 ring-zinc-200/70"
                            style={{ background: n.iconBg }}
                          >
                            <Icon className="w-3 h-3" strokeWidth={2.2} />
                          </div>

                          <div className="text-[12.5px] font-medium tracking-tight text-zinc-900 leading-snug">
                            {n.title}
                          </div>
                          <div className="text-[9.5px] font-semibold tracking-[0.14em] uppercase text-zinc-400 mt-1">
                            {n.date}
                          </div>
                          {n.details && (
                            <p className="text-[11.5px] leading-relaxed text-zinc-500 mt-2">
                              {n.details}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Section: Overview */}
                <SectionHeader icon={SlidersHorizontal} label="Overview" />
                <p className="mt-4 text-[11.5px] leading-relaxed text-zinc-600">
                  Operating as the single design engine behind scaling product
                  interfaces. Trusted to take absolute ownership of entire product
                  visuals from day one — navigating fast-paced turnarounds from
                  initial wireframes up to finalized shipping assets.
                </p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Collapsed reopen pill */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          type="button"
          onClick={() => setIsOpen(true)}
          className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 items-center gap-2 pl-2 pr-3 h-10 rounded-full bg-white/70 backdrop-blur-2xl border border-white shadow-2xl shadow-slate-900/15 hover:bg-white/90 transition-colors"
          aria-label="Open profile panel"
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden bg-transparent">
            <img
              src={girlPleaseLogo}
              alt="Logo"
              className="w-[85%] h-[85%] object-contain"
            />
          </div>
          <ChevronRight className="w-4 h-4 text-black" strokeWidth={2} />
        </motion.button>
      )}
    </>
  );
}

function SectionHeader({
  icon: Icon,
  label,
}: {
  icon: typeof ListChecks;
  label: string;
}) {
  return (
    <div className="mt-6 flex items-center gap-2">
      <Icon className="w-3 h-3 text-black" strokeWidth={2} />
      <span className="text-[9.5px] font-semibold tracking-[0.22em] uppercase text-zinc-400">
        {label}
      </span>
      <div className="flex-1 h-px bg-zinc-900/10" />
    </div>
  );
}

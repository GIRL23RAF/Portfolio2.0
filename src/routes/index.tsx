import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import girlPleaseLogo from "@/assets/girl-please.svg";
import { ProjectAccordion, type Project } from "@/components/portfolio/ProjectAccordion";
import { Dock } from "@/components/portfolio/Dock";
import { Marquee } from "@/components/portfolio/Marquee";
import { OdicciWorkspacePicker } from "@/components/portfolio/OdicciWorkspacePicker";
import { OdicciColourPalette } from "@/components/portfolio/OdicciColourPalette";
import { OdicciSignUp } from "@/components/portfolio/OdicciSignUp";
import { OdicciMockup } from "@/components/portfolio/OdicciMockup";
import { ProfileSidebar } from "@/components/portfolio/ProfileSidebar";

export const Route = createFileRoute("/")({
  component: Index,
});

// Master project registry. Drop real content into `content` per tab later.
const PROJECTS: Project[] = [
  {
    id: "01",
    slug: "crcle",
    title: "CRCLE",
    role: "Lead Product Designer/Owner",
    year: "2025",
  },
  {
    id: "02",
    slug: "first-design",
    title: "first design",
    role: "Bending Spoons Hackathon",
    year: "2026",
  },
  {
    id: "03",
    slug: "odicci",
    title: "Odicci",
    role: "Product Team / Core UX",
    year: "2023",
    content: {
      "Create Workspace\u00a0": { customBody: ({ onNextTab }) => <OdicciWorkspacePicker onNext={onNextTab} /> },
      "Brand Personality": { customBody: <OdicciColourPalette /> },
      "V2: Iteration": { customBody: <OdicciSignUp /> },
      "V3: Final Screen": { customBody: <OdicciMockup /> },
    },
  },
  {
    id: "04",
    slug: "ambitious-peace",
    title: "Ambitious peace",
    role: "Creative Director & Visual Lead",
    year: "2022",
  },
];

// Dock buttons map 1:1 to projects above.
const DOCK_ITEMS = [
  { label: "Cr", slug: "crcle" },
  { label: "Fd", slug: "first-design" },
  { label: "Od", slug: "odicci" },
  { label: "Ap", slug: "ambitious-peace" },
];

function Index() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggle = useCallback((slug: string) => {
    setOpenSlug((cur) => (cur === slug ? null : slug));
  }, []);

  // Dock click: open the row (if closed) and smoothly scroll to it.
  const handleDockSelect = useCallback((slug: string) => {
    setOpenSlug(slug);
    // Wait a frame so the accordion begins expanding before we measure.
    requestAnimationFrame(() => {
      const el = rowRefs.current[slug];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-zinc-900 font-sans antialiased overflow-hidden">
      {/* Soft ambient under-glow — orange + blue color pools, slowly breathing beneath the icing layer */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-28 w-[540px] h-[540px] rounded-full bg-blue-400/40 blur-[150px]"
          animate={{ scale: [1, 1.14, 1], opacity: [0.75, 1, 0.75], x: [0, 24, 0], y: [0, -12, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/4 -right-36 w-[580px] h-[580px] rounded-full bg-[#E9582C]/35 blur-[170px]"
          animate={{ scale: [1.05, 0.95, 1.05], opacity: [0.8, 1, 0.8], x: [0, -28, 0], y: [0, 18, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.div
          className="absolute bottom-[-12%] left-1/4 w-[620px] h-[620px] rounded-full bg-sky-400/35 blur-[170px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.95, 0.7], x: [0, 34, 0], y: [0, 24, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] rounded-full bg-orange-300/40 blur-[130px]"
          animate={{ scale: [1, 1.18, 1], opacity: [0.65, 0.95, 0.65], x: [0, -18, 0], y: [0, -14, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      {/* Floating split-pill contact button — locked top-right, elevated above all page content */}
      <div
        className="fixed top-6 right-8 z-[100] flex items-center gap-[4px] p-[4px] rounded-[16px] bg-black/[0.08] backdrop-blur-md border border-zinc-200/40 shadow-lg shadow-black/5"
      >
        {/* Left segment — logo block */}
        <div className="w-9 h-9 flex items-center justify-center shrink-0 bg-zinc-950 rounded-[12px]">
          <img src={girlPleaseLogo} alt="Logo" className="w-[70%] h-[70%] object-contain invert" />
        </div>
        {/* Right segment — action button */}
        <a
          href="mailto:hello@example.com"
          className="px-5 h-9 flex items-center justify-center bg-[#E9582C] text-zinc-950 text-xs font-semibold tracking-tight rounded-[12px] hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          Contact Me
        </a>
      </div>

      {/* Hero */}
      <header className="pt-32 pb-24 px-6 text-center">
        <div className="text-[11px] font-medium tracking-[0.22em] uppercase text-zinc-500">
          Selected Work • Portfolio
        </div>
        <h1 className="text-5xl font-medium tracking-tight max-w-3xl mx-auto text-zinc-900 mt-4 leading-tight whitespace-pre-line">
          Hi..{"\u00a0"}{"\n"}I do Design.
        </h1>
        <p className="text-zinc-500 text-sm mt-4 max-w-xl mx-auto leading-relaxed">
          A single, fluidly scrolling page. Expand any project to step through the exploration,
          the iteration, and a live interactive prototype.
        </p>
      </header>

      {/* Accordion index */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        {/* Icing panel — semi-opaque frosted sheet with hyper-thin bright bevel edge */}
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-2xl shadow-slate-200/50 px-2 md:px-6">
          {PROJECTS.map((p) => (
            <ProjectAccordion
              key={p.slug}
              ref={(el) => {
                rowRefs.current[p.slug] = el;
              }}
              project={p}
              isOpen={openSlug === p.slug}
              onToggle={() => toggle(p.slug)}
            />
          ))}
        </div>
      </section>

      {/* Bottom marquee showcase */}
      <Marquee />

      {/* Spacer so dock doesn't sit on top of content */}
      <div className="h-24" />

      {/* Floating macOS-style dock */}
      <Dock items={DOCK_ITEMS} onSelect={handleDockSelect} activeSlug={openSlug} />

      {/* Floating profile sidebar (Clay-style card) */}
      <ProfileSidebar />
    </div>
  );
}

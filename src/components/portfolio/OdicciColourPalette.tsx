import { motion } from "framer-motion";
import { ChevronDown, Sun, Moon, Brush, Figma } from "lucide-react";
import { useMemo, useState } from "react";
import odicciBadge from "@/assets/odicci-badge.png";

/**
 * OdicciColourPalette — step 3/7 of the Odicci onboarding wizard.
 * Shares the exact browser chrome + twilight canvas + frosted glass panel
 * design system as OdicciWorkspacePicker (step 1) and CreateWorkspacePanel
 * (step 2). Supports the same light / dark theme toggle.
 */

const ACCENT = "#E9582C";

const DARK_BG =
  "linear-gradient(135deg, #1e3a5f 0%, #2b4a7a 40%, #3a5a8a 70%, #4a6a9a 100%)";
const LIGHT_BG =
  "linear-gradient(135deg, #f7fbff 0%, #eef6ff 50%, #e6f4fe 100%)";

const GRID_DARK = {
  backgroundImage:
    "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px), linear-gradient(45deg, transparent 49.5%, rgba(255,255,255,0.4) 49.5%, rgba(255,255,255,0.4) 50.5%, transparent 50.5%), linear-gradient(-45deg, transparent 49.5%, rgba(255,255,255,0.4) 49.5%, rgba(255,255,255,0.4) 50.5%, transparent 50.5%)",
  backgroundSize: "72px 72px, 72px 72px, 72px 72px, 72px 72px",
};
const GRID_LIGHT = {
  backgroundImage:
    "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(45deg, transparent 49.5%, rgba(0,0,0,0.12) 49.5%, rgba(0,0,0,0.12) 50.5%, transparent 50.5%), linear-gradient(-45deg, transparent 49.5%, rgba(0,0,0,0.12) 49.5%, rgba(0,0,0,0.12) 50.5%, transparent 50.5%)",
  backgroundSize: "72px 72px, 72px 72px, 72px 72px, 72px 72px",
};

interface Palette {
  name: string;
  colors: [string, string, string];
}

const PALETTES: Palette[] = [
  { name: "Orange", colors: ["#F97316", "#FB8C3C", "#FDBA74"] },
  { name: "Blue", colors: ["#0356E5", "#0561FF", "#4D8EFF"] },
  { name: "Pink", colors: ["#EC489A", "#F472B6", "#FB7DBC"] },
  { name: "Red", colors: ["#F9161A", "#FF2D31", "#FC3C4F"] },
  { name: "Purple", colors: ["#BB9FFA", "#8B5CF7", "#5810FF"] },
  { name: "Custom", colors: ["#3B9EFF", "#004074", "#FF5126"] },
];

type SlotKey = "background" | "primary" | "secondary" | "accent";
interface Slot {
  key: SlotKey;
  label: string;
  color: string;
  opacity: number;
}

export function OdicciColourPalette() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selectedPalette, setSelectedPalette] = useState<string>("Custom");
  const [slots, setSlots] = useState<Slot[]>([
    { key: "background", label: "Background", color: "#FFFFFF", opacity: 100 },
    { key: "primary", label: "Primary Colour", color: "#6466F1", opacity: 100 },
    { key: "secondary", label: "Secondary Colour", color: "#9294FE", opacity: 100 },
    { key: "accent", label: "Accent Colour", color: "#E9582C", opacity: 100 },
  ]);

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const applyPalette = (p: Palette) => {
    setSelectedPalette(p.name);
    setSlots((prev) =>
      prev.map((s) => {
        if (s.key === "primary") return { ...s, color: p.colors[0] };
        if (s.key === "secondary") return { ...s, color: p.colors[1] };
        if (s.key === "accent") return { ...s, color: p.colors[2] };
        return s;
      }),
    );
  };

  const updateColor = (key: SlotKey, color: string) =>
    setSlots((prev) => prev.map((s) => (s.key === key ? { ...s, color } : s)));

  const primary = slots.find((s) => s.key === "primary")!;
  const secondary = slots.find((s) => s.key === "secondary")!;
  const accent = slots.find((s) => s.key === "accent")!;

  const panel = isDark
    ? "bg-white/[0.04] border-white/12"
    : "bg-white/25 border-white/50";
  const textMain = isDark ? "text-white" : "text-zinc-900";
  const textSub = isDark ? "text-white/70" : "text-zinc-500";
  const textMuted = isDark ? "text-white/55" : "text-zinc-500";
  const rowBg = isDark
    ? "bg-white/[0.06] border-white/12"
    : "bg-white/70 border-zinc-900/10";

  const activeName = useMemo(() => selectedPalette, [selectedPalette]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 bg-white">
      {/* Browser chrome */}
      <div className="flex items-center h-10 px-4 border-b border-zinc-200 bg-white">
        <div className="flex items-center gap-[7px]">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 pl-5 flex items-end h-full">
          <div className="flex items-center gap-2 h-8 px-3.5 rounded-t-lg border-t border-x border-zinc-200 bg-zinc-100">
            <span className="w-3.5 h-3.5 rounded-full" style={{ background: ACCENT }} />
            <span className="text-[12px] font-medium text-zinc-900 tracking-tight">
              odicci | Brand Personality
            </span>
            <span className="ml-1 text-zinc-500 text-[10px]">✕</span>
          </div>
        </div>
        <div className="text-[11px] font-mono text-zinc-500 tabular-nums">3/7</div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 h-11 px-3 border-b border-zinc-200 bg-white">
        <ChevronDown className="w-4 h-4 text-zinc-400 rotate-90" />
        <ChevronDown className="w-4 h-4 text-zinc-900 -rotate-90" />
        <div className="flex-1 flex items-center gap-2 h-[30px] px-3 rounded-lg border border-zinc-200 bg-zinc-100">
          <span className="text-[13px] text-zinc-500 tracking-tight">odicci.com/onboarding/brand</span>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Canvas */}
      <div
        className={
          "relative aspect-[1512/780] overflow-hidden transition-colors duration-300 " +
          (isDark ? "bg-[#1e3a5f]" : "bg-[#E6F4FE]")
        }
      >
        <div className="absolute inset-0 transition-opacity duration-300" style={{ background: DARK_BG, opacity: isDark ? 1 : 0 }} />
        <div className="absolute inset-0 transition-opacity duration-300" style={{ background: LIGHT_BG, opacity: isDark ? 0 : 1 }} />
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{ ...GRID_DARK, opacity: isDark ? 0.08 : 0 }} />
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{ ...GRID_LIGHT, opacity: isDark ? 0 : 0.06 }} />

        {/* Ambient blobs */}
        <motion.div
          className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{ backgroundColor: isDark ? "rgba(255,255,255,0.3)" : "rgba(200,220,240,0.35)", filter: "blur(60px)" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ backgroundColor: isDark ? "rgba(233,88,44,0.33)" : "rgba(200,220,240,0.25)", filter: "blur(90px)" }}
          animate={{ scale: [1.05, 0.95, 1.05], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />

        {/* Odicci logo */}
        <div className="absolute top-[4%] left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          <img src={odicciBadge} alt="" className="w-4 h-4" />
          <span className={`text-[18px] font-semibold tracking-tight ${textMain}`}>odicci</span>
        </div>

        {/* Content panel */}
        <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[82%]">
          <div className={`relative rounded-[20px] ${panel} backdrop-blur-2xl shadow-2xl shadow-black/20 p-4 md:p-5 transition-colors duration-300`}>
            {/* rim highlight */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background: isDark
                  ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
              }}
            />

            {/* Header */}
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <h2 className={`text-[17px] md:text-[20px] font-semibold tracking-tight leading-tight ${textMain}`}>
                  Let's add your brand personality
                </h2>
                <p className={`text-[11px] md:text-[12px] mt-1 ${textSub}`}>
                  So every experience feels 100% on-brand
                </p>
              </div>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shrink-0"
                style={{ background: ACCENT }}
              >
                <Brush className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* 50/50 grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* LEFT — Live preview with checkered frame */}
              <div
                className={`relative rounded-2xl overflow-hidden flex flex-col transition-colors duration-300 ${
                  isDark ? "border border-white/15" : "border border-zinc-900/10"
                } bg-white`}
              >
                <div className="px-4 py-2.5 flex items-center gap-1.5 border-b border-zinc-200/70">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 text-[10px] text-zinc-500">Live preview</span>
                </div>
                <div
                  className="relative flex-1 p-5 flex items-center justify-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, #F1F5F9 25%, transparent 25%), linear-gradient(-45deg, #F1F5F9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #F1F5F9 75%), linear-gradient(-45deg, transparent 75%, #F1F5F9 75%)",
                    backgroundSize: "16px 16px",
                    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <div className="w-full max-w-[320px] rounded-xl overflow-hidden shadow-lg border border-zinc-200 bg-white">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-200">
                      <div
                        className="w-6 h-6 rounded-md transition-colors duration-500"
                        style={{ background: primary.color }}
                      />
                      <div className="text-[11px] text-zinc-800 font-medium">Workspace Name</div>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-semibold transition-colors duration-500"
                        style={{ background: accent.color }}
                      >
                        A
                      </div>
                    </div>
                    <div className="p-4 bg-[#F9FAFB]">
                      <div
                        className="w-full aspect-[16/9] rounded-lg flex flex-col items-center justify-center gap-1.5 text-white transition-colors duration-500"
                        style={{ background: secondary.color }}
                      >
                        <Figma className="w-6 h-6" strokeWidth={1.6} />
                        <div className="text-[10px] opacity-90">Drop a Figma file to import</div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: `${primary.color}33` }}>
                          <div className="h-full w-2/3 rounded-full" style={{ background: primary.color }} />
                        </div>
                        <div
                          className="h-6 px-2.5 rounded-md text-[10px] font-medium text-white flex items-center transition-colors duration-500"
                          style={{ background: accent.color }}
                        >
                          Continue
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT — Palette selector + tokens */}
              <div className="flex flex-col gap-4 min-w-0">
                {/* Suggested palettes */}
                <div>
                  <div className={`text-[12px] font-medium mb-2 ${textMain}`}>Suggested palettes</div>
                  <div className="grid grid-cols-3 gap-2">
                    {PALETTES.map((p) => {
                      const active = p.name === activeName;
                      return (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => applyPalette(p)}
                          className="group flex flex-col items-center gap-1.5 focus:outline-none"
                        >
                          <div
                            className={`w-full rounded-full p-1 flex items-center justify-between gap-0.5 transition-all border ${
                              active
                                ? isDark
                                  ? "bg-white/20 border-white/60"
                                  : "bg-white border-zinc-900/30"
                                : isDark
                                  ? "bg-white/[0.06] border-white/15 group-hover:bg-white/[0.12]"
                                  : "bg-white/60 border-zinc-900/10 group-hover:bg-white"
                            }`}
                          >
                            {p.colors.map((c, i) => (
                              <div
                                key={i}
                                className="flex-1 aspect-square rounded-full"
                                style={{ background: c, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)" }}
                              />
                            ))}
                          </div>
                          <div className={`text-[10px] ${textMuted}`}>{p.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Colour tokens */}
                <div className="flex flex-col gap-2">
                  <div className={`text-[12px] font-medium ${textMain}`}>Colours</div>
                  <div className="flex flex-col gap-2">
                    {slots.map((s) => (
                      <div
                        key={s.key}
                        className={`flex items-center gap-2.5 h-10 rounded-lg border px-2.5 transition-colors duration-300 ${rowBg}`}
                      >
                        <label className="relative w-5 h-5 rounded-full overflow-hidden cursor-pointer shrink-0 shadow-inner"
                          style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)" }}
                        >
                          <div className="absolute inset-0 transition-colors duration-500" style={{ background: s.color }} />
                          <input
                            type="color"
                            value={s.color}
                            onChange={(e) => updateColor(s.key, e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </label>
                        <div className={`text-[11px] font-medium tracking-wide ${textSub} w-[110px] shrink-0`}>
                          {s.label}
                        </div>
                        <input
                          value={s.color.toUpperCase()}
                          onChange={(e) => updateColor(s.key, e.target.value)}
                          className={`flex-1 min-w-0 bg-transparent outline-none text-[12px] font-mono tracking-wide ${textMain}`}
                        />
                        <div className={`w-px h-4 ${isDark ? "bg-white/15" : "bg-zinc-900/10"}`} />
                        <div className={`text-[11px] font-mono tabular-nums w-10 text-right ${textMuted}`}>
                          {s.opacity}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    className={`h-9 px-4 rounded-full text-[12px] font-medium transition-colors duration-300 ${
                      isDark
                        ? "border border-white/20 bg-white/[0.06] text-white hover:bg-white/[0.12]"
                        : "border border-zinc-900/15 bg-white/70 text-zinc-900 hover:bg-white"
                    }`}
                  >
                    Go back
                  </button>
                  {/* Step indicator */}
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${i === 2 ? "w-5" : "w-1.5"}`}
                        style={{
                          background:
                            i === 2 ? ACCENT : isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.15)",
                        }}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="h-9 px-5 rounded-full text-[12px] font-medium text-white shadow-lg shadow-black/20 hover:brightness-110 transition"
                    style={{ background: ACCENT }}
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
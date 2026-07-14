import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, ChevronDown, Check, X, Sun, Moon, Upload, HelpCircle, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";
import odicciBadge from "@/assets/odicci-badge.png";

/**
 * OdicciWorkspacePicker — pixel-faithful rebuild of the "Choose a workspace"
 * onboarding screen (step 1/7) from the Figma frame, now with a live
 * light / dark theme toggle.
 *
 * Wrapped in a macOS-style browser chrome (title bar + tab + URL toolbar).
 * The canvas below swaps between a deep twilight gradient and a crisp light
 * gradient, with a frosted-glass card that lists selectable workspaces.
 */

const ACCENT = "#E9582C";

interface Workspace {
  initials: string;
  name: string;
  plan: string;
  members: string;
  color: string; // avatar bg
}

const WORKSPACES: Workspace[] = [
  { initials: "AC", name: "Acme Corporation", plan: "Enterprise Plan", members: "45 members", color: "#1E5FD8" },
  { initials: "TS", name: "TechStart Studios", plan: "Pro Plan", members: "12 members", color: ACCENT },
  { initials: "CL", name: "Creative Labs", plan: "Team Plan", members: "8 members", color: "#1F2937" },
  { initials: "PW", name: "Personal Workspace", plan: "Free Plan", members: "1 member", color: "#4B5563" },
];

interface Integration {
  id: string;
  name: string;
  color: string;
  letter: string;
}

const INTEGRATIONS: Integration[] = [
  { id: "shopify", name: "Shopify", color: "#95BF47", letter: "S" },
  { id: "klaviyo", name: "Klaviyo", color: "#000000", letter: "K" },
  { id: "magento", name: "Magento", color: "#EE672F", letter: "M" },
  { id: "omnisend", name: "Omnisend", color: "#1F2937", letter: "O" },
];

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

export function OdicciWorkspacePicker({ onNext }: { onNext?: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [draftSelected, setDraftSelected] = useState<string[]>([]);
  const [savedSelected, setSavedSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [step, setStep] = useState<"picker" | "create">("picker");
  const [companyName, setCompanyName] = useState("");

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const openModal = () => {
    setDraftSelected(savedSelected);
    setQuery("");
    setModalOpen(true);
  };

  const toggle = (id: string) =>
    setDraftSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const save = () => {
    setSavedSelected(draftSelected);
    setModalOpen(false);
    if (draftSelected.length > 0) {
      // transition to create workspace screen
      setTimeout(() => setStep("create"), 250);
    }
  };

  const filtered = INTEGRATIONS.filter((i) =>
    i.name.toLowerCase().includes(query.toLowerCase())
  );

  const savedIntegrations = INTEGRATIONS.filter((i) =>
    savedSelected.includes(i.id)
  );
  const canCreate = savedIntegrations.length > 0;

  const panel = isDark
    ? "bg-white/[0.02] border-white/10"
    : "bg-white/15 border-white/35";
  const textMain = isDark ? "text-white" : "text-zinc-900";
  const textSub = isDark ? "text-white/70" : "text-zinc-500";
  const textMuted = isDark ? "text-white/60" : "text-zinc-500";

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 bg-white">
      {/* Browser chrome — title bar with traffic lights, tab, step counter */}
      <div className="flex items-center h-10 px-4 border-b border-zinc-200 bg-white">
        <div className="flex items-center gap-[7px]">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-inner" />
          <span className="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-inner" />
          <span className="w-3 h-3 rounded-full bg-[#28C840] shadow-inner" />
        </div>
        <div className="flex-1 pl-5 flex items-end h-full">
          <div className="flex items-center gap-2 h-8 px-3.5 rounded-t-lg border-t border-x border-zinc-200 bg-zinc-100">
            <span className="w-3.5 h-3.5 rounded-full" style={{ background: ACCENT }} />
            <span className="text-[12px] font-medium text-zinc-900 tracking-tight">
              odicci | Workspace Setup
            </span>
            <span className="ml-1 text-zinc-500 text-[10px]">✕</span>
          </div>
          <span className="w-7 h-7 flex items-center justify-center text-zinc-800 text-base leading-none">
            +
          </span>
        </div>
        <div className="text-[11px] font-mono text-zinc-500 tabular-nums">1/7</div>
      </div>

      {/* Toolbar — nav arrows, refresh, URL bar, theme toggle */}
      <div className="flex items-center gap-2 h-11 px-3 border-b border-zinc-200 bg-white">
        <ChevronDown className="w-4 h-4 text-zinc-400 rotate-90" />
        <ChevronDown className="w-4 h-4 text-zinc-900 -rotate-90" />
        <button className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100">
          <RefreshGlyph />
        </button>
        <div className="flex-1 flex items-center gap-2 h-[30px] px-3 rounded-lg border border-zinc-200 bg-zinc-100">
          <LockGlyph />
          <span className="text-[13px] text-zinc-500 tracking-tight">odicci.com/onboarding</span>
        </div>
        <span className="text-zinc-500 text-base tracking-widest leading-none">···</span>
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
          "relative aspect-[1512/860] overflow-hidden transition-colors duration-300 " +
          (isDark ? "bg-[#1e3a5f]" : "bg-[#E6F4FE]")
        }
      >
        {/* Gradient background crossfade */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ background: DARK_BG, opacity: isDark ? 1 : 0 }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ background: LIGHT_BG, opacity: isDark ? 0 : 1 }}
        />

        {/* Technical isometric grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{ ...GRID_DARK, opacity: isDark ? 0.08 : 0 }}
        />
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{ ...GRID_LIGHT, opacity: isDark ? 0 : 0.06 }}
        />

        {/* Ambient glow blobs (breathing) */}
        <motion.div
          className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full pointer-events-none transition-colors duration-300"
          style={{
            backgroundColor: isDark ? "rgba(255,255,255,0.35)" : "rgba(200,220,240,0.35)",
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none transition-colors duration-300"
          style={{
            backgroundColor: isDark ? "rgba(233,88,44,0.33)" : "rgba(200,220,240,0.25)",
            filter: "blur(90px)",
          }}
          animate={{ scale: [1.05, 0.95, 1.05], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/4 w-[560px] h-[560px] rounded-full pointer-events-none transition-colors duration-300"
          style={{
            backgroundColor: isDark ? "rgba(233,88,44,0.27)" : "rgba(200,220,240,0.20)",
            filter: "blur(80px)",
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        {/* Odicci logo — top center */}
        <div className="absolute top-[6%] left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          <img src={odicciBadge} alt="" className="w-5 h-5" />
          <span className={`text-[22px] font-semibold tracking-tight transition-colors duration-300 ${textMain}`}>
            odicci
          </span>
        </div>

        {/* Center glass card + footer — locked together in a single centered column so the footer sits directly below the frame */}
        {step === "picker" && (
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[86%] flex flex-col gap-3">
          <div
            className={`relative overflow-hidden rounded-[28px] ${panel} backdrop-blur-2xl shadow-2xl shadow-black/20 px-8 md:px-12 py-6 md:py-8 transition-colors duration-300`}
          >
            {/* Static top-edge highlight (glass rim) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background: isDark
                  ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
              }}
            />
            {/* Soft inner top glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-24"
              style={{
                background: isDark
                  ? "linear-gradient(180deg, rgba(255,255,255,0.10), transparent)"
                  : "linear-gradient(180deg, rgba(255,255,255,0.55), transparent)",
              }}
            />
            {/* Moving diagonal specular reflection */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-y-8 w-[45%] -skew-x-12"
              style={{
                background: isDark
                  ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.08) 55%, transparent)"
                  : "linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0.35) 55%, transparent)",
                mixBlendMode: "screen",
              }}
              initial={{ x: "-60%" }}
              animate={{ x: "220%" }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            />
            <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-8 md:gap-12 items-start">
              {/* Left — heading */}
              <div className="flex flex-col justify-start min-w-0">
                <h2 className={`text-[26px] md:text-[30px] font-semibold tracking-tight leading-[1.15] whitespace-nowrap transition-colors duration-300 ${textMain}`}>
                  Choose a workspace
                </h2>
                <p className={`text-sm md:text-[15px] mt-1.5 transition-colors duration-300 ${textSub}`}>
                  to continue to Odicci
                </p>
              </div>

              {/* Right — search + list */}
              <div className="flex flex-col min-w-0">
                <div
                  className={`flex items-center gap-2 h-11 rounded-full px-4 transition-colors duration-300 ${
                    isDark
                      ? "border border-white/20 bg-white/[0.06]"
                      : "border border-zinc-900/10 bg-white/70"
                  }`}
                >
                  <Search className={`w-4 h-4 transition-colors duration-300 ${isDark ? "text-white/50" : "text-zinc-500"}`} />
                  <input
                    placeholder="Search search workspaces"
                    className={`flex-1 min-w-0 bg-transparent text-[13px] outline-none transition-colors duration-300 ${
                      isDark
                        ? "text-white placeholder-white/50"
                        : "text-zinc-900 placeholder-zinc-500"
                    }`}
                  />
                </div>

                <ul className={`mt-2 divide-y transition-colors duration-300 ${isDark ? "divide-white/10" : "divide-zinc-900/10"}`}>
                  {WORKSPACES.map((w) => (
                    <motion.li
                      key={w.initials}
                      whileHover={{ x: 2 }}
                      className="flex items-center gap-3 py-2 cursor-pointer group"
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-semibold shrink-0"
                        style={{ background: w.color }}
                      >
                        {w.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[13px] font-medium tracking-tight truncate transition-colors duration-300 ${textMain}`}>
                          {w.name}
                        </div>
                        <div className={`text-[11px] tracking-tight truncate transition-colors duration-300 ${textMuted}`}>
                          {w.plan} · {w.members}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Divider + create new */}
            <div className={`mt-3 pt-3 flex items-center justify-between gap-4 transition-colors duration-300 ${isDark ? "border-t border-white/10" : "border-t border-zinc-900/10"}`}>
              <button
                type="button"
                onClick={() => setStep("create")}
                className={`flex items-center gap-2 text-[13px] tracking-tight transition-colors duration-300 ${
                  isDark
                    ? "text-white/85 hover:text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Plus className="w-4 h-4" />
                Create new workspace
              </button>

              {savedIntegrations.length > 0 && (
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-[11px] tracking-tight hidden md:inline transition-colors duration-300 ${textMuted}`}>
                    Integrations
                  </span>
                  <div className="flex items-center -space-x-2">
                    {savedIntegrations.map((i) => (
                      <motion.div
                        key={i.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-white text-[11px] font-semibold shadow-md transition-colors duration-300 ${
                          isDark ? "border-white/20" : "border-white/60"
                        }`}
                        style={{ background: i.color }}
                        title={i.name}
                      >
                        {i.letter}
                      </motion.div>
                    ))}
                  </div>
                  <motion.button
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    type="button"
                    disabled={!canCreate}
                    className="h-8 px-3 rounded-full text-[12px] font-medium text-white shadow-lg shadow-black/20 transition-transform hover:scale-[1.02]"
                    style={{ background: ACCENT }}
                  >
                    Create workspace →
                  </motion.button>
                </div>
              )}
            </div>
            </div>
          </div>

          {/* Footer — sits directly below the glass card, sharing the same 86% width */}
          <div className={`flex items-center justify-between text-[12px] transition-colors duration-300 ${textSub}`}>
            <button className={`flex items-center gap-1 transition-colors duration-300 ${isDark ? "hover:text-white" : "hover:text-zinc-900"}`}>
              English (United Kingdom) <ChevronDown className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-2">
              <span className={`cursor-pointer transition-colors duration-300 ${isDark ? "hover:text-white" : "hover:text-zinc-900"}`}>Privacy Policy</span>
              <span className={`transition-colors duration-300 ${isDark ? "text-white/40" : "text-zinc-400"}`}>•</span>
              <span className={`cursor-pointer transition-colors duration-300 ${isDark ? "hover:text-white" : "hover:text-zinc-900"}`}>Terms of Service</span>
            </div>
          </div>
        </div>
        )}

        {/* Bottom Add Integration pill — clamped to bottom, no bottom radius */}
        {step === "picker" && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[86%]">
          <button
            type="button"
            onClick={openModal}
            className={`w-full h-11 rounded-t-2xl rounded-b-none border border-b-0 backdrop-blur-xl text-[13px] font-medium tracking-tight flex items-center justify-center gap-2 transition-colors duration-300 ${
              isDark
                ? "border-white/25 bg-white/[0.10] text-white hover:bg-white/[0.14]"
                : "border-white/80 bg-white/70 text-zinc-900 hover:bg-white/90"
            }`}
          >
            <Plus className="w-4 h-4" /> Add Integration
          </button>
        </div>
        )}

        {/* Create workspace — step 2/7 */}
        {step === "create" && (
          <CreateWorkspacePanel
            isDark={isDark}
            textMain={textMain}
            textSub={textSub}
            companyName={companyName}
            setCompanyName={setCompanyName}
            onBack={() => setStep("picker")}
            onNext={onNext}
          />
        )}

        {/* Integrations modal */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              className="absolute inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`absolute inset-0 backdrop-blur-sm transition-colors duration-300 ${
                  isDark ? "bg-black/50" : "bg-black/10"
                }`}
                onClick={() => setModalOpen(false)}
              />
              <motion.div
                initial={{ scale: 0.96, y: 8, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.96, y: 8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="relative w-[92%] max-w-[560px] flex flex-col items-end gap-2"
              >
                {/* Separate close pill above the card */}
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`w-11 h-11 rounded-full backdrop-blur-xl flex items-center justify-center transition-colors duration-300 ${
                    isDark
                      ? "border border-white/30 bg-white/10 text-white/90 hover:bg-white/20"
                      : "border border-zinc-900/20 bg-white/70 text-zinc-900 hover:bg-white"
                  }`}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Glass card */}
                <div
                  className={`w-full rounded-2xl backdrop-blur-[40px] shadow-2xl shadow-black/40 p-3.5 transition-colors duration-300 ${
                    isDark ? "bg-white/[0.05] border border-white/15" : "bg-white/60 border border-white/70"
                  }`}
                >
                  {/* Header row */}
                  <div className="flex items-center justify-between px-1 pt-1 pb-3">
                    <h3 className={`text-[16px] font-normal tracking-tight transition-colors duration-300 ${textMain}`}>
                      Add following integrations to your stack
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[13px] transition-colors duration-300 ${textMain}`}>Active</span>
                      <span
                        className={`relative w-7 h-3.5 rounded-full flex items-center justify-end px-0.5 transition-colors duration-300 ${
                          isDark ? "bg-white" : "bg-zinc-900"
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full shadow transition-colors duration-300 ${isDark ? "bg-[#627C92]" : "bg-white"}`} />
                      </span>
                    </div>
                  </div>

                  {/* Inner bordered container */}
                  <div
                    className={`rounded-xl p-3 flex flex-col gap-3 transition-colors duration-300 ${
                      isDark ? "border border-white/25" : "border border-zinc-900/10"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 h-9 rounded-full px-3 transition-colors duration-300 ${
                        isDark
                          ? "border border-white/25 bg-white/[0.12]"
                          : "border border-zinc-900/10 bg-white/70"
                      }`}
                    >
                      <Search className={`w-4 h-4 transition-colors duration-300 ${isDark ? "text-white" : "text-zinc-900"}`} />
                      <input
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search Integrations"
                        className={`flex-1 bg-transparent text-[14px] outline-none transition-colors duration-300 ${
                          isDark
                            ? "text-white placeholder-white/50"
                            : "text-zinc-900 placeholder-zinc-500"
                        }`}
                      />
                    </div>

                    <div className={`h-px transition-colors duration-300 ${isDark ? "bg-white/20" : "bg-zinc-900/10"}`} />

                    <ul className="flex flex-col gap-2">
                      {filtered.map((i) => {
                        const checked = draftSelected.includes(i.id);
                        return (
                          <li key={i.id}>
                            <button
                              type="button"
                              onClick={() => toggle(i.id)}
                              className="w-full flex items-center gap-2.5 text-left group"
                            >
                              <span
                                className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                  checked
                                    ? "border-transparent"
                                    : `${isDark ? "border-white/30" : "border-zinc-900/30"} group-hover:${isDark ? "border-white/60" : "border-zinc-900/60"}`
                                }`}
                                style={checked ? { background: ACCENT } : undefined}
                              >
                                {checked && (
                                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                )}
                              </span>
                              <span className={`text-[15px] font-normal tracking-tight transition-colors duration-300 ${textMain}`}>
                                {i.name}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                      {filtered.length === 0 && (
                        <li className={`py-4 text-center text-[13px] transition-colors duration-300 ${textMuted}`}>
                          No integrations match "{query}"
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Integration added row */}
                  <div className="flex items-center justify-end gap-1.5 pt-3 pr-1">
                    {draftSelected.length > 0 && (
                      <Check className="w-4 h-4 text-[#01BB74]" strokeWidth={3} />
                    )}
                    <span className={`text-[12px] transition-colors duration-300 ${textMain}`}>
                      {draftSelected.length > 0
                        ? `${draftSelected.length} integration${draftSelected.length === 1 ? "" : "s"} added`
                        : "No integrations added"}
                    </span>
                  </div>
                </div>

                {/* Separate Save Integration pill button */}
                <button
                  type="button"
                  onClick={save}
                  className="h-11 px-6 rounded-[20px] text-white text-[15px] font-normal shadow-lg shadow-black/30 hover:brightness-110 transition"
                  style={{ background: "#FF5126" }}
                >
                  Save Integration
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function RefreshGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M12 7c0 2.76-2.24 5-5 5S2 9.76 2 7s2.24-5 5-5c1.38 0 2.63.56 3.54 1.46M10 2v3H7"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="1.5" y="5.5" width="9" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.1" className="text-zinc-500" />
      <path d="M3.5 5.5V3.5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.1" className="text-zinc-500" strokeLinecap="round" />
    </svg>
  );
}

interface CreateWorkspacePanelProps {
  isDark: boolean;
  textMain: string;
  textSub: string;
  textMuted: string;
  companyName: string;
  setCompanyName: (v: string) => void;
  onBack: () => void;
  onNext?: () => void;
}

/**
 * CreateWorkspacePanel — step 2/7 of onboarding. Rebuilt from the Figma
 * "Create Workspace_Fallback_Error" frame: a two-column layout pairing the
 * empty-state "Odicci workspaces" window (left) with the workspace creation
 * form, including the company-name validation error state shown in the design.
 */
function CreateWorkspacePanel({
  isDark,
  textMain,
  textSub,
  companyName,
  setCompanyName,
  onBack,
  onNext,
}: CreateWorkspacePanelProps) {
  const [timezone, setTimezone] = useState("Europe/London (GMT/BST)");
  const [companySize, setCompanySize] = useState("");
  const [hearAbout, setHearAbout] = useState("");
  const [useLogo, setUseLogo] = useState(true);
  const [touched, setTouched] = useState(false);

  const showError = touched && companyName.trim().length === 0;
  const initial = (companyName.trim()[0] || "W").toUpperCase();

  const inputBase =
    "w-full rounded-[10px] px-3 py-3 text-[14px] outline-none transition-colors duration-300";
  const inputTheme = isDark
    ? "bg-white/20 text-white placeholder-white/50"
    : "bg-white/70 border border-zinc-900/10 text-zinc-900 placeholder-zinc-500";
  const helpIconClass = isDark ? "text-white/40" : "text-zinc-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[1100px] max-h-[86%]"
    >
      <div className="flex flex-col lg:flex-row items-stretch gap-5 lg:gap-8 h-full min-h-0">
        {/* LEFT — "Odicci workspaces" window, empty/fallback state */}
        <div className="hidden lg:flex flex-col w-[38%] shrink-0 rounded-xl overflow-hidden border border-[#205D9E]/50 shadow-xl shadow-black/20 h-full max-h-[520px]">
          <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-white shrink-0">
            <div className="w-6 h-6 rounded bg-zinc-200 shrink-0" />
            <span className="flex-1 text-center text-[13px] text-zinc-900 truncate">Odicci workspaces</span>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[12px] shrink-0"
              style={{ background: "#FF5126" }}
            >
              A
            </div>
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center p-8 bg-[#F9FAFB]/80">
            <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
              <FigmaLinkIcon className="w-9 h-9 text-zinc-900" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px self-stretch bg-gradient-to-b from-white/5 via-white/50 to-white/5" />

        {/* RIGHT — Create workspace form */}
        <div
          className={`flex-1 min-w-0 rounded-3xl border p-5 md:p-6 flex flex-col gap-6 md:gap-8 backdrop-blur-sm h-full overflow-y-auto transition-colors duration-300 ${
            isDark ? "border-white bg-[rgba(0,50,90,0.20)]" : "border-white/70 bg-white/60"
          }`}
        >
          {/* Header */}
          <div className="flex flex-col gap-0.5">
            <h2 className={`text-[22px] md:text-[26px] font-normal leading-tight transition-colors duration-300 ${textMain}`}>
              Create your workspace
            </h2>
            <p className={`text-[14px] md:text-[16px] transition-colors duration-300 ${isDark ? "text-[#A3AEBB]" : textSub}`}>
              Set up your workspace to get started with Odicci
            </p>
          </div>

          <div className="flex flex-col gap-5 md:gap-6">
            {/* Logo uploader */}
            <div className="flex flex-col gap-2">
              <label className={`text-[12px] transition-colors duration-300 ${textMain}`}>Upload your company logo</label>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 md:w-[52px] md:h-[52px] rounded-full flex items-center justify-center text-white text-[18px] shrink-0"
                  style={{ background: "linear-gradient(135deg, #FF6900 0%, #F54900 100%)" }}
                >
                  {initial}
                </div>
                <button
                  type="button"
                  className="flex-1 h-10 md:h-11 rounded-lg border border-zinc-200 bg-white text-zinc-900 text-[13px] md:text-[14px] flex items-center justify-center gap-2 hover:bg-zinc-50 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-zinc-500" /> Upload Image
                </button>
                <button
                  type="button"
                  className="h-10 md:h-11 px-3.5 rounded-lg text-[13px] md:text-[14px] shrink-0 transition-colors"
                  style={{ background: "#E2E6EA", color: "#7A838C" }}
                >
                  Remove
                </button>
              </div>
              <p className={`text-[11px] transition-colors duration-300 ${isDark ? "text-white/60" : "text-zinc-500"}`}>
                *Png, *.jpeg files up to 10MB at least 400px by 400px
              </p>

              {/* Use this logo checkbox */}
              <button
                type="button"
                onClick={() => setUseLogo((v) => !v)}
                className="flex items-center gap-2 mt-1 text-left"
              >
                <span
                  className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                    useLogo ? "border-transparent" : isDark ? "border-white/40" : "border-zinc-400"
                  }`}
                  style={useLogo ? { background: "#FF5126" } : undefined}
                >
                  {useLogo && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </span>
                <span className={`text-[12px] transition-colors duration-300 ${textMain}`}>
                  Use this logo for your experiences
                </span>
              </button>
            </div>

            {/* Company Name */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <label className={`text-[12px] flex-1 transition-colors duration-300 ${textMain}`}>Company Name</label>
                <HelpCircle className={`w-3.5 h-3.5 ${helpIconClass}`} />
              </div>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Enter your company name"
                className={`${inputBase} ${inputTheme}`}
              />
              {showError && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <AlertTriangle className="w-3 h-3 shrink-0" style={{ color: "#FFB0B0" }} />
                  <span className="text-[12px]" style={{ color: "#FFB0B0" }}>
                    You must add company name
                  </span>
                </div>
              )}
            </div>

            {/* Timezone */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <label className={`text-[12px] transition-colors duration-300 ${textMain}`}>Timezone</label>
                <HelpCircle className={`w-3.5 h-3.5 ${helpIconClass}`} />
              </div>
              <div className={`flex items-center gap-2 rounded-[10px] px-3 py-3 ${inputTheme}`}>
                <span className="flex-1 text-[14px] truncate">{timezone}</span>
                <ChevronDown className="w-4 h-4 opacity-60 shrink-0" />
              </div>
            </div>

            {/* Company Size */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <label className={`text-[12px] transition-colors duration-300 ${textMain}`}>Company Size</label>
                <HelpCircle className={`w-3.5 h-3.5 ${helpIconClass}`} />
              </div>
              <button
                type="button"
                onClick={() => setCompanySize((s) => (s ? "" : "11–50 employees"))}
                className={`flex items-center gap-2 rounded-[10px] px-3 py-3 text-left ${inputTheme}`}
              >
                <span className={`flex-1 text-[14px] truncate ${!companySize ? (isDark ? "text-[#BBC2CB]" : "text-zinc-500") : ""}`}>
                  {companySize || "Select your company size"}
                </span>
                <ChevronDown className="w-4 h-4 opacity-60 shrink-0" />
              </button>
            </div>

            {/* How did you hear */}
            <div className="flex flex-col gap-2">
              <label className={`text-[12px] transition-colors duration-300 ${textMain}`}>
                How did you hear about Odicci?
              </label>
              <input
                value={hearAbout}
                onChange={(e) => setHearAbout(e.target.value)}
                placeholder="Shopify App Store, Google, an event, a friend…"
                className={`${inputBase} ${inputTheme}`}
              />
              <div className="flex items-start gap-1.5">
                <Info className="w-3 h-3 mt-0.5 shrink-0" style={{ color: "#A3AEBB" }} />
                <p className="text-[12px] leading-tight" style={{ color: "#A3AEBB" }}>
                  You'll become the owner of this workspace. As the owner, you'll have full control of the
                  workspace. You can change your user role later in Settings.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 h-11 rounded-full border text-[14px] transition-colors duration-300"
              style={{ borderColor: "rgba(255,255,255,0.6)", background: "#A3AEBB", color: "#646464" }}
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={() => {
                setTouched(true);
                if (companyName.trim().length > 0) onNext?.();
              }}
              className="flex-1 h-11 rounded-full text-[14px] text-white shadow-lg shadow-black/25 hover:brightness-110 transition"
              style={{ background: "#FF5126" }}
            >
              Create Workspace
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FigmaLinkIcon({ className }: { className?: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className={className} aria-hidden xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.5 22.5H18M13.5 22.5C11.0147 22.5 9 24.5147 9 27C9 29.4853 11.0147 31.5 13.5 31.5C15.9853 31.5 18 29.4853 18 27V22.5M13.5 22.5C11.0147 22.5 9 20.4853 9 18C9 15.5147 11.0147 13.5 13.5 13.5M18 22.5V18M13.5 13.5H18M13.5 13.5C11.0147 13.5 9 11.4853 9 9C9 6.51472 11.0147 4.5 13.5 4.5H18M18 13.5V18M18 13.5V4.5M18 13.5H22.5M18 18C18 20.4853 20.0147 22.5 22.5 22.5C24.9853 22.5 27 20.4853 27 18C27 15.5147 24.9853 13.5 22.5 13.5M18 18C18 15.5147 20.0147 13.5 22.5 13.5M18 4.5H22.5C24.9853 4.5 27 6.51472 27 9C27 11.4853 24.9853 13.5 22.5 13.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


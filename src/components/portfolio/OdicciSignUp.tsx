import { motion } from "framer-motion";
import { ChevronDown, Sun, Moon, X } from "lucide-react";
import { useState } from "react";

/**
 * OdicciSignUp — the V2 iteration mockup for the Odicci case study.
 * Shares the browser chrome + twilight canvas design system used by
 * OdicciWorkspacePicker and OdicciColourPalette. Two-column layout:
 * marketing hero on the left, sign-up modal card on the right.
 */

const ACCENT = "#FF5126";
const HERO_BLUE = "#004074";
const HERO_SUB = "#D0D8E2";

const DARK_BG =
  "linear-gradient(196deg, rgba(255,255,255,0.24) 11.69%, rgba(0,24,58,0.85) 100%), linear-gradient(135deg, #0b1a33 0%, #10315b 45%, #0356E5 100%)";
const LIGHT_BG =
  "linear-gradient(135deg, #f7fbff 0%, #eef6ff 50%, #e6f4fe 100%)";

export function OdicciSignUp() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const isDark = theme === "dark";
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const textMain = isDark ? "text-white" : "text-zinc-900";
  const textSub = isDark ? "text-white/70" : "text-zinc-600";
  const cardBg = isDark
    ? "bg-[rgba(0,64,116,0.05)] border-white"
    : "bg-white/60 border-white";
  const inputBg = isDark
    ? "bg-white/[0.08] border-white/15 text-white placeholder:text-white/45"
    : "bg-white/80 border-zinc-900/10 text-zinc-900 placeholder:text-zinc-400";
  const inputLabel = isDark ? "text-white" : "text-zinc-800";

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
              odicci | Sign up
            </span>
            <span className="ml-1 text-zinc-500 text-[10px]">✕</span>
          </div>
        </div>
        <div className="text-[11px] font-mono text-zinc-500 tabular-nums">V2</div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 h-11 px-3 border-b border-zinc-200 bg-white">
        <ChevronDown className="w-4 h-4 text-zinc-400 rotate-90" />
        <ChevronDown className="w-4 h-4 text-zinc-900 -rotate-90" />
        <div className="flex-1 flex items-center gap-2 h-[30px] px-3 rounded-lg border border-zinc-200 bg-zinc-100">
          <span className="text-[13px] text-zinc-500 tracking-tight">odicci.com/signup</span>
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
          "relative aspect-[1512/900] overflow-hidden transition-colors duration-300 " +
          (isDark ? "bg-[#0b1a33]" : "bg-[#E6F4FE]")
        }
      >
        <div className="absolute inset-0 transition-opacity duration-300" style={{ background: DARK_BG, opacity: isDark ? 1 : 0 }} />
        <div className="absolute inset-0 transition-opacity duration-300" style={{ background: LIGHT_BG, opacity: isDark ? 0 : 1 }} />

        {/* Ambient blobs — echo Figma placement */}
        <motion.div
          className="absolute -top-[15%] -left-[10%] w-[45%] aspect-square rounded-full pointer-events-none"
          style={{ backgroundColor: isDark ? "rgba(59,158,255,0.35)" : "rgba(200,220,240,0.35)", filter: "blur(90px)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[30%] left-[10%] w-[40%] h-[45%] rounded-full pointer-events-none"
          style={{ backgroundColor: isDark ? "rgba(3,86,229,0.55)" : "rgba(180,210,240,0.35)", filter: "blur(90px)" }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.55, 0.8, 0.55] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
        <motion.div
          className="absolute bottom-[-20%] left-[8%] w-[35%] h-[40%] rounded-full pointer-events-none"
          style={{ backgroundColor: isDark ? "rgba(255,81,38,0.35)" : "rgba(240,200,200,0.3)", filter: "blur(90px)" }}
          animate={{ scale: [1.05, 0.95, 1.05], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.div
          className="absolute top-[50%] -right-[15%] w-[35%] aspect-square rounded-full pointer-events-none"
          style={{ backgroundColor: isDark ? "rgba(230,244,254,0.25)" : "rgba(200,220,240,0.35)", filter: "blur(120px)" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Two-column content */}
        <div className="absolute inset-0 flex items-center justify-between gap-8 md:gap-14 px-8 md:px-16 lg:px-24 py-10">
          {/* LEFT — hero */}
          <div className="flex-1 flex flex-col gap-10 md:gap-14 min-w-0 max-w-[58%]">
            {/* Odicci logo */}
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 md:w-8 md:h-8"
                style={{ background: ACCENT, clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              />
              <span className={`text-[26px] md:text-[30px] font-semibold tracking-tight ${textMain}`}>odicci</span>
            </div>

            <div className="flex flex-col gap-5 md:gap-7">
              <h2
                className={`text-[28px] md:text-[38px] lg:text-[46px] font-medium leading-[1.2] tracking-tight ${textMain}`}
                style={{ fontFamily: "Poppins, ui-sans-serif, system-ui, -apple-system" }}
              >
                Create engaging, data-driven games that{" "}
                <span style={{ color: ACCENT }}>boost interaction</span>{" "}
                and{" "}
                <span style={{ color: HERO_BLUE }}>brand loyalty.</span>
              </h2>
              <p
                className="text-[16px] md:text-[20px] lg:text-[24px] leading-[1.25] max-w-2xl"
                style={{ color: isDark ? HERO_SUB : "#4a6b8a", fontFamily: "Poppins, ui-sans-serif, system-ui, -apple-system" }}
              >
                Odicci is the gamification platform that helps brands turn engagement into measurable growth.
              </p>
            </div>
          </div>

          {/* RIGHT — sign-up card */}
          <div
            className={`w-[340px] md:w-[400px] lg:w-[440px] shrink-0 rounded-3xl border backdrop-blur-xl shadow-2xl shadow-black/20 p-6 md:p-8 flex flex-col gap-6 transition-colors duration-300 ${cardBg}`}
          >
            {/* Close */}
            <div className="flex justify-end">
              <button
                type="button"
                className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors ${
                  isDark ? "text-white/70 hover:text-white hover:bg-white/10" : "text-zinc-500 hover:text-zinc-900 hover:bg-black/5"
                }`}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Logo mark + step dots */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-9 h-10"
                style={{ background: ACCENT, clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              />
              <div className="flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-white/40" : "bg-zinc-300"}`} />
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
                <span className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-white/40" : "bg-zinc-300"}`} />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center">
              <div className={`text-[20px] md:text-[22px] font-medium ${textMain}`}>
                Create your account
              </div>
              <div className={`text-[12px] mt-1 ${textSub}`}>Enter your credentials below</div>
            </div>

            {/* Google + divider */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                className="h-10 px-6 w-full rounded-full bg-white text-zinc-700 text-[13px] font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow transition-shadow"
              >
                <GoogleIcon />
                Sign up with Google
              </button>
              <div className="flex items-center gap-2 w-full">
                <div className={`flex-1 h-px ${isDark ? "bg-white/40" : "bg-zinc-300"}`} />
                <span className={`text-[11px] ${textSub}`}>Or sign up with</span>
                <div className={`flex-1 h-px ${isDark ? "bg-white/40" : "bg-zinc-300"}`} />
              </div>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="First Name" placeholder="Enter your first name" value={firstName} onChange={setFirstName} inputClass={inputBg} labelClass={inputLabel} />
                <Field label="Last Name" placeholder="Enter your last name" value={lastName} onChange={setLastName} inputClass={inputBg} labelClass={inputLabel} />
              </div>
              <Field label="Email" placeholder="Enter your email" value={email} onChange={setEmail} type="email" inputClass={inputBg} labelClass={inputLabel} />
              <Field label="Password" placeholder="Enter password" value={password} onChange={setPassword} type="password" inputClass={inputBg} labelClass={inputLabel} />
            </div>

            {/* CTA */}
            <button
              type="button"
              className="mt-1 w-full h-11 rounded-full text-white text-[14px] font-medium shadow-lg shadow-black/20 hover:brightness-110 transition"
              style={{ background: ACCENT }}
            >
              Sign Up
            </button>

            {/* Footer link */}
            <div className="text-center text-[12px]">
              <span className={textSub}>Have an account? </span>
              <button type="button" className="underline" style={{ color: ACCENT }}>
                Login here
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputClass: string;
  labelClass: string;
}

function Field({ label, placeholder, value, onChange, type = "text", inputClass, labelClass }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 min-w-0">
      <span className={`text-[12px] font-medium ${labelClass}`}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-10 rounded-lg border px-3 text-[13px] outline-none focus:ring-2 focus:ring-white/30 transition ${inputClass}`}
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M17.84 18.47c2.02-1.88 2.92-5.02 2.38-8.04H12.18v3.33h4.58c-.18 1.08-.81 1.98-1.71 2.56l2.79 2.15z" fill="#4285F4" />
      <path d="M4.54 15.82a8.85 8.85 0 0 0 12.9 2.65l-2.79-2.16c-2.38 1.58-6.33.99-7.68-2.69l-2.83 2.2z" fill="#34A853" />
      <path d="M7.37 13.62a5.35 5.35 0 0 1 0-3.28L4.54 8.13a8.86 8.86 0 0 0 0 7.69l2.83-2.2z" fill="#FBBC02" />
      <path d="M7.37 10.34C8.36 7.24 12.58 5.44 15.41 8.09l2.47-2.43C14.38 2.29 7.55 2.43 4.54 8.14l2.83 2.2z" fill="#EA4335" />
    </svg>
  );
}
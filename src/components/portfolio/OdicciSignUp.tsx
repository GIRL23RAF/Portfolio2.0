import { motion } from "framer-motion";
import { ChevronDown, Sun, Moon, X } from "lucide-react";
import { useState } from "react";
import odicciBadge from "@/assets/odicci-badge.png";

/**
 * OdicciSignUp — pixel-faithful rebuild of the "Sign Up Flow" Figma frame
 * (dark twilight canvas, 1512x982) for the Odicci case study's V2 iteration.
 * Wrapped in the same browser chrome + light/dark toggle used by its sibling
 * mockups. Two-column layout: marketing hero on the left, sign-up glass
 * card on the right — spacing, radii, and type sizes are lifted directly
 * from the Figma export tokens.
 */

const ACCENT = "#FF5126";
const HERO_BLUE = "#004074";
const HERO_SUB = "#D0D8E2";
const CLOSE_GREY = "#828B96";
const DOT_ACTIVE = "#EA4335";

const DARK_WASH =
  "linear-gradient(196deg, rgba(255,255,255,0.24) 11.69%, rgba(0,24,58,0.3) 100%)";
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
    ? "border-white bg-[rgba(0,64,116,0.05)]"
    : "border-white bg-white/60";
  const inputBg = isDark
    ? "bg-white/[0.15] text-white placeholder:text-white/40"
    : "bg-white/80 text-zinc-900 placeholder:text-zinc-400";
  const inputBorder = isDark ? "rgba(208,216,226,0.10)" : "rgba(17,25,39,0.10)";

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

      {/* Canvas — 1512x982, matching the Figma frame aspect ratio exactly */}
      <div
        className={
          "relative aspect-[1512/982] overflow-hidden transition-colors duration-300 " +
          (isDark ? "bg-[#111927]" : "bg-[#E6F4FE]")
        }
      >
        <div className="absolute inset-0 transition-opacity duration-300" style={{ background: DARK_WASH, opacity: isDark ? 1 : 0 }} />
        <div className="absolute inset-0 transition-opacity duration-300" style={{ background: LIGHT_BG, opacity: isDark ? 0 : 1 }} />

        {/* Ambient blobs — colors + positions lifted from the Figma export */}
        <motion.div
          className="absolute -top-[10%] -right-[6%] w-[48%] h-[58%] rounded-full pointer-events-none"
          style={{ backgroundColor: isDark ? "rgba(230,244,254,0.55)" : "rgba(210,230,250,0.5)", filter: "blur(120px)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[45%] left-[41%] w-[28%] h-[17%] rounded-full pointer-events-none"
          style={{ backgroundColor: isDark ? "rgba(255,81,38,0.55)" : "rgba(255,150,110,0.35)", filter: "blur(60px)" }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />
        <div
          className="absolute top-[63%] left-[9%] w-[28%] h-[33%] rounded-full pointer-events-none"
          style={{ backgroundColor: isDark ? "rgba(255,81,38,0.4)" : "rgba(255,150,110,0.25)", filter: "blur(60px)" }}
        />
        <motion.div
          className="absolute top-[39%] left-[3%] w-[68%] h-[82%] rounded-full pointer-events-none"
          style={{ backgroundColor: isDark ? "rgba(3,86,229,0.42)" : "rgba(180,210,240,0.3)", filter: "blur(90px)" }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.75, 0.5] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <div
          className="absolute top-[74%] left-[42%] w-[68%] h-[47%] rounded-full pointer-events-none"
          style={{ backgroundColor: isDark ? "rgba(3,86,229,0.42)" : "rgba(180,210,240,0.25)", filter: "blur(90px)" }}
        />
        <motion.div
          className="absolute top-[48%] left-[13%] w-[41%] h-[49%] rounded-full pointer-events-none"
          style={{ backgroundColor: isDark ? "rgba(59,158,255,0.35)" : "rgba(200,220,240,0.3)", filter: "blur(60px)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2.4 }}
        />
        <div
          className="absolute top-[59%] left-[42%] w-[27%] h-[54%] rounded-full pointer-events-none"
          style={{ backgroundColor: isDark ? "rgba(1,208,129,0.1)" : "rgba(1,208,129,0.08)", filter: "blur(60px)" }}
        />

        {/* Two-column content — matches Figma left:96px top:152px, 1321x692 container */}
        <div className="absolute inset-0 flex items-center justify-between gap-8 md:gap-14 px-6 md:px-16 lg:px-[96px] py-10">
          {/* LEFT — hero */}
          <div className="flex-1 flex flex-col gap-8 md:gap-12 min-w-0 max-w-[54%]">
            {/* Odicci logo */}
            <div className="flex items-center gap-2">
              <img src={odicciBadge} alt="" className="w-7 h-7 md:w-8 md:h-8" />
              <span className={`text-[26px] md:text-[30px] font-semibold tracking-tight ${textMain}`}>odicci</span>
            </div>

            <div className="flex flex-col gap-5 md:gap-9">
              <h2
                className={`text-[26px] md:text-[36px] lg:text-[46px] font-medium leading-[1.2] tracking-tight ${textMain}`}
                style={{ fontFamily: "Poppins, ui-sans-serif, system-ui, -apple-system" }}
              >
                Create engaging, data-driven games that{" "}
                <span style={{ color: ACCENT }}>boost interaction</span>{" "}
                and{" "}
                <span style={{ color: HERO_BLUE }}>brand loyalty.</span>
              </h2>
              <p
                className="text-[15px] md:text-[20px] lg:text-[28px] leading-[1.2] max-w-2xl"
                style={{ color: isDark ? HERO_SUB : "#4a6b8a", fontFamily: "Poppins, ui-sans-serif, system-ui, -apple-system" }}
              >
                Odicci is the gamification platform that helps brands turn engagement into measurable growth.
              </p>
            </div>
          </div>

          {/* RIGHT — sign-up card (Figma: 462px wide, 24px pad, 24px radius, gap-6) */}
          <div
            className={`w-[300px] md:w-[380px] lg:w-[462px] h-full shrink-0 rounded-3xl border backdrop-blur-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-5 md:p-6 flex flex-col items-center gap-6 transition-colors duration-300 ${cardBg}`}
          >
            {/* Close */}
            <div className="flex justify-end w-full">
              <button
                type="button"
                className="w-6 h-6 flex items-center justify-center transition-opacity hover:opacity-70"
                aria-label="Close"
              >
                <X className="w-6 h-6" style={{ color: CLOSE_GREY }} />
              </button>
            </div>

            {/* Badge mark + step dots */}
            <div className="flex flex-col items-center gap-6">
              <img src={odicciBadge} alt="" className="w-9 h-10" />
              <div className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-white/50" />
                <span className="w-2 h-2 rounded-full" style={{ background: DOT_ACTIVE }} />
                <span className="w-2 h-2 rounded-full bg-white/50" />
              </div>
            </div>

            <div className="w-full h-full flex flex-col items-center justify-between gap-0">
              {/* Heading */}
              <div className="w-full flex flex-col items-center text-center">
                <div className={`text-[20px] font-normal ${textMain}`}>Create your account</div>
                <div className={`text-[12px] ${isDark ? "text-white/60" : "text-zinc-500"}`}>
                  Enter your credentials below
                </div>
              </div>

              {/* Google + divider */}
              <div className="w-full flex flex-col items-center gap-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2.5 py-1.5 px-11 rounded-full bg-white text-[12px] font-normal shadow-sm hover:shadow transition-shadow"
                  style={{ color: "#9CA2AA" }}
                >
                  <GoogleIcon />
                  Sign up with Google
                </button>
                <div className="flex items-center gap-2 w-full">
                  <div className={`flex-1 h-px ${isDark ? "bg-white" : "bg-zinc-300"}`} />
                  <span className={`text-[12px] shrink-0 ${isDark ? "text-white" : "text-zinc-600"}`}>Or sign up with</span>
                  <div className={`flex-1 h-px ${isDark ? "bg-white" : "bg-zinc-300"}`} />
                </div>
              </div>

              {/* Form + CTA */}
              <div className="w-full flex flex-col items-center gap-4">
                <div className="w-full flex flex-col items-start gap-4">
                  <div className="w-full flex items-center gap-[13px]">
                    <Field label="First Name" placeholder="Enter your first name" value={firstName} onChange={setFirstName} inputClass={inputBg} borderColor={inputBorder} isDark={isDark} />
                    <Field label="Last Name" placeholder="Enter your last name" value={lastName} onChange={setLastName} inputClass={inputBg} borderColor={inputBorder} isDark={isDark} />
                  </div>
                  <Field label="Email" placeholder="Enter your email" value={email} onChange={setEmail} type="email" inputClass={inputBg} borderColor={inputBorder} isDark={isDark} full />
                  <Field label="Password" placeholder="Enter password" value={password} onChange={setPassword} type="password" inputClass={inputBg} borderColor={inputBorder} isDark={isDark} full />
                </div>

                {/* CTA — Figma: auto-width, 8px/86px padding, 24px radius */}
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2.5 py-2 px-10 md:px-[86px] rounded-[24px] text-white text-[12px] font-normal shadow-lg shadow-black/20 hover:brightness-110 transition"
                  style={{ background: ACCENT }}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Footer link */}
            <div className="text-center text-[12px] w-full">
              <span className={isDark ? "text-white" : "text-zinc-600"}>Have an account? </span>
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
  borderColor: string;
  isDark: boolean;
  full?: boolean;
}

function Field({ label, placeholder, value, onChange, type = "text", inputClass, borderColor, isDark, full }: FieldProps) {
  return (
    <label className={`flex flex-col gap-1 min-w-0 ${full ? "w-full" : "flex-1"}`}>
      <span className={`text-[12px] font-normal ${isDark ? "text-white" : "text-zinc-800"}`}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ borderColor }}
        className={`w-full rounded-md border py-2 px-2.5 text-[16px] outline-none focus:ring-2 focus:ring-white/30 transition ${inputClass}`}
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M17.8408 18.4702C19.8627 16.5831 20.7613 13.438 20.2221 10.4277H12.1797V13.7525H16.7625C16.5828 14.8309 15.9538 15.7294 15.0552 16.3135L17.8408 18.4702Z" fill="#4285F4" />
      <path d="M4.54102 15.8188C4.61464 15.9637 4.69227 16.1064 4.77389 16.247C4.85558 16.3876 4.94114 16.5258 5.03058 16.6615C5.12008 16.7972 5.21327 16.9303 5.31027 17.0608C5.40727 17.1913 5.50783 17.3188 5.61208 17.4436C5.71627 17.5684 5.82389 17.6901 5.93502 17.8088C6.04608 17.9275 6.16045 18.0429 6.27808 18.1552C6.3957 18.2674 6.51639 18.3762 6.64014 18.4816C6.76389 18.587 6.89052 18.6888 7.02008 18.7871C7.14958 18.8853 7.28177 18.9798 7.41664 19.0706C7.55152 19.1613 7.68883 19.2482 7.82864 19.3312C7.96839 19.4142 8.11039 19.4932 8.25464 19.5682C8.39889 19.6431 8.54514 19.714 8.69339 19.7807C8.84164 19.8474 8.99164 19.9099 9.14345 19.9681C9.2952 20.0263 9.44852 20.0802 9.60333 20.1298C9.75814 20.1793 9.91427 20.2245 10.0716 20.2652C10.229 20.3059 10.3874 20.3422 10.5468 20.374C10.7063 20.4058 10.8665 20.433 11.0275 20.4558C11.1884 20.4784 11.3499 20.4966 11.5119 20.5102C11.6739 20.5238 11.8361 20.5328 11.9986 20.5372C12.1611 20.5416 12.3236 20.5414 12.4861 20.5367C12.6486 20.5319 12.8108 20.5226 12.9728 20.5086C13.1348 20.4947 13.2962 20.4762 13.4571 20.4531C13.6181 20.4301 13.7782 20.4024 13.9376 20.3703C14.097 20.3382 14.2553 20.3016 14.4125 20.2606C14.5698 20.2195 14.7258 20.174 14.8806 20.1241C15.0353 20.0743 15.1885 20.02 15.3401 19.9614C15.4918 19.9029 15.6416 19.8401 15.7898 19.7731C15.9379 19.7061 16.084 19.6349 16.228 19.5596C16.3721 19.4844 16.514 19.4051 16.6536 19.3218C16.7931 19.2384 16.9303 19.1513 17.065 19.0603C17.1996 18.9692 17.3316 18.8744 17.461 18.7759C17.5903 18.6774 17.7167 18.5753 17.8402 18.4696L15.0546 16.313C12.6733 17.8855 8.71952 17.3014 7.37158 13.6172L4.54102 15.8188Z" fill="#34A853" />
      <path d="M7.37192 13.6162C7.01249 12.493 7.01249 11.4596 7.37192 10.3363L4.54136 8.13477C3.50799 10.2016 3.19349 13.122 4.54136 15.8178L7.37192 13.6162Z" fill="#FBBC02" />
      <path d="M7.37158 10.3372C8.36008 7.23712 12.5835 5.43993 15.414 8.09074L17.8851 5.66455C14.3806 2.29487 7.55133 2.42962 4.54102 8.13568L7.37158 10.3372Z" fill="#EA4335" />
    </svg>
  );
}

import { AnimatePresence, motion } from "framer-motion";
import {
  Ban,
  ChevronLeft,
  Flag,
  LayoutGrid,
  Mic,
  MoreHorizontal,
  Pencil,
  Radar,
  Send,
  ShieldCheck,
  Settings,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

/**
 * CrcleMessaging — pixel-faithful rebuild of the CRCLE "Navigation & Unified
 * Messaging" spec: a single feed that mixes live chats with incoming match
 * invites ("Radar Intercepts"). Hovering (or long-pressing) an invite reveals
 * a frosted "peek" of the sender's profile; clicking it opens the full
 * "Signal Intercepted" gate, which Accepts into a live chat thread or
 * Declines back to the feed.
 */

const TEAL = "#2FD6C6";
const CORAL = "#FF6A50";

interface Person {
  name: string;
  initials: string;
  age: number;
  status: string;
  intent: string;
  gradient: string;
}

const SERENA: Person = {
  name: "Serena Min",
  initials: "SM",
  age: 24,
  status: "Single",
  intent: "Romantic Match",
  gradient: "linear-gradient(135deg, #F6A45C 0%, #E85D6B 55%, #7B4FA0 100%)",
};

const SARAH_LAST_MESSAGE = "See you tomorrow at 4! Can't wait \u2728";

type View = "feed" | "gate" | "chat";

export function CrcleMessaging() {
  const [view, setView] = useState<View>("feed");
  const [peeking, setPeeking] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="relative w-full max-w-[402px] mx-auto rounded-[46px] border-[6px] border-zinc-950 bg-zinc-950 shadow-2xl shadow-black/50 overflow-hidden">
      {/* Dynamic island */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 w-[120px] h-[28px] mt-2 rounded-full bg-zinc-950" />

      {/* Status bar */}
      <div className="relative z-20 flex items-center justify-between px-7 pt-3 pb-1 text-white">
        <span className="text-[14px] font-semibold tracking-tight">9:41</span>
        <div className="flex items-center gap-1.5">
          <SignalGlyph />
          <WifiGlyph />
          <BatteryGlyph />
        </div>
      </div>

      {/* Screen */}
      <div className="relative aspect-[402/800] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(165deg, #1B0F1C 0%, #35152A 45%, #401A2C 75%, #4A2033 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 34px)",
          }}
        />

        <AnimatePresence mode="wait">
          {view === "chat" ? (
            <ChatScreen key="chat" onBack={() => setView("feed")} message={message} setMessage={setMessage} />
          ) : (
            <FeedScreen
              key="feed"
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              peeking={peeking}
              setPeeking={setPeeking}
              onOpenGate={() => setView("gate")}
            />
          )}
        </AnimatePresence>

        {/* Gate overlay */}
        <AnimatePresence>
          {view === "gate" && (
            <SignalGate
              onDecline={() => setView("feed")}
              onAccept={() => setView("chat")}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Feed --- */

function FeedScreen({
  menuOpen,
  setMenuOpen,
  peeking,
  setPeeking,
  onOpenGate,
}: {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  peeking: boolean;
  setPeeking: (v: boolean) => void;
  onOpenGate: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-3 pb-2 shrink-0">
        <ChevronLeft className="w-5 h-5 text-white/70" />
        <span className="text-[17px] font-medium text-white">Messages</span>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:bg-white/10 transition-colors"
          aria-label="More options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Options dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-4 top-12 z-30 w-[190px] rounded-2xl border border-white/10 bg-[#241521]/95 backdrop-blur-xl shadow-2xl shadow-black/40 py-1.5 overflow-hidden"
          >
            <MenuRow icon={Flag} label="Report User" tone="danger" />
            <MenuRow icon={Ban} label="Block User" tone="danger" />
            <div className="h-px bg-white/10 my-1" />
            <MenuRow icon={Pencil} label="Edit profile" />
            <MenuRow icon={ShieldCheck} label="Verification" />
            <MenuRow icon={Settings} label="Settings" />
            <MenuRow icon={LayoutGrid} label="User Shortcuts" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 flex flex-col gap-4" onClick={() => setMenuOpen(false)}>
        {/* New Requests / Radar intercepts */}
        <div
          className="relative rounded-2xl p-3.5 border"
          style={{ background: "rgba(47,214,198,0.14)", borderColor: "rgba(47,214,198,0.35)" }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[13px] font-medium" style={{ color: TEAL }}>
              New Requests
            </span>
            <div className="flex items-center gap-1 rounded-full p-0.5 text-[10px]" style={{ background: "rgba(255,255,255,0.08)" }}>
              <span className="px-2 py-0.5 rounded-full text-white/50">Sent</span>
              <span className="px-2 py-0.5 rounded-full text-white" style={{ background: "rgba(47,214,198,0.35)" }}>
                Received
              </span>
            </div>
          </div>

          {/* Serena preview card — hover to peek, click to open gate */}
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setPeeking(true)}
              onMouseLeave={() => setPeeking(false)}
              onFocus={() => setPeeking(true)}
              onBlur={() => setPeeking(false)}
              onClick={onOpenGate}
              className="w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-white/5"
            >
              <div className="flex items-center -space-x-2 shrink-0">
                <Avatar person={SERENA} size={30} ring />
                <div
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-[11px] font-semibold border-2"
                  style={{ background: "#4B5563", borderColor: "#35152A" }}
                >
                  +2
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] text-white/90 leading-tight">Your Signal was intercepted</div>
                <div className="text-[11px] text-white/50 leading-tight">3 new connections waiting</div>
              </div>
              <span
                className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full text-white"
                style={{ background: CORAL }}
              >
                View
              </span>
            </button>

            {/* Peek overlay — partial, glassmorphic reveal on hover/focus */}
            <AnimatePresence>
              {peeking && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="pointer-events-none absolute left-0 right-0 top-[calc(100%+6px)] z-20 rounded-2xl border border-white/15 overflow-hidden shadow-2xl shadow-black/50"
                  style={{ backdropFilter: "blur(20px)" }}
                >
                  <div className="flex items-center gap-3 p-3" style={{ background: "rgba(20,10,20,0.65)" }}>
                    <div
                      className="w-12 h-14 rounded-xl shrink-0"
                      style={{ background: SERENA.gradient }}
                    />
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-white">{SERENA.name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Pill label={SERENA.status} />
                        <Pill label={`${SERENA.age} yrs`} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Divider label */}
        <div className="text-[11px] font-medium text-white/40 tracking-wide px-1">Active chats</div>

        {/* Unified chat list */}
        <ChatRow initials="SC" name="Sarah Chen" gradient="linear-gradient(135deg,#6EE7D6,#3B82F6)" preview={SARAH_LAST_MESSAGE} time="2m" online unread={2} />
        <ChatRow initials="MJ" name="Marcus Jones" gradient="linear-gradient(135deg,#FBBF77,#EF6C6C)" preview="Haha that's amazing, tell me more" time="1h" />
        <ChatRow initials="AL" name="Aria Lopez" gradient="linear-gradient(135deg,#C4B5FD,#818CF8)" preview="You: Sounds good, see you then" time="Yesterday" />
      </div>

      {/* Bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-3 flex items-center justify-between" style={{ background: "linear-gradient(180deg, transparent, rgba(27,15,28,0.85) 40%)" }}>
        <button
          type="button"
          className="w-11 h-11 rounded-full flex items-center justify-center border border-white/15 text-white/80 hover:bg-white/10 transition-colors"
          style={{ background: "rgba(255,255,255,0.06)" }}
          aria-label="Profile"
        >
          <User className="w-[18px] h-[18px]" />
        </button>
        <button
          type="button"
          className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${CORAL}, #B23A6B)`, boxShadow: `0 8px 24px ${CORAL}55` }}
          aria-label="Open Signal Panel"
        >
          <Radar className="w-6 h-6" />
        </button>
        <button
          type="button"
          className="w-11 h-11 rounded-full flex items-center justify-center border border-white/15 text-white/80 hover:bg-white/10 transition-colors"
          style={{ background: "rgba(255,255,255,0.06)" }}
          aria-label="Messages"
        >
          <MessageGlyphActive />
        </button>
      </div>
    </motion.div>
  );
}

function ChatRow({
  initials,
  name,
  gradient,
  preview,
  time,
  online,
  unread,
}: {
  initials: string;
  name: string;
  gradient: string;
  preview: string;
  time: string;
  online?: boolean;
  unread?: number;
}) {
  return (
    <button type="button" className="w-full flex items-center gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-white/5 transition-colors">
      <div className="relative shrink-0">
        <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[12px] font-semibold" style={{ background: gradient }}>
          {initials}
        </div>
        {online && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2" style={{ background: TEAL, borderColor: "#2A1526" }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13.5px] font-medium text-white truncate">{name}</span>
          <span className="text-[10.5px] text-white/40 shrink-0">{time}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] text-white/50 truncate">{preview}</span>
          {!!unread && (
            <span className="shrink-0 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-semibold text-white flex items-center justify-center" style={{ background: CORAL }}>
              {unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function MenuRow({ icon: Icon, label, tone }: { icon: typeof Flag; label: string; tone?: "danger" }) {
  return (
    <button
      type="button"
      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] transition-colors hover:bg-white/10 ${
        tone === "danger" ? "text-[#FF6B6B]" : "text-white/85"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full text-white/85 border border-white/20" style={{ background: "rgba(255,255,255,0.08)" }}>
      {label}
    </span>
  );
}

function Avatar({ person, size, ring }: { person: Person; size: number; ring?: boolean }) {
  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-semibold shrink-0 ${ring ? "border-2" : ""}`}
      style={{ width: size, height: size, background: person.gradient, fontSize: size * 0.36, borderColor: "#35152A" }}
    >
      {person.initials}
    </div>
  );
}

/* --------------------------------------------------------- Signal gate --- */

function SignalGate({ onDecline, onAccept }: { onDecline: () => void; onAccept: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-40 flex items-center justify-center px-6"
    >
      <div className="absolute inset-0 bg-black/50" style={{ backdropFilter: "blur(20px)" }} onClick={onDecline} />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="relative w-full rounded-[28px] border border-white/15 overflow-hidden shadow-2xl shadow-black/60"
        style={{ background: "rgba(35,18,32,0.9)" }}
      >
        <button
          type="button"
          onClick={onDecline}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors"
          style={{ background: "rgba(255,255,255,0.1)" }}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-5 pt-4 pb-1 text-center text-[11px] font-medium tracking-[0.14em] uppercase" style={{ color: TEAL }}>
          Signal Intercepted
        </div>

        <div className="mt-2 h-[220px] mx-4 rounded-2xl" style={{ background: SERENA.gradient }} />

        <div className="px-5 pt-4 pb-2 text-center">
          <div className="text-[19px] font-medium text-white">
            {SERENA.name}, <span className="text-white/70">{SERENA.age}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <Pill label={SERENA.status} />
            <Pill label={SERENA.intent} />
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-5 pt-3 pb-5">
          <button
            type="button"
            onClick={onDecline}
            className="flex-1 h-11 rounded-full text-[13.5px] font-medium text-white/80 border border-white/20 hover:bg-white/10 transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="flex-1 h-11 rounded-full text-[13.5px] font-medium text-white shadow-lg transition-transform hover:scale-[1.02]"
            style={{ background: `linear-gradient(135deg, ${CORAL}, #B23A6B)`, boxShadow: `0 8px 20px ${CORAL}55` }}
          >
            Accept
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------- Chat --- */

function ChatScreen({
  onBack,
  message,
  setMessage,
}: {
  onBack: () => void;
  message: string;
  setMessage: (v: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="absolute inset-0 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 pt-3 pb-3 border-b border-white/10 shrink-0">
        <button type="button" onClick={onBack} className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors" aria-label="Back">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <Avatar person={SERENA} size={34} />
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-medium text-white leading-tight">{SERENA.name}</div>
          <div className="flex items-center gap-1 text-[11px] text-white/50 leading-tight">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
            Online
          </div>
        </div>
        <MoreHorizontal className="w-[18px] h-[18px] text-white/60" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        <div className="text-center text-[10.5px] text-white/40">Connection verified &middot; encrypted</div>
        <div className="max-w-[78%] self-start rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-[13px] text-white" style={{ background: "rgba(255,255,255,0.08)" }}>
          Hey! Your Signal matched mine \u2014 loved that you're into design systems too. Would love to connect and swap ideas about component libraries.
        </div>
        <div className="max-w-[78%] self-end rounded-2xl rounded-br-sm px-3.5 py-2.5 text-[13px] text-white" style={{ background: `linear-gradient(135deg, ${CORAL}, #B23A6B)` }}>
          Hey! How are you?
        </div>
      </div>

      {/* Composer */}
      <div className="flex items-center gap-2 px-3 pb-4 pt-2 shrink-0">
        <div className="flex-1 flex items-center gap-2 h-11 rounded-full px-3.5" style={{ background: "rgba(255,255,255,0.08)" }}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."
            className="flex-1 min-w-0 bg-transparent text-[13px] text-white placeholder-white/40 outline-none"
          />
          <Mic className="w-4 h-4 text-white/50 shrink-0" />
        </div>
        <button
          type="button"
          className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0 transition-transform hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${CORAL}, #B23A6B)` }}
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/* --------------------------------------------------------- Status bar --- */

function SignalGlyph() {
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
      <rect x="0" y="7" width="3" height="4" rx="0.8" fill="white" />
      <rect x="4.5" y="5" width="3" height="6" rx="0.8" fill="white" />
      <rect x="9" y="3" width="3" height="8" rx="0.8" fill="white" />
      <rect x="13.5" y="0" width="3" height="11" rx="0.8" fill="white" />
    </svg>
  );
}

function WifiGlyph() {
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
      <path
        d="M7.5 9.8a1 1 0 100-2 1 1 0 000 2zM4.8 6.8a3.8 3.8 0 015.4 0M2.4 4.3a7.2 7.2 0 0110.2 0"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BatteryGlyph() {
  return (
    <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
      <rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke="white" strokeOpacity="0.4" />
      <rect x="2" y="2" width="17" height="7" rx="1.5" fill="white" />
      <path d="M22 4v3a1.5 1.5 0 000-3z" fill="white" fillOpacity="0.4" />
    </svg>
  );
}

function MessageGlyphActive() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(255,255,255,0.12)"
      />
    </svg>
  );
}

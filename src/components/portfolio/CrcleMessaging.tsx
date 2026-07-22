import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import avatarImg from "@/assets/crcle/avatar.png";
import arrowLeftIcon from "@/assets/crcle/arrow-left.svg";
import batteryIcon from "@/assets/crcle/battery.svg";
import cellularIcon from "@/assets/crcle/cellular.svg";
import crcleLogo from "@/assets/crcle/crcle-logo.svg";
import dragHandle from "@/assets/crcle/drag-handle.svg";
import fireIcon from "@/assets/crcle/fire.svg";
import fireInnerIcon from "@/assets/crcle/fire-inner.svg";
import heartIcon from "@/assets/crcle/heart.svg";
import laptopIcon from "@/assets/crcle/laptop.svg";
import moreDotsIcon from "@/assets/crcle/more-dots.svg";
import moreHorizIcon from "@/assets/crcle/more-horiz.svg";
import navMessageIcon from "@/assets/crcle/nav-message.svg";
import navUserIcon from "@/assets/crcle/nav-user.svg";
import notificationBg from "@/assets/crcle/notification-bg.svg";
import wifiIcon from "@/assets/crcle/wifi.svg";

/**
 * CRCLE Messaging — pixel-faithful rebuild of the "Locked Search Bar" Figma frame.
 * Unified inbox with an expanded notification center, connection avatars, and
 * active chat list beneath a frosted bottom nav.
 */

const FONT = "Montserrat, ui-sans-serif, system-ui, sans-serif";
const BG = "#020217";

export function CrcleMessaging() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<"sent" | "received">("received");

  return (
    <div
      className="relative w-full max-w-[402px] mx-auto rounded-[46px] border-[6px] border-[#010211] shadow-2xl shadow-black/50 overflow-hidden"
      style={{ background: BG }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 w-[120px] h-[28px] mt-2 rounded-full bg-black" />

      <div className="relative aspect-[402/874] overflow-hidden" style={{ background: BG }}>
        <StatusBar />
        <CrcleMark />
        <MessagesHeader menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} />

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-4 top-[108px] z-40 w-[147px] rounded-[24px] backdrop-blur-[4px] bg-[rgba(247,246,242,0.8)] border border-[rgba(0,0,0,0.25)] shadow-2xl p-3.5 flex flex-col gap-3"
            >
              <MenuItem label="Report User" danger />
              <MenuItem label="Block User" danger />
              <div className="h-px bg-black/10" />
              <MenuItem label="Edit profile" />
              <MenuItem label="Verification" />
              <div className="h-px bg-black/10" />
              <MenuItem label="Settings" />
              <MenuItem label="User Sharecode" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-x-3 top-[136px] bottom-[82px] overflow-hidden" onClick={() => setMenuOpen(false)}>
          <ActiveChatList />
          <NotificationCenter tab={tab} onTabChange={setTab} className="top-[53px]" />
        </div>

        <BottomNav />
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="relative z-20 flex items-center justify-between px-5 pt-[21px] pb-[19px] text-[#f7f6f2]">
      <span
        className="text-[17px] font-semibold leading-[22px]"
        style={{ fontFamily: "SF Pro, system-ui, -apple-system, sans-serif" }}
      >
        9:41
      </span>
      <div className="flex items-center gap-[7px]">
        <div className="relative size-[12.226px] w-[19.2px] h-[12.226px]">
          <img alt="" src={cellularIcon} className="absolute inset-0 size-full max-w-none" />
        </div>
        <div className="relative w-[17.142px] h-[12.328px]">
          <img alt="" src={wifiIcon} className="absolute inset-0 size-full max-w-none" />
        </div>
        <div className="relative w-[27.328px] h-[13px]">
          <img alt="" src={batteryIcon} className="absolute inset-0 size-full max-w-none" />
        </div>
      </div>
    </div>
  );
}

function CrcleMark() {
  return (
    <div className="flex justify-center pb-[17px]">
      <div className="relative h-[8.942px] w-[25.996px]">
        <img alt="crcle" src={crcleLogo} className="absolute inset-0 size-full max-w-none" />
      </div>
    </div>
  );
}

function MessagesHeader({ menuOpen, onToggleMenu }: { menuOpen: boolean; onToggleMenu: () => void }) {
  return (
    <div className="relative z-20 flex items-center justify-between px-3">
      <button
        type="button"
        className="backdrop-blur-[2px] bg-[rgba(253,252,251,0.1)] border border-[#f7f6f2] rounded-[40px] p-1 flex items-center justify-center size-10"
        aria-label="Back"
      >
        <div className="relative size-4 overflow-clip">
          <img alt="" src={arrowLeftIcon} className="absolute inset-0 size-full max-w-none" />
        </div>
      </button>

      <h1 className="flex-1 text-center text-[19px] font-normal leading-none text-[#f7f6f2]" style={{ fontFamily: FONT }}>
        Messages
      </h1>

      <button
        type="button"
        onClick={onToggleMenu}
        aria-expanded={menuOpen}
        className="backdrop-blur-[3px] bg-[rgba(253,252,251,0.1)] border border-[#f7f6f2] rounded-[24px] px-2 py-0.5 flex items-center justify-center w-12 h-10"
        aria-label="More options"
      >
        <div className="relative size-6 overflow-clip">
          <img alt="" src={moreHorizIcon} className="absolute inset-0 size-full max-w-none" />
          <div className="absolute inset-[41.67%_16.67%]">
            <img alt="" src={moreDotsIcon} className="absolute inset-0 size-full max-w-none" />
          </div>
        </div>
      </button>
    </div>
  );
}

function ActiveChatList() {
  return (
    <div className="absolute inset-x-0 top-0 flex flex-col gap-3">
      <div className="flex items-center justify-between px-0">
        <p className="text-[15px] leading-[21px] text-[#030426]" style={{ fontFamily: FONT }}>
          Active Chats
        </p>
        <p className="text-[13px] font-light leading-[18.2px] text-[#6b7280]" style={{ fontFamily: FONT }}>
          4 conversations
        </p>
      </div>

      <div className="flex flex-col">
        {Array.from({ length: 3 }).map((_, i) => (
          <ActiveChatRow key={i} />
        ))}
      </div>
    </div>
  );
}

function ActiveChatRow() {
  return (
    <div className="flex items-center justify-between border-b border-[rgba(247,246,242,0.2)] p-3">
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <div className="flex items-end shrink-0">
          <div className="relative mr-[-8px] size-[42px] overflow-hidden rounded-[120px] border border-[#f7f6f2]">
            <img
              alt=""
              src={avatarImg}
              className="absolute h-[180.43%] left-[-7.14%] max-w-none top-[-24.58%] w-[120.23%]"
            />
          </div>
          <div className="relative size-3 shrink-0 rounded-full border-2 border-[#0fc950]" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] leading-[18.75px] text-[#f7f6f2] whitespace-nowrap" style={{ fontFamily: FONT }}>
              Sarah Chen
            </span>
            <div className="relative size-4 shrink-0 overflow-clip rounded-[2px]">
              <img alt="" src={fireIcon} className="absolute inset-0 size-full max-w-none" />
              <div className="absolute inset-[6.23%_16.68%_8.33%_16.67%]">
                <img alt="" src={fireInnerIcon} className="absolute inset-0 size-full max-w-none" />
              </div>
            </div>
          </div>
          <p className="truncate text-[13px] font-light leading-[16.25px] text-[#6b7280]" style={{ fontFamily: FONT }}>
            Let&apos;s catch up next week
          </p>
        </div>
      </div>

      <div className="flex w-5 shrink-0 flex-col items-end gap-1">
        <span className="text-[11px] font-light leading-[1.4] text-[#9ca3af] whitespace-nowrap" style={{ fontFamily: FONT }}>
          1d
        </span>
        <div className="flex size-5 items-center justify-center rounded-full bg-[rgba(247,246,242,0.2)]">
          <span className="text-[11px] leading-[16.5px] text-white" style={{ fontFamily: FONT }}>
            2
          </span>
        </div>
      </div>
    </div>
  );
}

function NotificationCenter({
  tab,
  onTabChange,
  className = "",
}: {
  tab: "sent" | "received";
  onTabChange: (tab: "sent" | "received") => void;
  className?: string;
}) {
  return (
    <div className={`absolute inset-x-0 z-10 flex flex-col ${className}`}>
      <div
        className="relative overflow-hidden rounded-tl-[16px] rounded-tr-[16px]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgb(30, 41, 57) 0%, rgb(30, 41, 57) 100%), linear-gradient(90deg, rgb(247, 246, 242) 0%, rgb(247, 246, 242) 100%)",
        }}
      >
        <NotificationDecorations />

        <div className="relative flex items-start justify-center px-3 pb-4 pt-3">
          <div className="flex flex-1 flex-col items-center gap-3">
            <p className="w-full text-[15px] leading-[21px] text-[#f7f6f2]" style={{ fontFamily: FONT }}>
              Notifications
            </p>
            <SentReceivedToggle tab={tab} onChange={onTabChange} />
          </div>
          <div className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-[rgba(247,246,242,0.2)]">
            <span className="text-[13px] leading-[18.2px] text-white" style={{ fontFamily: FONT }}>
              2
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col gap-4 rounded-bl-[28px] rounded-br-[28px] border border-[rgba(247,246,242,0.2)] border-t-0 bg-[rgba(2,3,29,0.2)] px-[9px] py-[11px] backdrop-blur-[4px]">
        <DailyDropBanner />
        <ConnectionAvatars />
        <div className="absolute left-1/2 top-[129.8px] h-0 w-9 -translate-x-1/2">
          <img alt="" src={dragHandle} className="block size-full max-w-none" />
        </div>
      </div>
    </div>
  );
}

function NotificationDecorations() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img alt="" src={notificationBg} className="absolute left-[-8px] top-[-7px] h-[201px] w-[486px] max-w-none" />
      </div>
    </>
  );
}

function SentReceivedToggle({
  tab,
  onChange,
}: {
  tab: "sent" | "received";
  onChange: (tab: "sent" | "received") => void;
}) {
  return (
    <div className="flex w-[178px] items-center gap-1 rounded-[24px] bg-[rgba(255,255,255,0.05)] p-1 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.05)]">
      <button
        type="button"
        onClick={() => onChange("sent")}
        className={`flex flex-1 items-center justify-center px-2.5 py-1 text-[13px] leading-[1.4] ${
          tab === "sent" ? "rounded-[20px] bg-[rgba(2,3,29,0.2)] text-white" : "text-[#f7f6f2]"
        }`}
        style={{ fontFamily: FONT }}
      >
        Sent
      </button>
      <button
        type="button"
        onClick={() => onChange("received")}
        className={`flex flex-1 items-center justify-center p-1 text-[13px] leading-[1.4] ${
          tab === "received" ? "rounded-[20px] bg-[rgba(2,3,29,0.2)] text-white" : "text-[#f7f6f2]"
        }`}
        style={{ fontFamily: FONT }}
      >
        Received
      </button>
    </div>
  );
}

function DailyDropBanner() {
  return (
    <div className="w-full rounded-[64px] bg-[rgba(222,221,218,0.6)] backdrop-blur-[13px] pl-4 pr-2 py-1.5">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] leading-[1.4] text-[#030426]" style={{ fontFamily: FONT }}>
            Daily Drop is ready
          </p>
          <p className="truncate text-[13px] font-light leading-[1.4] text-[#f7f6f2]" style={{ fontFamily: FONT }}>
            3 new people to discover.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-[36px] bg-[#f7f6f2] px-4 py-2 text-[11px] leading-[1.4] text-[#02031d] whitespace-nowrap"
          style={{ fontFamily: FONT }}
        >
          View
        </button>
      </div>
    </div>
  );
}

function ConnectionAvatars() {
  return (
    <div className="flex items-start gap-4">
      <ConnectionAvatar badge="laptop" />
      <ConnectionAvatar badge="heart" overlay="tuning" />
    </div>
  );
}

function ConnectionAvatar({
  badge,
  overlay,
}: {
  badge: "laptop" | "heart";
  overlay?: "tuning";
}) {
  return (
    <div className="relative flex size-[53px] shrink-0 items-center justify-center rounded-[26.5px] border border-[#11df59] bg-[rgba(253,252,251,0.3)] p-0.5">
      <div className="relative size-[46px] overflow-hidden rounded-[120px] border border-[#f7f6f2]">
        <img
          alt=""
          src={avatarImg}
          className="absolute h-[180.43%] left-[-7.14%] max-w-none top-[-24.58%] w-[120.23%]"
        />
        {overlay === "tuning" && <div className="absolute inset-0 rounded-[120px] bg-[rgba(0,0,0,0.6)]" />}
      </div>

      <div className="absolute left-[-3px] top-[-3.94px] flex size-5 items-center justify-center rounded-[64px] border-[0.5px] border-[#f7f6f2] bg-[rgba(253,252,251,0.8)] p-1 backdrop-blur-[0.5px]">
        {badge === "laptop" ? (
          <div className="relative h-3 w-3.5 overflow-clip">
            <img alt="" src={laptopIcon} className="absolute inset-0 size-full max-w-none" />
          </div>
        ) : (
          <div className="relative size-3.5">
            <img alt="" src={heartIcon} className="absolute inset-0 size-full max-w-none" />
          </div>
        )}
      </div>

      {overlay === "tuning" && (
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[2.3px]">
          <span className="h-[8.829px] w-[4.528px] rounded-[11.472px] bg-[#f7f6f2]" />
          <span className="h-[14.715px] w-[4.528px] rounded-[11.472px] bg-[#f7f6f2]" />
          <span className="h-[8.829px] w-[4.528px] rounded-[11.472px] bg-[#f7f6f2]" />
        </div>
      )}
    </div>
  );
}

function BottomNav() {
  return (
    <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
      <div className="flex items-center justify-between backdrop-blur-[6px] rounded-[36px] border border-[#f7f6f2] bg-[rgba(247,246,242,0.1)] px-4 py-2.5 gap-4">
        <div className="relative size-6 overflow-clip">
          <img alt="" src={navUserIcon} className="absolute inset-0 size-full max-w-none" />
        </div>

        <div className="flex items-center gap-[2.8px] rounded-[119.467px] backdrop-blur-[7.467px]">
          <span className="h-[8.4px] w-[5.6px] rounded-[18.667px] bg-[#f7f6f2]" />
          <span className="h-[14px] w-[5.6px] rounded-[18.667px] bg-[#f7f6f2]" />
          <span className="h-[8.4px] w-[5.6px] rounded-[18.667px] bg-[#f7f6f2]" />
        </div>

        <div className="relative size-6 overflow-clip">
          <img alt="" src={navMessageIcon} className="absolute inset-0 size-full max-w-none" />
        </div>
      </div>
    </div>
  );
}

function MenuItem({ label, danger }: { label: string; danger?: boolean }) {
  return (
    <button
      type="button"
      className={`flex items-center gap-2 text-[11px] font-medium ${danger ? "text-[#e60000]" : "text-[#030422]"}`}
      style={{ fontFamily: FONT }}
    >
      {label}
    </button>
  );
}

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useCallback, useState, type ReactNode } from "react";
import alexPortrait from "@/assets/crcle/alex-portrait.png";
import areaArrowLeftIcon from "@/assets/crcle/area-arrow-left.svg";
import areaArrowRightIcon from "@/assets/crcle/area-arrow-right.svg";
import areaCardPinIcon from "@/assets/crcle/area-card-pin.svg";
import areaHandleIcon from "@/assets/crcle/area-handle.svg";
import areaHeartIcon from "@/assets/crcle/area-heart.svg";
import areaLinkIcon from "@/assets/crcle/area-link.svg";
import areaShareIcon from "@/assets/crcle/area-share.svg";
import areaUnlockIcon from "@/assets/crcle/area-unlock.svg";
import arrowChevronIcon from "@/assets/crcle/arrow-chevron.svg";
import arrowRightIcon from "@/assets/crcle/arrow-right.svg";
import avatarBackdrop from "@/assets/crcle/avatar.png";
import fireInnerIcon from "@/assets/crcle/fire-inner.svg";
import mapPinIcon from "@/assets/crcle/map-pin.svg";
import serenaAreaPhoto from "@/assets/crcle/serena-area-photo.png";
import serenaPortrait from "@/assets/crcle/serena-portrait.png";
import laptopStrokeIcon from "@/assets/crcle/signal/laptop-stroke.svg";
import unlockIcon from "@/assets/crcle/unlock.svg";
import navRadarIcon from "@/assets/crcle/nav-radar.svg";

const FONT = "Montserrat, ui-sans-serif, system-ui, sans-serif";
const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 380, damping: 22, mass: 0.8 } as const;
const DRAG_THRESHOLD = 48;

type AreaCategory = "love" | "purpose" | "soul";
const CATEGORIES: AreaCategory[] = ["love", "purpose", "soul"];

export type AreaPanelPhase = "off" | "screen" | "drawer";
export type NearbySheetStep = "prompt" | "request_sent" | "connected";
/** Nearby prompt appears this long after In The Area is pressed — live araguiar.design. */
export const AREA_CONNECTED_DELAY_MS = 2000;

export function InTheAreaDropdown({
  phase,
  isLight,
  onExpand,
  onCollapse,
  onConnect,
  onMarkRead,
}: {
  phase: "screen" | "drawer";
  isLight: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onConnect: () => void;
  onMarkRead: () => void;
}) {
  const expanded = phase === "drawer";

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: EASE }}
      className="pointer-events-auto absolute inset-x-[3px] top-[65px] z-[61] flex flex-col"
      role="dialog"
      aria-label="In The Area"
      data-node-id="1290:39417"
    >
      <div
        className={`relative flex w-full flex-col items-center gap-4 border-x border-solid border-[rgba(0,0,0,0.25)] px-[13px] pb-3 pt-4 ${
          isLight ? "border-[rgba(2,3,29,0.12)]" : ""
        }`}
        style={{
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
          backgroundImage:
            "linear-gradient(182.315deg, rgba(255,255,255,0.4) 25.54%, rgba(2,3,29,0.04) 98.487%)",
        }}
      >
        <button
          type="button"
          onClick={() => (expanded ? onCollapse() : onExpand())}
          className="flex w-full items-center gap-3"
          aria-expanded={expanded}
        >
          <span className="flex size-5 shrink-0 items-center justify-center rounded-[64px] border border-[rgba(0,0,0,0.25)] bg-[rgba(17,223,89,0.8)] p-1">
            <img alt="" src={mapPinIcon} className="h-3 w-[7px] object-contain brightness-0 invert" />
          </span>
          <p
            className="min-w-0 flex-1 text-center text-[19px] font-medium leading-[1.4] text-[#f7f6f2] [.crcle-phone--light_&]:text-[#030426]"
            style={{ fontFamily: FONT }}
          >
            In The Area
          </p>
          <span className="size-5 shrink-0" aria-hidden />
        </button>

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key="drawer"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
              className="w-full overflow-hidden"
            >
              <div className="flex w-full flex-col items-center gap-4">
                <AreaMatchCard onConnect={onConnect} />
                <EmmaConnectRow onConnect={onConnect} variant="outlined" />
                <button
                  type="button"
                  onClick={onMarkRead}
                  className="w-full rounded-[36px] border border-[#f7f6f2] p-3 text-center text-[14px] leading-[21px] text-[#f7f6f2] transition hover:bg-white/5 [.crcle-phone--light_&]:border-[#030426] [.crcle-phone--light_&]:text-[#030426]"
                  style={{ fontFamily: FONT }}
                >
                  Mark as read
                </button>
              </div>
            </motion.div>
          ) : (
            <div key="peek" className="w-full">
              <EmmaConnectRow onConnect={onConnect} variant="outlined" />
            </div>
          )}
        </AnimatePresence>

        <button
          type="button"
          aria-label={expanded ? "Collapse In The Area" : "Expand In The Area"}
          onClick={() => (expanded ? onCollapse() : onExpand())}
          className="mx-auto flex h-[3px] w-[39px] touch-none items-center justify-center"
        >
          <img alt="" src={areaHandleIcon} width={39} height={3} draggable={false} />
        </button>
      </div>
    </motion.div>
  );
}

function EmmaConnectRow({
  onConnect,
  variant = "plain",
}: {
  onConnect: () => void;
  variant?: "plain" | "outlined";
}) {
  const outlined = variant === "outlined";
  return (
    <div
      className={
        outlined
          ? "w-full rounded-[36px] border border-[#0fc950] bg-[#02031d] py-2 pl-4 pr-2 [.crcle-phone--light_&]:bg-[#f7f6f2]"
          : "w-full"
      }
    >
      <div className="flex w-full items-center gap-2">
        <div className="min-w-0 flex-1 text-left">
          <p
            className="text-[13px] font-semibold leading-[1.4] text-[#f7f6f2] [.crcle-phone--light_&]:text-[#030426]"
            style={{ fontFamily: FONT }}
          >
            Emma Rodriguez
          </p>
          <p className="text-[12px] leading-normal text-[#9ca3af]" style={{ fontFamily: FONT }}>
            Same venue detected · <span className="text-[#0fc950]">privacy protected</span>
          </p>
        </div>
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onConnect();
          }}
          className={`relative z-[2] shrink-0 rounded-[36px] bg-[rgba(247,246,242,0.2)] text-[11px] leading-[1.4] text-[#f7f6f2] [.crcle-phone--light_&]:bg-[#030426] [.crcle-phone--light_&]:text-[#fefefe] ${
            outlined ? "px-3 py-1.5" : "px-4 py-2"
          }`}
          style={{ fontFamily: FONT }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          Connect
        </motion.button>
      </div>
    </div>
  );
}

function AreaMatchCard({ onConnect }: { onConnect: () => void }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const category = CATEGORIES[index];
  const icon = category === "love" ? areaHeartIcon : category === "purpose" ? fireInnerIcon : laptopStrokeIcon;

  const goTo = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setIndex((next + CATEGORIES.length) % CATEGORIES.length);
  }, []);
  const goPrev = useCallback(() => goTo(index - 1, -1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1, 1), [goTo, index]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -DRAG_THRESHOLD || info.velocity.x < -200) goNext();
    else if (info.offset.x > DRAG_THRESHOLD || info.velocity.x > 200) goPrev();
  };

  return (
    <div className="flex w-full flex-col items-start">
      <div className="flex w-full items-center justify-center rounded-tl-[24px] rounded-tr-[24px] border-x border-t border-[rgba(0,0,0,0.25)] bg-[#02031d] p-3 [.crcle-phone--light_&]:bg-[#f7f6f2]">
        <EmmaConnectRow onConnect={onConnect} variant="plain" />
      </div>

      <div className="relative flex h-[251px] w-full flex-col justify-between overflow-hidden rounded-bl-[24px] rounded-br-[24px] border border-[rgba(247,246,242,0.3)] p-2">
        <img
          alt=""
          src={serenaAreaPhoto}
          className="pointer-events-none absolute inset-0 size-full rounded-bl-[24px] rounded-br-[24px] object-cover"
          draggable={false}
        />

        <div className="relative z-[1] flex min-h-0 flex-1 items-start justify-between">
          <div className="flex items-center gap-2 rounded-[120px] bg-[rgba(247,246,242,0.1)] p-1">
            <span className="inline-flex items-center gap-2.5 rounded-[64px] border border-[#f7f6f2] bg-[rgba(247,246,242,0.2)] p-2.5 backdrop-blur-[6px]">
              <span className="text-[11px] leading-[1.4] text-white" style={{ fontFamily: FONT }}>
                @SerenaMin
              </span>
              <img alt="" src={areaShareIcon} width={12} height={12} draggable={false} />
            </span>
            <span
              className="rounded-[120px] bg-[#f7f6f2] px-3 py-1.5 text-[13px] leading-[1.4] text-black"
              style={{ fontFamily: FONT }}
            >
              24 Yrs
            </span>
          </div>
          <span className="flex size-8 items-center justify-center rounded-[120px] bg-[#f7f6f2] p-1">
            <img alt="" src={areaLinkIcon} width={16} height={16} draggable={false} />
          </span>
        </div>

        <div className="relative z-[1] flex w-full flex-col items-center gap-2 rounded-[20px] bg-[rgba(247,246,242,0.2)] p-3">
          <div className="flex w-full items-start justify-between">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={SPRING}
                className="flex size-3.5 items-center justify-center overflow-hidden"
              >
                <img alt="" src={icon} width={14} height={14} draggable={false} />
              </motion.span>
            </AnimatePresence>
            <img alt="" src={areaCardPinIcon} width={22} height={22} draggable={false} />
          </div>

          <motion.div
            className="flex items-center gap-[50px]"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={onDragEnd}
          >
            <motion.button
              type="button"
              aria-label="Previous category"
              onClick={goPrev}
              className="relative flex size-6 shrink-0 items-center justify-center"
              whileTap={{ scale: 0.9 }}
            >
              <span className="inline-flex -scale-y-100 rotate-180">
                <img alt="" src={areaArrowLeftIcon} width={24} height={24} draggable={false} />
              </span>
            </motion.button>

            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={category}
                custom={direction}
                variants={{
                  enter: (dir: number) => ({ x: dir >= 0 ? 36 : -36, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (dir: number) => ({ x: dir >= 0 ? -36 : 36, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={SPRING}
                className="flex items-center gap-3 rounded-[120px] bg-[rgba(2,3,29,0.16)] p-1.5"
              >
                {category === "love" ? (
                  <>
                    <span className="flex items-center gap-1 rounded-[120px] bg-[#f7f6f2] px-2 py-1.5">
                      <img alt="" src={areaUnlockIcon} width={16} height={16} draggable={false} />
                      <span className="text-[16px] leading-[1.4] text-[#030426]" style={{ fontFamily: FONT }}>
                        Single
                      </span>
                    </span>
                    <span
                      className="rounded-[120px] border border-[#f7f6f2] px-3 py-1.5 text-[16px] leading-[1.4] text-white"
                      style={{ fontFamily: FONT }}
                    >
                      Hetero
                    </span>
                  </>
                ) : category === "purpose" ? (
                  <span
                    className="rounded-[120px] bg-[rgba(247,246,242,0.15)] px-3 py-1.5 text-[16px] text-white"
                    style={{ fontFamily: FONT }}
                  >
                    Learn · Mind
                  </span>
                ) : (
                  <span
                    className="rounded-[120px] bg-[rgba(247,246,242,0.4)] px-3 py-1.5 text-[16px] text-[#020426]"
                    style={{ fontFamily: FONT }}
                  >
                    Product Designer
                  </span>
                )}
              </motion.div>
            </AnimatePresence>

            <motion.button
              type="button"
              aria-label="Next category"
              onClick={goNext}
              className="relative flex size-6 shrink-0 items-center justify-center"
              whileTap={{ scale: 0.9 }}
            >
              <img alt="" src={areaArrowRightIcon} width={24} height={24} draggable={false} />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/** Figma 1142:34918 — radar + pin. Opens the notifications nearby sheet. */
export function AreaNotificationsButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22, ease: EASE }}
      className="pointer-events-auto absolute bottom-5 left-[calc(50%-127.2px)] z-[62] flex items-center"
      aria-label="Open nearby notifications"
      data-node-id="1142:34918"
    >
      <span className="mr-[-12px] flex h-11 w-11 items-center justify-center rounded-[46px] bg-[rgba(247,246,242,0.4)] p-2.5 backdrop-blur-[6px]">
        <img alt="" src={navRadarIcon} className="size-6 max-w-none object-contain" draggable={false} />
      </span>
      <span className="flex size-5 flex-col items-center justify-center rounded-[64px] bg-[rgba(17,223,89,0.8)] p-1">
        <img alt="" src={mapPinIcon} className="h-3 w-[7px] object-contain brightness-0 invert" />
      </span>
    </motion.button>
  );
}

function NearbyGlassSheet({
  children,
  isLight = false,
}: {
  children: ReactNode;
  isLight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.32, ease: EASE }}
      className="pointer-events-auto absolute bottom-2 left-2 right-2 z-10"
    >
      <div
        className={`pointer-events-none crcle-nearby-modal-glass relative flex w-full flex-col items-center gap-4 overflow-hidden rounded-[52px] p-6 shadow-2xl ${
          isLight ? "crcle-nearby-modal-glass--light" : ""
        }`}
      >
        <div aria-hidden className="crcle-nearby-modal-glass-backdrop rounded-[inherit]">
          <img
            alt=""
            src={avatarBackdrop}
            className="absolute left-1/2 top-1/2 h-[220%] w-[220%] max-w-none -translate-x-1/2 -translate-y-[58%] scale-110 object-cover object-[center_20%]"
            draggable={false}
          />
          <div className="absolute inset-0 bg-[rgba(2,3,29,0.52)]" />
        </div>
        <div aria-hidden className="crcle-nearby-modal-glass-plate rounded-[inherit]" />
        <div aria-hidden className="crcle-nearby-modal-glass-frost rounded-[inherit]" />
        <div aria-hidden className="crcle-nearby-modal-glass-lens rounded-[inherit]" />
        <div aria-hidden className="crcle-nearby-modal-glass-dispersion rounded-[inherit]" />
        <div className="pointer-events-auto relative z-[1] flex w-full flex-col items-center gap-4">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function NearbyPinMark({ isLight = false, className = "" }: { isLight?: boolean; className?: string }) {
  return (
    <span
      className={`flex size-5 shrink-0 items-center justify-center rounded-[64px] bg-[rgba(17,223,89,0.8)] p-1 ${
        isLight ? "border border-[rgba(0,0,0,0.25)]" : ""
      } ${className}`}
    >
      <img alt="" src={mapPinIcon} className="h-3 w-[7px] object-contain brightness-0 invert" />
    </span>
  );
}

function NearbyDoneButton({ isLight, onClick }: { isLight: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative z-[1] flex h-12 w-full items-center justify-center rounded-[24px] px-4 text-[14px] font-bold leading-normal transition hover:brightness-95 ${
        isLight
          ? "border border-[rgba(2,3,29,0.12)] bg-[#02031d] text-[#f7f6f2]"
          : "border border-[rgba(255,255,255,0.15)] bg-[#f7f6f2] text-[#02031d]"
      }`}
      style={{ fontFamily: FONT }}
    >
      Done
    </button>
  );
}

/** Live araguiar.design: prompt → request sent → connected with Alex. */
export function NearbyConnectionModal({
  step,
  isLight,
  onDismiss,
  onAccept,
  onAdvance,
  onDone,
}: {
  step: NearbySheetStep;
  isLight: boolean;
  onDismiss: () => void;
  onAccept: () => void;
  onAdvance: () => void;
  onDone: () => void;
}) {
  const title =
    step === "prompt"
      ? "Nearby connection"
      : step === "request_sent"
        ? "Connection request sent"
        : "Connection established";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: EASE }}
      className="pointer-events-auto absolute inset-0 z-[63] isolate overflow-hidden rounded-[53px]"
      style={{ clipPath: "inset(0 round 53px)" }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Dismiss"
        className={`pointer-events-auto absolute inset-0 z-0 backdrop-blur-[8px] ${
          isLight ? "bg-[rgba(2,3,29,0.28)]" : "bg-black/45"
        }`}
        onClick={() => {
          if (step === "prompt") onDismiss();
        }}
      />

      <NearbyGlassSheet isLight={isLight}>
        <AnimatePresence mode="wait" initial={false}>
          {step === "prompt" ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={SPRING}
              className="flex w-full flex-col items-center gap-4"
            >
              <NearbyPromptSheet isLight={isLight} onDismiss={onDismiss} onAccept={onAccept} />
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={SPRING}
              className="flex w-full flex-col items-center gap-4"
            >
              <NearbyResultSheet
                step={step}
                isLight={isLight}
                onDone={step === "request_sent" ? onAdvance : onDone}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </NearbyGlassSheet>
    </motion.div>
  );
}

function NearbyPromptSheet({
  isLight,
  onDismiss,
  onAccept,
}: {
  isLight: boolean;
  onDismiss: () => void;
  onAccept: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const category = CATEGORIES[index];

  const goTo = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setIndex((next + CATEGORIES.length) % CATEGORIES.length);
  }, []);
  const goPrev = useCallback(() => goTo(index - 1, -1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -DRAG_THRESHOLD || info.velocity.x < -200) goNext();
    else if (info.offset.x > DRAG_THRESHOLD || info.velocity.x > 200) goPrev();
  };

  return (
    <>
      <div className="flex w-full flex-col items-center gap-6">
        <NearbyPinMark isLight={isLight} />
        <span className="h-px w-full bg-[rgba(247,246,242,0.18)]" />
      </div>

      <div className="flex w-full items-start justify-end gap-4 pr-1">
        <div className="flex w-[46px] items-end rounded-[64px] border-[0.5px] border-[rgba(247,246,242,0.4)] p-[2px]">
          <div className="-mr-2 size-[42px] overflow-hidden rounded-full border border-[rgba(247,246,242,0.3)]">
            <img alt="" src={serenaPortrait} className="size-full object-cover" />
          </div>
          <span className="relative z-[1] size-3 shrink-0 rounded-full border-2 border-[#0fc950]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[18px] font-semibold leading-normal text-white [.crcle-phone--light_&]:text-[#02031d]" style={{ fontFamily: FONT }}>
            Serena Min is nearby
          </p>
          <p className="text-[12px] leading-normal text-[#9ca3af]" style={{ fontFamily: FONT }}>
            Same venue detected · privacy protected
          </p>
        </div>
      </div>

      <motion.div
        className="flex w-full items-center justify-between"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.25}
        onDragEnd={onDragEnd}
      >
        <button type="button" aria-label="Previous category" onClick={goPrev} className="flex size-6 items-center justify-center">
          <div className="relative size-6 -scale-y-100 rotate-180 overflow-hidden">
            <img alt="" src={arrowRightIcon} className="size-6" />
            <div className="absolute inset-[29.17%_37.5%]">
              <img alt="" src={arrowChevronIcon} className="size-full" />
            </div>
          </div>
        </button>
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={category}
            custom={direction}
            variants={{
              enter: (dir: number) => ({ x: dir >= 0 ? 28 : -28, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (dir: number) => ({ x: dir >= 0 ? -28 : 28, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={SPRING}
            className="flex items-center gap-3 rounded-[120px] bg-[rgba(247,246,242,0.1)] p-1.5"
          >
            {category === "love" ? (
              <>
                <span className="flex items-center gap-1 rounded-[120px] bg-[#f7f6f2] px-2 py-1.5">
                  <img alt="" src={unlockIcon} className="size-4" />
                  <span className="text-[16px] leading-[1.4] text-[#030426]" style={{ fontFamily: FONT }}>
                    Single
                  </span>
                </span>
                <span className="rounded-[120px] border border-[#f7f6f2] px-3 py-1.5 text-[16px] leading-[1.4] text-white [.crcle-phone--light_&]:border-[#030426] [.crcle-phone--light_&]:text-[#030426]" style={{ fontFamily: FONT }}>
                  Hetero
                </span>
              </>
            ) : category === "purpose" ? (
              <span className="rounded-[120px] bg-[rgba(247,246,242,0.15)] px-3 py-1.5 text-[16px] text-white" style={{ fontFamily: FONT }}>
                Learn · Mind
              </span>
            ) : (
              <span className="rounded-[120px] bg-[rgba(247,246,242,0.4)] px-3 py-1.5 text-[16px] text-[#020426]" style={{ fontFamily: FONT }}>
                Product Designer
              </span>
            )}
          </motion.div>
        </AnimatePresence>
        <button type="button" aria-label="Next category" onClick={goNext} className="flex size-6 items-center justify-center">
          <div className="relative size-6 overflow-hidden">
            <img alt="" src={arrowRightIcon} className="size-6" />
            <div className="absolute inset-[29.17%_37.5%]">
              <img alt="" src={arrowChevronIcon} className="size-full" />
            </div>
          </div>
        </button>
      </motion.div>

      <p className="w-full text-center text-[14px] font-medium text-white [.crcle-phone--light_&]:text-[#02031d]" style={{ fontFamily: FONT }}>
        Would you like to connect?
      </p>

      <div className="flex w-full items-start gap-3">
        <button
          type="button"
          onClick={onDismiss}
          className="flex h-12 flex-1 items-center justify-center rounded-3xl bg-[rgba(255,255,255,0.2)] px-4 text-[14px] font-semibold text-[#f7f6f2] [.crcle-phone--light_&]:bg-[rgba(2,3,29,0.12)] [.crcle-phone--light_&]:text-[#02031d]"
          style={{ fontFamily: FONT }}
        >
          Dismiss
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="flex h-12 flex-1 items-center justify-center rounded-3xl bg-[#f7f6f2] px-4 text-[14px] font-semibold text-[#02031d] [.crcle-phone--light_&]:bg-[#02031d] [.crcle-phone--light_&]:text-[#f7f6f2]"
          style={{ fontFamily: FONT }}
        >
          Connect
        </button>
      </div>
      <p className="w-full text-center text-[10px] font-medium text-[#9ca3af]" style={{ fontFamily: FONT }}>
        No exact location shared · double opt-in required
      </p>
    </>
  );
}

function NearbyResultSheet({
  step,
  isLight,
  onDone,
}: {
  step: "request_sent" | "connected";
  isLight: boolean;
  onDone: () => void;
}) {
  const titleColor = isLight ? "text-[#02031d]" : "text-white";
  const requestSent = step === "request_sent";

  return (
    <>
      <div className="flex w-full flex-col items-start">
        <NearbyPinMark isLight={isLight} className="-mb-5 self-start" />
        {requestSent ? (
          <div className="flex w-full items-center justify-center pr-1">
            <div
              className={`flex w-[67px] items-end rounded-[64px] border-[0.5px] p-[2px] ${
                isLight
                  ? "border-[rgba(2,3,29,0.15)] bg-[rgba(255,255,255,0.65)]"
                  : "border-[rgba(247,246,242,0.4)] bg-[rgba(255,255,255,0.5)]"
              }`}
            >
              <div
                className={`-mr-3 size-16 shrink-0 overflow-hidden rounded-full border ${
                  isLight ? "border-[rgba(2,3,29,0.12)]" : "border-[rgba(247,246,242,0.3)]"
                }`}
              >
                <img alt="" src={serenaPortrait} className="size-full object-cover" />
              </div>
              <span
                className="relative z-[1] size-3 shrink-0 rounded-full border-2 border-[#0fc950] bg-[rgba(15,201,80,0.2)]"
                aria-hidden
              />
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center pr-1">
            <div className="flex items-center">
              <div
                className={`-mr-3 flex w-[67px] items-end rounded-[64px] border-[0.5px] p-[2px] ${
                  isLight
                    ? "border-[rgba(15,201,80,0.2)] bg-[rgba(255,255,255,0.65)]"
                    : "border-[rgba(15,201,80,0.15)] bg-[rgba(255,255,255,0.5)]"
                }`}
              >
                <div
                  className={`size-16 shrink-0 overflow-hidden rounded-full border ${
                    isLight ? "border-[rgba(2,3,29,0.12)]" : "border-[rgba(247,246,242,0.3)]"
                  }`}
                >
                  <img alt="" src={serenaPortrait} className="size-full object-cover" />
                </div>
              </div>
              <div
                className={`flex size-[67px] items-center justify-center rounded-[64px] border-[0.5px] border-[#0fc950] p-[2px] ${
                  isLight ? "bg-[rgba(247,246,242,0.65)]" : "bg-[rgba(247,246,242,0.4)]"
                }`}
              >
                <div className="size-[62px] shrink-0 overflow-hidden rounded-full">
                  <img alt="" src={alexPortrait} className="size-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex w-full flex-col items-center gap-1.5 text-center">
        <p className={`text-[18px] font-semibold leading-normal ${titleColor}`} style={{ fontFamily: FONT }}>
          {requestSent ? "Request sent to Serena Min" : "You're connected with Alex!"}
        </p>
        <p className="text-[13px] leading-normal text-[#9ca3af]" style={{ fontFamily: FONT }}>
          {requestSent ? "You'll be notified immediately when they respond." : "You can now message each other safely."}
        </p>
      </div>
      <NearbyDoneButton isLight={isLight} onClick={onDone} />
      <p className="w-full text-center text-[10px] font-medium leading-normal text-[#9ca3af]" style={{ fontFamily: FONT }}>
        No exact location shared · double opt-in required
      </p>
    </>
  );
}

import { useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import avocadoIcon from "@/assets/portfolio/thought/avocado.svg";
import handleIcon from "@/assets/portfolio/thought/handle.svg";
import moreIcon from "@/assets/portfolio/thought/more.svg";
import { cn } from "@/lib/utils";

const FONT = "Helvetica, Arial, sans-serif";
const SPRING = { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.8 };
const DRAG_OPEN = 28;
const DRAG_CLOSE = -24;
const EXPANDED_H = 234;

const THOUGHT =
  "Design is an invitation to experiment: to try, to play, to wonder “what if?” Beyond what it does, it can surprise us, spark a smile, or gently nudge us to see things differently. Function matters, but it is not the whole story. Even the most practical thing has room for curiosity, delight, and a little mischief. Play is not a detour from meaning; it is one way we find it.";

/**
 * Figma 2305:66729 collapsed / 2305:66699 expanded.
 * Drag the handle downward to open the thought, upward to close.
 */
export function FoodForThought({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > DRAG_OPEN || info.velocity.y > 220) setOpen(true);
    else if (info.offset.y < DRAG_CLOSE || info.velocity.y < -220) setOpen(false);
  };

  return (
    <motion.div
      layout
      data-node-id={open ? "2305:66699" : "2305:66729"}
      animate={{ height: open ? EXPANDED_H : "auto" }}
      transition={SPRING}
      className={cn(
        "relative flex w-[246px] shrink-0 flex-col items-center overflow-hidden rounded-[22px] border border-solid border-[rgba(148,138,220,0.65)] shadow-[0px_4px_10px_rgba(0,0,0,0.15)] backdrop-blur-[20px] backdrop-saturate-150",
        open
          ? "bg-[linear-gradient(151deg,rgba(228,218,255,0.65)_19.5%,rgba(168,158,238,0.65)_92.75%)]"
          : "bg-[rgba(228,218,255,0.65)]",
        className,
      )}
    >
      <div className={cn("mb-1 flex w-full flex-col items-end pl-3 pr-2 pt-3.5", open ? "gap-3.5 pb-1.5" : "pb-0.5")}>
        <div className="flex w-[229px] items-center justify-between pr-1">
          <p
            className="min-w-0 flex-1 text-[20px] leading-[1.2] text-[#eb3b00]"
            style={{ fontFamily: FONT }}
          >
            Food For Thought
          </p>
          <span className="flex shrink-0 items-center rounded-[16px] bg-[#eb3b00] p-2">
            <img alt="" src={avocadoIcon} width={16} height={16} className="block" />
          </span>
        </div>

        <motion.p
          initial={false}
          animate={{
            height: open ? "auto" : 0,
            opacity: open ? 1 : 0,
            marginTop: open ? 0 : -4,
          }}
          transition={SPRING}
          className="w-full overflow-hidden bg-gradient-to-b from-[#eb3b00] to-[rgba(235,59,0,0.07)] bg-clip-text text-[11px] font-light leading-[1.2] text-transparent"
          style={{ fontFamily: "Inter, Helvetica, Arial, sans-serif" }}
        >
          {THOUGHT}
        </motion.p>
      </div>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.18}
        onDragEnd={onDragEnd}
        className="flex w-full cursor-grab touch-none flex-col items-center gap-3.5 px-4 py-2 active:cursor-grabbing"
        aria-expanded={open}
        aria-label={open ? "Collapse Food For Thought" : "Expand Food For Thought"}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        <div className="flex items-start gap-[26px]">
          <p
            className="w-[171px] text-[13px] font-light leading-[1.2] text-[#eb3b00]"
            style={{ fontFamily: FONT }}
          >
            FRI, 27 AUG 25
          </p>
          <img alt="" src={moreIcon} width={16} height={16} className="block rounded-[16px]" />
        </div>
        <img alt="" src={handleIcon} width={30} height={2} className="block" />
      </motion.div>
    </motion.div>
  );
}

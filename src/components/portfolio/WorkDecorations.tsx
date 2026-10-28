import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import peekMouse from "@/assets/portfolio/peek-mouse.svg";
import { cn } from "@/lib/utils";

/**
 * Decorative props around the project list (araguiar.design). Both scale with
 * `--deco-scale` (see styles.css) so they keep their aspect ratio across breakpoints.
 */

const CALC_FONT = "Montserrat, ui-sans-serif, system-ui, sans-serif";
const CALC_WORD = "A.RA";
const CALC_INK = "#1d3b51";
/** Card is authored at 402px and shown at half size by default. */
const CALC_AUTHORED = 402;
const CALC_BASE_SCALE = 0.5;

type Key = { label: string; operator?: boolean; accent?: boolean };
const KEYS: Key[][] = [
  [{ label: "AC" }, { label: "7" }, { label: "8" }, { label: "9" }, { label: "÷", operator: true }],
  [{ label: "%" }, { label: "4" }, { label: "5" }, { label: "6" }, { label: "×", operator: true }],
  [{ label: "±" }, { label: "1" }, { label: "2" }, { label: "3" }, { label: "−", operator: true }],
  [
    { label: "(|)", accent: true },
    { label: "0", accent: true },
    { label: "•", accent: true },
    { label: "=", accent: true },
    { label: "+", operator: true },
  ],
];

/** Types and deletes "A.RA" on a loop in the calculator display. */
function useCalculatorReadout() {
  const reduceMotion = useReducedMotion();
  const [text, setText] = useState(CALC_WORD);

  useEffect(() => {
    if (reduceMotion) {
      setText(CALC_WORD);
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms);
      });
    const show = (value: string) => {
      if (!cancelled) setText(value);
    };

    void (async () => {
      while (!cancelled) {
        show(CALC_WORD);
        await wait(2400);
        if (cancelled) break;
        for (let n = CALC_WORD.length; n >= 0 && !cancelled; n--) {
          show(CALC_WORD.slice(0, n));
          await wait(110);
        }
        await wait(500);
        if (cancelled) break;
        for (let n = 0; n <= CALC_WORD.length && !cancelled; n++) {
          show(CALC_WORD.slice(0, n));
          await wait(140);
        }
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reduceMotion]);

  return text;
}

function BackspaceIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="size-5"
      aria-hidden
    >
      <path
        d="M8.33317 4.166C7.91904 4.16602 7.51974 4.32022 7.21308 4.59855L1.93931 9.38243C1.85323 9.46055 1.78445 9.55581 1.73738 9.6621C1.69032 9.76838 1.666 9.88334 1.666 9.99958C1.666 10.1158 1.69032 10.2308 1.73738 10.3371C1.78445 10.4434 1.85323 10.5386 1.93931 10.6167L7.21308 15.4015C7.51974 15.6798 7.91904 15.834 8.33317 15.834H16.6672C17.1093 15.834 17.5332 15.6584 17.8458 15.3458C18.1584 15.0332 18.334 14.6092 18.334 14.1671V5.83286C18.334 5.39078 18.1584 4.96681 17.8458 4.65421C17.5332 4.34161 17.1093 4.166 16.6672 4.166H8.33317Z"
        fill={CALC_INK}
        fillOpacity={0.72}
      />
      <path
        d="M10 7.49971L15.0004 12.5003M15.0004 7.49971L10 12.5003"
        stroke="#f7f6f2"
        strokeOpacity={0.8}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CalculatorCard() {
  const readout = useCalculatorReadout();
  const box = `calc(${CALC_AUTHORED * CALC_BASE_SCALE}px * var(--deco-scale, 1))`;

  return (
    <div
      aria-hidden
      className="pointer-events-none relative shrink-0 select-none"
      style={{ width: box, height: box }}
      data-name="calculator-card"
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ transform: `scale(calc(${CALC_BASE_SCALE} * var(--deco-scale, 1)))` }}
      >
        <div
          className="relative flex size-[402px] flex-col justify-between overflow-hidden rounded-[48px] border border-zinc-400/45 bg-white/30 p-6 shadow-[0px_16px_24px_rgba(11,14,20,0.12),inset_0px_1px_0_rgba(255,255,255,0.55)] backdrop-blur-[14px] supports-[backdrop-filter]:bg-white/25"
          style={{ fontFamily: CALC_FONT }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(78,171,149,0.42)] to-[rgba(15,201,80,0.22)]"
          />
          <div className="relative z-[1] flex h-[76px] w-full shrink-0 items-center justify-end gap-2.5 rounded-[24px] border border-[#1ab5ac]/80 bg-white/20 px-3 backdrop-blur-[8px]">
            <div className="relative h-[38.08px] w-[133px] shrink-0">
              <span
                className="invisible block text-right text-[38.08px] font-light leading-none tabular-nums"
                aria-hidden
              >
                {CALC_WORD}
              </span>
              <span className="absolute inset-0 text-right text-[38.08px] font-light leading-none tabular-nums text-[#1d3b51]/80">
                {readout}
              </span>
            </div>
            <div className="flex size-6 shrink-0 items-center justify-center">
              <BackspaceIcon />
            </div>
          </div>

          <div className="relative z-[1] flex w-full flex-col gap-3">
            {KEYS.map((row, r) => (
              <div key={r} className="flex w-full items-start justify-between">
                {row.map((key) => (
                  <div
                    key={key.label}
                    className={cn(
                      "flex size-[54px] shrink-0 items-center justify-center rounded-[27px] border text-center text-[#f7f6f2]/80 backdrop-blur-[6px]",
                      key.operator
                        ? "border-[#4eab95] bg-[rgba(29,59,81,0.72)] text-[13.6px] font-normal"
                        : key.accent
                          ? "border-[rgba(15,201,80,0.28)] bg-white/10 text-[13.6px] font-normal"
                          : cn(
                              "border-[rgba(255,255,255,0.38)] bg-white/10",
                              key.label === "AC"
                                ? "text-[10.88px] font-medium"
                                : "text-[13.6px] font-normal",
                            ),
                    )}
                  >
                    {key.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PeekMouse() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative shrink-0 select-none"
      style={{
        width: "calc(117px * var(--deco-scale, 1))",
        height: "calc(117px * var(--deco-scale, 1))",
      }}
      data-name="peek-mouse"
    >
      <div className="portfolio-peek-mouse-motion absolute inset-0 flex items-center justify-center">
        <img
          src={peekMouse}
          alt=""
          draggable={false}
          className="block max-w-none object-contain"
          style={{
            width: "calc(74px * var(--deco-scale, 1))",
            height: "calc(99px * var(--deco-scale, 1))",
          }}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

import { useEffect, useRef, type CSSProperties } from "react";
import heroMark from "@/assets/hero/hero-mark.svg";
import toggleKnobHover from "@/assets/hero/hero-toggle-knob-hover.svg";
import toggleRest from "@/assets/hero/hero-toggle-rest.svg";

const HEADLINE = "Are you looking for me?";
const LEDE =
  "Product Designer specialising in complex B2B platforms, design systems, and interactive prototypes.";

const COLS = 14;
const GRID_PAD = 2;
const GRID_GAP = 2;
/** Enough DOM cells for the pre-canvas fallback grid on tall viewports. */
const FALLBACK_CELLS = COLS * 48;
const BG = "#090e15";
const MOBILE_MAX_W = 768;
/** Below this width the grid switches to ~64px tiles instead of a fixed 14 columns. */
const MOBILE_GRID_MAX_W = 640;
const MOBILE_TILE_STEP = 66;

/** Cursor influence radii (px). */
const PUSH_RADIUS = 240;
const PUSH_STRENGTH = 10;
const DOT_GLOW_RADIUS = 220;
const RELAX_RADIUS = 256;
const RELAX_PASSES = 6;
const BLOB_PULL_RADIUS = 480;

type Cell = { x: number; y: number; w: number; h: number; cx: number; cy: number };
type Offset = { x: number; y: number; glow: number; dotDist: number };
type Blob = { homeX: number; homeY: number; x: number; y: number; r: number; phase: number };
type Sprite = { canvas: HTMLCanvasElement; css: number };

function gridGeometry(width: number, height: number) {
  const innerW = Math.max(0, width - GRID_PAD * 2);
  const innerH = Math.max(0, height - GRID_PAD * 2);
  const cols =
    width < MOBILE_GRID_MAX_W
      ? Math.max(4, Math.round((innerW + GRID_GAP) / MOBILE_TILE_STEP))
      : COLS;
  const cellW = (innerW - GRID_GAP * (cols - 1)) / cols;
  const rows = Math.max(1, Math.round((innerH + GRID_GAP) / Math.max(cellW + GRID_GAP, 1)));
  const cellH = (innerH - GRID_GAP * (rows - 1)) / rows;
  return { rows, cols, cellW, cellH };
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/**
 * Full-viewport dark hero (araguiar.design): canvas tile grid that parts around the cursor,
 * drifting glow blobs, a liquid lens and frosted glass. The toggle hands off to `#work`.
 */
export function InteractiveHero({ onEnterWork }: { onEnterWork?: () => void }) {
  const hostRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollProgressRef = useRef(0);
  const pointerRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const sizeFallbackGrid = () => {
      const grid = host.querySelector<HTMLElement>(".interactive-hero__grid");
      if (!grid) return;
      const { rows, cols, cellW, cellH } = gridGeometry(host.clientWidth, host.clientHeight);
      grid.style.gridTemplateColumns = `repeat(${cols}, ${cellW}px)`;
      grid.style.gridTemplateRows = `repeat(${rows}, ${cellH}px)`;
    };
    sizeFallbackGrid();
    const ro = new ResizeObserver(sizeFallbackGrid);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let teardown = () => {};
    let frame = 0;
    let running = false;
    let visible = false;
    let fallbackHidden = false;
    let width = 0;
    let height = 0;
    let isMobile = window.innerWidth < MOBILE_MAX_W;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer = pointerRef.current;
    let lensX = 0;
    let lensY = 0;
    let time = 0;
    let cells: Cell[] = [];
    let cols = COLS;
    let cornerRadius = 12;
    let hostRect = host.getBoundingClientRect();

    const blobs: Blob[] = [
      { homeX: 0.08, homeY: 0.12, x: 0, y: 0, r: 92, phase: 0 },
      { homeX: 0.14, homeY: 0.07, x: 0, y: 0, r: 68, phase: 1.4 },
      { homeX: 0.05, homeY: 0.22, x: 0, y: 0, r: 56, phase: 2.8 },
    ];
    const sprites = new Map<number, Sprite>();

    const resetBlobs = () => {
      for (const b of blobs) {
        b.x = b.homeX * width;
        b.y = b.homeY * height;
      }
      lensX = width * 0.5;
      lensY = height * 0.5;
    };

    const buildSprite = (radius: number) => {
      const size = Math.ceil((radius + 84) * 2);
      const sprite = document.createElement("canvas");
      sprite.width = Math.max(1, Math.ceil(size * dpr));
      sprite.height = Math.max(1, Math.ceil(size * dpr));
      const sctx = sprite.getContext("2d");
      if (!sctx) return;
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx.filter = "blur(28px)";
      const c = size / 2;
      const g = sctx.createRadialGradient(c, c, 0, c, c, radius);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.55, "rgba(255,255,255,0.35)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      sctx.fillStyle = g;
      sctx.beginPath();
      sctx.arc(c, c, radius, 0, Math.PI * 2);
      sctx.fill();
      sprites.set(radius, { canvas: sprite, css: size });
    };

    const writeVars = (cursorBlur: number) => {
      host.style.setProperty("--hero-lens-x", `${lensX}px`);
      host.style.setProperty("--hero-lens-y", `${lensY}px`);
      host.style.setProperty("--hero-cursor-blur", `${cursorBlur}px`);
      host.style.setProperty("--hero-cursor-active", pointer.active ? "1" : "0");
      const shiftX = pointer.active ? (lensX / width - 0.5) * 14 : 0;
      const shiftY = pointer.active ? (lensY / height - 0.5) * 10 : 0;
      host.style.setProperty("--hero-frost-shift-x", `${shiftX}px`);
      host.style.setProperty("--hero-frost-shift-y", `${shiftY}px`);
    };

    const updateScroll = () => {
      const rect = host.getBoundingClientRect();
      const progress = clamp(-rect.top / Math.max(rect.height, 1), 0, 1);
      scrollProgressRef.current = progress;
      host.style.setProperty("--hero-scroll", String(progress));
    };

    const buildCells = () => {
      const g = gridGeometry(width, height);
      const stepX = g.cellW + GRID_GAP;
      const stepY = g.cellH + GRID_GAP;
      const next: Cell[] = [];
      for (let row = 0; row < g.rows; row++) {
        for (let col = 0; col < g.cols; col++) {
          const x = GRID_PAD + col * stepX;
          const y = GRID_PAD + row * stepY;
          next.push({ x, y, w: g.cellW, h: g.cellH, cx: x + g.cellW / 2, cy: y + g.cellH / 2 });
        }
      }
      cells = next;
      cols = g.cols;
      cornerRadius = g.cols === COLS ? Math.min(12, g.cellW * 0.18) : g.cellW * 0.137;
    };

    const drawBlobs = () => {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const b of blobs) {
        const sprite = sprites.get(b.r);
        if (!sprite) continue;
        ctx.globalAlpha = isMobile ? 0.14 + Math.sin(time + b.phase) * 0.04 : 0.22;
        ctx.drawImage(
          sprite.canvas,
          b.x - sprite.css / 2,
          b.y - sprite.css / 2,
          sprite.css,
          sprite.css,
        );
      }
      ctx.restore();
    };

    const shouldContinue = () => {
      if (!visible) return false;
      if (isMobile || pointer.active) return true;
      if (Math.hypot(lensX - width * 0.5, lensY - height * 0.5) > 0.6) return true;
      return blobs.some((b) => Math.hypot(b.x - b.homeX * width, b.y - b.homeY * height) > 0.6);
    };

    const render = () => {
      const scroll = scrollProgressRef.current;
      const interactive = pointer.active;

      if (interactive) {
        lensX += (pointer.x - lensX) * 0.11;
        lensY += (pointer.y - lensY) * 0.11;
      } else {
        lensX += (width * 0.5 - lensX) * 0.04;
        lensY += (height * 0.5 - lensY) * 0.04;
      }
      writeVars(interactive ? 14 : 0);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);
      time += 0.014;

      const mobilePulse = isMobile ? 0.04 + Math.sin(time) * 0.03 : 0;
      if (cells.length === 0) buildCells();
      const parallax = scroll * 22;
      const rows = Math.floor(cells.length / cols);

      const offsets: Offset[] = cells.map((cell) => {
        let x = width ? ((cell.cx / width - 0.5) * parallax) / dpr : 0;
        let y = height ? ((cell.cy / height - 0.5) * parallax * 0.55) / dpr : 0;
        let glow = 0;
        let dotDist = 0;
        if (interactive) {
          const dist = Math.hypot(cell.cx - pointer.x, cell.cy - pointer.y);
          glow = Math.max(0, 1 - dist / PUSH_RADIUS);
          dotDist = dist;
          const angle = Math.atan2(cell.cy - pointer.y, cell.cx - pointer.x);
          x += Math.cos(angle) * glow * PUSH_STRENGTH;
          y += Math.sin(angle) * glow * PUSH_STRENGTH;
        }
        return { x, y, glow, dotDist };
      });

      const keepInViewport = (cell: Cell, off: Offset) => {
        const minX = -cell.x;
        const minY = -cell.y;
        off.x = clamp(off.x, minX, Math.max(minX, width - cell.w - cell.x));
        off.y = clamp(off.y, minY, Math.max(minY, height - cell.h - cell.y));
      };
      for (let i = 0; i < cells.length; i++) keepInViewport(cells[i], offsets[i]);

      // Push overlapping neighbours apart along the axis that needs the least travel.
      const separate = (ai: number, bi: number) => {
        const a = cells[ai];
        const b = cells[bi];
        const oa = offsets[ai];
        const ob = offsets[bi];
        if (!a || !b || !oa || !ob) return;
        const ax0 = a.x + oa.x;
        const ay0 = a.y + oa.y;
        const ax1 = ax0 + a.w;
        const ay1 = ay0 + a.h;
        const bx0 = b.x + ob.x;
        const by0 = b.y + ob.y;
        const bx1 = bx0 + b.w;
        const by1 = by0 + b.h;
        const overlapX = Math.min(ax1, bx1) - Math.max(ax0, bx0);
        const overlapY = Math.min(ay1, by1) - Math.max(ay0, by0);
        const gapX = overlapX > 0 ? -overlapX : Math.max(ax0, bx0) - Math.min(ax1, bx1);
        const gapY = overlapY > 0 ? -overlapY : Math.max(ay0, by0) - Math.min(ay1, by1);
        if (gapX >= 1 || gapY >= 1) return;

        const needX = 1 - gapX;
        const needY = 1 - gapY;
        const axis: "x" | "y" = needX <= needY ? "x" : "y";
        const need = axis === "x" ? needX : needY;
        const aMid = axis === "x" ? (ax0 + ax1) / 2 : (ay0 + ay1) / 2;
        const bMid = axis === "x" ? (bx0 + bx1) / 2 : (by0 + by1) / 2;
        let dir = Math.sign(bMid - aMid);
        if (dir === 0) dir = axis === "x" ? (b.x >= a.x ? 1 : -1) : b.y >= a.y ? 1 : -1;

        const aMin = axis === "x" ? -a.x : -a.y;
        const aMax =
          axis === "x" ? Math.max(aMin, width - a.w - a.x) : Math.max(aMin, height - a.h - a.y);
        const bMin = axis === "x" ? -b.x : -b.y;
        const bMax =
          axis === "x" ? Math.max(bMin, width - b.w - b.x) : Math.max(bMin, height - b.h - b.y);
        const aCur = oa[axis];
        const bCur = ob[axis];
        let aNext = clamp(aCur - (need / 2) * dir, aMin, aMax);
        let bNext = clamp(bCur + (need / 2) * dir, bMin, bMax);
        let remaining = need - dir * (bNext - bCur - (aNext - aCur));
        if (remaining > 0) {
          const pushed = clamp(bNext + dir * remaining, bMin, bMax);
          remaining -= dir * (pushed - bNext);
          bNext = pushed;
        }
        if (remaining > 0) aNext = clamp(aNext - dir * remaining, aMin, aMax);
        oa[axis] = aNext;
        ob[axis] = bNext;
      };

      let near: Uint8Array | null = null;
      if (interactive && scroll <= 0.001) {
        const seed = new Uint8Array(cells.length);
        for (let i = 0; i < cells.length; i++) {
          if (Math.hypot(cells[i].cx - pointer.x, cells[i].cy - pointer.y) <= RELAX_RADIUS)
            seed[i] = 1;
        }
        near = seed.slice();
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const i = row * cols + col;
            if (!seed[i]) continue;
            if (col + 1 < cols) near[i + 1] = 1;
            if (col > 0) near[i - 1] = 1;
            if (row + 1 < rows) near[i + cols] = 1;
            if (row > 0) near[i - cols] = 1;
          }
        }
      }

      if ((interactive || scroll > 0.001) && rows > 0 && cells.length === rows * cols) {
        for (let pass = 0; pass < RELAX_PASSES; pass++) {
          for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
              const i = row * cols + col;
              const pair = (j: number) => {
                if (near && !near[i] && !near[j]) return;
                separate(i, j);
              };
              if (col + 1 < cols) pair(i + 1);
              if (row + 1 < rows) pair(i + cols);
              if (col + 1 < cols && row + 1 < rows) pair(i + cols + 1);
              if (col > 0 && row + 1 < rows) pair(i + cols - 1);
            }
          }
          for (let i = 0; i < cells.length; i++) keepInViewport(cells[i], offsets[i]);
        }
      }

      cells.forEach((cell, i) => {
        const off = offsets[i];
        const x = cell.x + off.x;
        const y = cell.y + off.y;
        ctx.fillStyle = `rgba(255,255,255,${0.1 + off.glow * 0.08})`;
        ctx.beginPath();
        ctx.roundRect(x, y, cell.w, cell.h, cornerRadius);
        ctx.fill();
        if (off.glow > 0.05) {
          ctx.save();
          ctx.strokeStyle = `rgba(180, 210, 255, ${off.glow * 0.22})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(x + 0.5, y + 0.5, cell.w - 1, cell.h - 1, cornerRadius);
          ctx.stroke();
          ctx.restore();
        }
        let dotAlpha = 0.2;
        if (interactive) dotAlpha = 0.2 + Math.max(0, 1 - off.dotDist / DOT_GLOW_RADIUS) * 0.55;
        else if (isMobile) dotAlpha = 0.2 + mobilePulse;
        ctx.fillStyle = `rgba(209,213,219,${dotAlpha + off.glow * 0.15})`;
        ctx.beginPath();
        ctx.arc(cell.cx + off.x, cell.cy + off.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      if (scroll > 0) {
        ctx.save();
        ctx.filter = `blur(${scroll * 4}px)`;
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      for (const b of blobs) {
        const homeX = b.homeX * width;
        const homeY = b.homeY * height;
        if (interactive) {
          const dx = pointer.x - b.x;
          const dy = pointer.y - b.y;
          const pull = Math.max(0, 1 - Math.hypot(dx, dy) / BLOB_PULL_RADIUS) * 0.045;
          b.x += dx * pull;
          b.y += dy * pull;
        }
        const wobble = isMobile ? Math.sin(time + b.phase) * 10 : 0;
        b.x += (homeX + wobble - b.x) * 0.05;
        b.y += (homeY + wobble * 0.4 - b.y) * 0.05;
      }
      drawBlobs();

      if (!fallbackHidden) {
        fallbackHidden = true;
        const grid = host.querySelector<HTMLElement>(".interactive-hero__grid");
        if (grid) grid.style.display = "none";
      }

      if (visible && shouldContinue()) {
        running = true;
        frame = requestAnimationFrame(render);
      } else {
        running = false;
      }
    };

    const wake = () => {
      if (!visible || running) return;
      running = true;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    };

    const sleep = () => {
      visible = false;
      running = false;
      cancelAnimationFrame(frame);
    };

    const resize = () => {
      isMobile = window.innerWidth < MOBILE_MAX_W;
      width = host.clientWidth;
      height = host.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      resetBlobs();
      updateScroll();
      buildCells();
      hostRect = host.getBoundingClientRect();
      if (visible) {
        cancelAnimationFrame(frame);
        running = false;
        render();
      }
    };

    let lastTouchAt = 0;

    const pointAt = (clientX: number, clientY: number) => {
      pointer.x = clientX - hostRect.left;
      pointer.y = clientY - hostRect.top;
      pointer.active = true;
      if (visible && !running) {
        running = true;
        render();
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      // Touch browsers fire a synthetic mousemove after a tap; it would pin the push in place.
      if (event.timeStamp - lastTouchAt < 800) return;
      pointAt(event.clientX, event.clientY);
    };

    const onMouseLeave = () => {
      pointer.active = false;
      wake();
    };

    const onTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      lastTouchAt = event.timeStamp;
      hostRect = host.getBoundingClientRect();
      pointAt(touch.clientX, touch.clientY);
    };

    const onTouchEnd = (event: TouchEvent) => {
      lastTouchAt = event.timeStamp;
      if (event.touches.length > 0) return;
      pointer.active = false;
      wake();
    };

    const onScroll = () => {
      updateScroll();
      hostRect = host.getBoundingClientRect();
      wake();
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        visible = true;
        wake();
        if (!running) render();
      } else {
        sleep();
      }
    });
    const ro = new ResizeObserver(resize);

    const boot = requestAnimationFrame(() => {
      for (const b of blobs) buildSprite(b.r);
      resize();
      const rect = host.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        visible = true;
        render();
      }
      ro.observe(host);
      io.observe(host);
      window.addEventListener("resize", resize);
      window.addEventListener("scroll", onScroll, { passive: true });
      host.addEventListener("mousemove", onMouseMove);
      host.addEventListener("mouseleave", onMouseLeave);
      host.addEventListener("touchstart", onTouch, { passive: true });
      host.addEventListener("touchmove", onTouch, { passive: true });
      host.addEventListener("touchend", onTouchEnd, { passive: true });
      host.addEventListener("touchcancel", onTouchEnd, { passive: true });
      teardown = () => {
        sleep();
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", onScroll);
        host.removeEventListener("mousemove", onMouseMove);
        host.removeEventListener("mouseleave", onMouseLeave);
        host.removeEventListener("touchstart", onTouch);
        host.removeEventListener("touchmove", onTouch);
        host.removeEventListener("touchend", onTouchEnd);
        host.removeEventListener("touchcancel", onTouchEnd);
      };
    });

    return () => {
      cancelAnimationFrame(boot);
      teardown();
    };
  }, []);

  return (
    <section
      ref={hostRef}
      className="interactive-hero relative flex h-dvh min-h-dvh w-full shrink-0 flex-col overflow-hidden bg-[#090e15] font-sans text-white"
      data-name="interactive-hero"
      style={
        {
          backgroundColor: BG,
          color: "#ffffff",
          "--hero-scroll": 0,
          "--hero-lens-x": "50%",
          "--hero-lens-y": "50%",
          "--hero-cursor-blur": "0px",
          "--hero-cursor-active": 0,
        } as CSSProperties
      }
    >
      <div aria-hidden className="interactive-hero__grid">
        {Array.from({ length: FALLBACK_CELLS }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 z-[1]" />
      <div
        aria-hidden
        className="interactive-hero__liquid-lens pointer-events-none absolute z-[2]"
      />
      <div
        aria-hidden
        className="interactive-hero__frost pointer-events-none absolute inset-0 z-[3] bg-[rgba(255,255,255,0.03)] backdrop-blur-[18px]"
      />

      <nav className="pointer-events-none absolute inset-0 z-10 sm:pointer-events-auto sm:relative sm:inset-auto sm:flex sm:w-full sm:items-center sm:justify-between sm:px-9 sm:pt-[139px]">
        <span
          aria-hidden
          className="interactive-hero__mark absolute bottom-[31px] left-8 shrink-0 sm:static"
          style={{ maskImage: `url("${heroMark}")`, WebkitMaskImage: `url("${heroMark}")` }}
        />
        <div className="absolute right-[18px] top-14 flex flex-col gap-0.5 text-center font-[family-name:system-ui,sans-serif] leading-normal text-[rgba(255,255,255,0.6)] sm:static sm:gap-0 sm:text-right sm:font-sans">
          <p className="text-[20px]">Ana.R Design</p>
          <p className="text-[12px]">Product Designer</p>
        </div>
      </nav>

      <div className="interactive-hero__content relative z-10 mx-auto flex min-h-0 w-full max-w-[593px] flex-1 flex-col items-center justify-center gap-[42px] px-[18px] text-center sm:px-6 sm:pb-12 sm:pt-6">
        <div className="flex w-full flex-col items-center gap-5">
          <h1 className="w-full whitespace-nowrap font-[family-name:system-ui,sans-serif] text-[min(36px,calc((100vw-36px)/10))] font-normal leading-normal text-[rgba(255,255,255,0.6)] sm:whitespace-normal sm:font-sans sm:text-[clamp(36px,6vw,56px)]">
            {HEADLINE}
          </h1>
          <p className="hidden max-w-[34rem] text-balance text-base font-normal leading-7 text-[rgba(255,255,255,0.4)] sm:block">
            {LEDE}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onEnterWork?.()}
          aria-label="Scroll to selected work"
          className="interactive-hero__toggle relative h-[42px] w-[87px] shrink-0 cursor-pointer active:scale-[0.94]"
        >
          <img
            src={toggleRest}
            alt=""
            aria-hidden
            className="interactive-hero__toggle-rest absolute inset-0 size-full max-w-none"
          />
          <span className="interactive-hero__toggle-hover" aria-hidden>
            <img src={toggleKnobHover} alt="" className="size-8 shrink-0" />
            <span>Press</span>
          </span>
        </button>
      </div>
    </section>
  );
}

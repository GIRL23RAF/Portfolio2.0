import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { DesignFileDotGrid } from "./DesignFileDotGrid";

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2;
export const DEFAULT_ZOOM = 0.5;
const PAN_THRESHOLD = 4;
const ZOOM_SENSITIVITY = 0.0018;

type Camera = { x: number; y: number; z: number };

/** Aerial file chrome — 24–32px corner radius. */
export const DESIGN_FILE_SHELL_RADIUS_PX = 28;
export const DESIGN_FILE_MAX_W = 1512;

/**
 * Fixed dotted backdrop + Figma-style infinite canvas.
 * Wheel / two-finger scroll pans. Cmd/Ctrl+wheel or pinch zooms.
 * Space+drag or middle-mouse also pans. Dots stay put.
 */
export function ProductiveDesignFileFrame({
  children,
  overlay,
  overlayAboveDocument = false,
  immersive = false,
  initialCamera,
}: {
  children: ReactNode;
  overlay?: ReactNode;
  /**
   * Portal the overlay to <body> as a fixed layer (z-50) tracking the viewport rect, so it can sit
   * above page-wide backdrops that would otherwise cover this frame's stacking context.
   */
  overlayAboveDocument?: boolean;
  /** Fades the canvas shell out and unclips the document overlay so it floats over the page. */
  immersive?: boolean;
  initialCamera?: Camera;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<Camera>(initialCamera ?? { x: 0, y: 0, z: DEFAULT_ZOOM });
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchRef = useRef<{ distance: number; z: number } | null>(null);
  const dragRef = useRef<{ x: number; y: number; camX: number; camY: number; panned: boolean } | null>(
    null,
  );
  const pannedRef = useRef(false);
  const spaceRef = useRef(false);
  const hoveredRef = useRef(false);
  const [camera, setCamera] = useState<Camera>(() => initialCamera ?? { x: 0, y: 0, z: DEFAULT_ZOOM });
  const [grabbing, setGrabbing] = useState(false);
  const [spaceHeld, setSpaceHeld] = useState(false);

  const commit = useCallback((next: Camera) => {
    const z = clamp(next.z, MIN_ZOOM, MAX_ZOOM);
    const cam = { x: next.x, y: next.y, z };
    cameraRef.current = cam;
    setCamera(cam);
  }, []);

  const zoomAt = useCallback(
    (clientX: number, clientY: number, nextZ: number) => {
      const el = viewportRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = clientX - rect.left - rect.width / 2;
      const py = clientY - rect.top - rect.height / 2;
      const { x, y, z } = cameraRef.current;
      const z2 = clamp(nextZ, MIN_ZOOM, MAX_ZOOM);
      commit({
        x: px - ((px - x) / z) * z2,
        y: py - ((py - y) / z) * z2,
        z: z2,
      });
    },
    [commit],
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const dx = event.deltaX * (event.deltaMode === 1 ? 16 : 1);
      const dy = event.deltaY * (event.deltaMode === 1 ? 16 : 1);

      if (event.ctrlKey || event.metaKey) {
        const factor = Math.exp(-dy * ZOOM_SENSITIVITY);
        zoomAt(event.clientX, event.clientY, cameraRef.current.z * factor);
        return;
      }

      const { x, y, z } = cameraRef.current;
      commit({ x: x - dx, y: y - dy, z });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [commit, zoomAt]);

  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      return target.closest("input, textarea, select, [contenteditable='true']") !== null;
    };

    const releaseSpace = () => {
      spaceRef.current = false;
      setSpaceHeld(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat) return;
      if (isTypingTarget(event.target) || !hoveredRef.current) return;
      event.preventDefault();
      spaceRef.current = true;
      setSpaceHeld(true);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      releaseSpace();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", releaseSpace);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", releaseSpace);
    };
  }, []);

  const beginPan = (event: PointerEvent<HTMLDivElement>, immediate: boolean) => {
    pannedRef.current = immediate;
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      camX: cameraRef.current.x,
      camY: cameraRef.current.y,
      panned: immediate,
    };
    if (immediate) {
      viewportRef.current?.setPointerCapture(event.pointerId);
      setGrabbing(true);
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const el = viewportRef.current;
    if (!el) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointersRef.current.size === 2) {
      el.setPointerCapture(event.pointerId);
      const pts = [...pointersRef.current.values()];
      pinchRef.current = {
        distance: hypot(pts[0], pts[1]),
        z: cameraRef.current.z,
      };
      dragRef.current = null;
      return;
    }

    const forcePan = event.button === 1 || spaceRef.current;
    if (event.button === 1) event.preventDefault();
    beginPan(event, forcePan);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (pointersRef.current.has(event.pointerId)) {
      pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    }

    if (pointersRef.current.size === 2 && pinchRef.current) {
      const pts = [...pointersRef.current.values()];
      const dist = hypot(pts[0], pts[1]);
      const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      zoomAt(mid.x, mid.y, pinchRef.current.z * (dist / pinchRef.current.distance));
      return;
    }

    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.panned && Math.hypot(dx, dy) < PAN_THRESHOLD) return;
    if (!drag.panned) {
      viewportRef.current?.setPointerCapture(event.pointerId);
      drag.panned = true;
      pannedRef.current = true;
      setGrabbing(true);
    }
    commit({
      x: drag.camX + dx,
      y: drag.camY + dy,
      z: cameraRef.current.z,
    });
  };

  const endPointer = (event: PointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
    if (pointersRef.current.size === 0) {
      dragRef.current = null;
      setGrabbing(false);
    }
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!pannedRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    pannedRef.current = false;
  };

  const onAuxClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button === 1) event.preventDefault();
  };

  return (
    <div
      className={`relative w-full min-w-0 overflow-hidden border border-white/10 bg-[#1b1b1b] shadow-none transition-opacity duration-300 ${
        immersive ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ borderRadius: DESIGN_FILE_SHELL_RADIUS_PX, maxWidth: DESIGN_FILE_MAX_W }}
    >
      <div
        ref={viewportRef}
        data-productive-design-viewport
        className={`relative z-0 h-[874px] w-full overflow-hidden touch-none ${
          grabbing || spaceHeld ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onClickCapture={onClickCapture}
        onAuxClick={onAuxClick}
        onPointerEnter={() => {
          hoveredRef.current = true;
        }}
        onPointerLeave={() => {
          hoveredRef.current = false;
        }}
      >
        <DesignFileDotGrid className="pointer-events-none absolute inset-0" />
        <div
          className="absolute left-1/2 top-1/2 flex w-max origin-center items-center gap-12 will-change-transform"
          style={{
            transform: `translate(-50%, -50%) translate(${camera.x}px, ${camera.y}px) scale(${camera.z})`,
          }}
        >
          {children}
        </div>
        {overlay && !overlayAboveDocument ? (
          <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">{overlay}</div>
        ) : null}
        {overlay && overlayAboveDocument ? (
          <DocumentOverlay anchorRef={viewportRef} unclipped={immersive}>
            {overlay}
          </DocumentOverlay>
        ) : null}
      </div>
    </div>
  );
}

function DocumentOverlay({
  anchorRef,
  unclipped,
  children,
}: {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  unclipped?: boolean;
  children: ReactNode;
}) {
  const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    let frame = 0;
    let last = "";
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const key = `${r.top}|${r.left}|${r.width}|${r.height}`;
      if (key === last) return;
      last = key;
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, [anchorRef]);

  if (!rect || typeof document === "undefined") return null;
  return createPortal(
    <div
      data-productive-design-viewport
      className={`pointer-events-none fixed z-50 ${unclipped ? "overflow-visible" : "overflow-hidden"}`}
      style={{ ...rect, borderRadius: unclipped ? undefined : DESIGN_FILE_SHELL_RADIUS_PX }}
    >
      {children}
    </div>,
    document.body,
  );
}

function hypot(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

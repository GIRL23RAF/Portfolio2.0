import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

interface DockItem {
  label: string; // "Cr", "Fd", "Od", "Ap"
  slug: string; // matches Project.slug
}

interface Props {
  items: DockItem[];
  onSelect: (slug: string) => void;
  activeSlug?: string | null;
}

// macOS-style floating dock with cursor-driven magnification.
// Tracks the mouse X within the dock and scales each icon by proximity.
export function Dock({ items, onSelect, activeSlug }: Props) {
  // Shared motion value: mouse X position relative to viewport.
  // Set to Infinity when the cursor leaves so all icons return to rest.
  const mouseX = useMotionValue<number>(Infinity);

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.2 }}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/70 backdrop-blur-xl border border-white/80 rounded-full px-4 py-2.5 flex items-end gap-3 shadow-2xl shadow-slate-300/40"
    >
      {items.map((item) => (
        <DockButton
          key={item.slug}
          item={item}
          mouseX={mouseX}
          active={activeSlug === item.slug}
          onSelect={onSelect}
        />
      ))}
    </motion.div>
  );
}

// Individual dock button. Measures its own center to compute distance
// from the cursor, then magnifies its size accordingly.
function DockButton({
  item,
  mouseX,
  active,
  onSelect,
}: {
  item: DockItem;
  mouseX: MotionValue<number>;
  active: boolean;
  onSelect: (slug: string) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  // Distance from cursor to this icon's horizontal center.
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Map distance to size — icons furthest from cursor rest at 36px,
  // the icon nearest the cursor scales up to 60px.
  const sizeRaw = useTransform(distance, [-140, 0, 140], [36, 60, 36]);
  const size = useSpring(sizeRaw, { mass: 0.1, stiffness: 200, damping: 15 });

  // Slight lift for magnified icons for the classic macOS bounce feel.
  const liftRaw = useTransform(distance, [-140, 0, 140], [0, -8, 0]);
  const lift = useSpring(liftRaw, { mass: 0.1, stiffness: 200, damping: 15 });

  return (
    <motion.button
      ref={ref}
      onClick={() => onSelect(item.slug)}
      style={{ width: size, height: size, y: lift }}
      whileTap={{ scale: 0.85 }}
      className={
        "rounded-full flex items-center justify-center text-[11px] font-semibold tracking-tight shrink-0 transition-colors " +
        (active
          ? "bg-zinc-950 text-white shadow-lg shadow-zinc-950/30"
          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200")
      }
    >
      {item.label}
    </motion.button>
  );
}
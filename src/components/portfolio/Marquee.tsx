// Continuous horizontal marquee. Duplicate children internally so the loop is seamless.
export function Marquee() {
  // Placeholder mockup tiles — swap for real project thumbnails later.
  const tiles = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="w-full overflow-hidden py-16 border-t border-zinc-200">
      <div className="flex w-max animate-marquee gap-6">
        {[...tiles, ...tiles].map((_, i) => (
          <div
            key={i}
            className="h-48 w-72 rounded-2xl bg-zinc-100 border border-zinc-200/60 shrink-0 flex items-center justify-center"
          >
            <div className="text-[10px] tracking-[0.2em] uppercase text-zinc-400">
              Mockup {String((i % tiles.length) + 1).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
/**
 * Downloads the current https://araguiar.design production build (Netlify)
 * into .netlify-production-preview/ for local static preview.
 * Run: bun scripts/sync-netlify-production.ts
 */
const BASE = "https://araguiar.design";
const OUT = new URL("../.netlify-production-preview/", import.meta.url);

const absoluteAssetRe = /\/(?:assets|fonts)\/[A-Za-z0-9._-]+(?:\.(?:js|css|png|svg|woff2|jpg|jpeg|webp))?/g;
const relativeAssetRe =
  /\.\/(?:assets\/)?[A-Za-z0-9._-]+(?:\.(?:js|css|png|svg|woff2|jpg|jpeg|webp))?/g;

function normalizeAssetPath(raw: string) {
  const clean = raw.split(/[`'"\\]/)[0];
  if (clean.startsWith("./")) {
    const name = clean.slice(2);
    return name.startsWith("assets/") ? `/${name}` : `/assets/${name}`;
  }
  return clean;
}

function collectPathsFromText(text: string, queue: Set<string>, scanned: Set<string>) {
  for (const re of [absoluteAssetRe, relativeAssetRe]) {
    for (const m of text.matchAll(re)) {
      const p = normalizeAssetPath(m[0]);
      if (!scanned.has(p)) queue.add(p);
    }
  }
}

async function fetchText(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.text();
}

async function fetchBinary(path: string) {
  const url = `${BASE}${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  const buf = await res.arrayBuffer();
  const file = Bun.file(new URL(`.${path}`, OUT));
  await Bun.write(file, buf);
}

async function main() {
  const indexHtml = await fetchText(`${BASE}/`);
  await Bun.write(new URL("./index.html", OUT), indexHtml);

  const queue = new Set<string>();
  const scanned = new Set<string>();
  collectPathsFromText(indexHtml, queue, scanned);
  while (queue.size > 0) {
    const path = [...queue][0];
    queue.delete(path);
    if (scanned.has(path)) continue;
    scanned.add(path);

    process.stdout.write(`fetch ${path}\n`);
    await fetchBinary(path);

    if (path.endsWith(".js") || path.endsWith(".css")) {
      const text = await Bun.file(new URL(`.${path}`, OUT)).text();
      collectPathsFromText(text, queue, scanned);
    }
  }

  console.log(`Done — ${scanned.size} assets in .netlify-production-preview/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

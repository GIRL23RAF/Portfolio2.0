/** Serve .netlify-production-preview/ (mirrored Netlify production). */
const root = new URL("../.netlify-production-preview/", import.meta.url);
/** Default 5180 so 5173 stays free for local dev / vite preview (deploy candidate). */
const port = Number(process.env.PORT ?? 5180);

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    let path = decodeURIComponent(url.pathname);
    if (path === "/") path = "/index.html";
    const file = Bun.file(new URL(`.${path}`, root));
    if (await file.exists()) {
      return new Response(file);
    }
    return new Response("Not found", { status: 404 });
  },
});

console.log(`Netlify production mirror (NOT deploy branch) → http://localhost:${port}/`);

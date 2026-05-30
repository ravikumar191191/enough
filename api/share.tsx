/**
 * api/share.tsx — Vercel Edge function behind shared links (/share?...).
 *
 * Why it exists: social crawlers (WhatsApp, X, LinkedIn) read a page's initial
 * HTML and do NOT run JavaScript, so a static SPA can't set per-scenario preview
 * tags. This tiny function returns HTML whose <head> carries the right Open-Graph
 * tags for THIS scenario (pointing og:image at /api/og), then redirects a human
 * visitor straight to the interactive app with their inputs intact.
 *
 * The client builds the link with display strings (city, amount, line) + `to`
 * (the app's input query), so this function does no computation.
 */
export const config = { runtime: "edge" };

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default function handler(req: Request) {
  const url = new URL(req.url);
  const p = url.searchParams;
  const origin = url.origin;

  const city = p.get("city") || "Your number";
  const amount = p.get("amount") || "";
  const line =
    p.get("line") || "How much you need to stop working - India and US, ranked.";
  const to = p.get("to") || ""; // the app's input query, e.g. "?t=rent&l=luxury"

  const ogImage =
    `${origin}/api/og?city=${encodeURIComponent(city)}` +
    `&amount=${encodeURIComponent(amount)}&line=${encodeURIComponent(line)}`;

  const search = to.startsWith("?") ? to : to ? `?${to}` : "";
  const appUrl = `${origin}/${search}${search ? "&" : "?"}ref=share`;

  const title = `${city}${amount ? ` - ${amount}` : ""} | Enough`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(line)}" />
  <meta property="og:image" content="${esc(ogImage)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(line)}" />
  <meta name="twitter:image" content="${esc(ogImage)}" />
  <meta http-equiv="refresh" content="0; url=${esc(appUrl)}" />
</head>
<body>
  <script>location.replace(${JSON.stringify(appUrl)});</script>
  <p>Redirecting to Enough… <a href="${esc(appUrl)}">continue</a></p>
</body>
</html>`;

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

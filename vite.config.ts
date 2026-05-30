import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Single source for the production origin, used to build absolute OG-image URLs in
// index.html. On Vercel, VERCEL_PROJECT_PRODUCTION_URL is the live production domain and
// updates automatically if you rename the project — so the default share card never goes
// stale. Falls back to localhost in dev. (Per-share cards use the request origin directly.)
const SITE_ORIGIN = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:5173";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    {
      name: "inject-site-origin",
      transformIndexHtml: (html) => html.split("%SITE_ORIGIN%").join(SITE_ORIGIN),
    },
  ],
  // Ensure a single React instance (avoids "Invalid hook call" from deps like
  // @vercel/analytics that can otherwise pull a second copy in dev).
  resolve: { dedupe: ["react", "react-dom"] },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base is "./" so the build works on GitHub Pages (project subpath) and Vercel alike.
export default defineConfig({
  base: "./",
  plugins: [react()],
  // Ensure a single React instance (avoids "Invalid hook call" from deps like
  // @vercel/analytics that can otherwise pull a second copy in dev).
  resolve: { dedupe: ["react", "react-dom"] },
});

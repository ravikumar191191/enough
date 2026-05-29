import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base is "./" so the build works on GitHub Pages (project subpath) and Vercel alike.
export default defineConfig({
  base: "./",
  plugins: [react()],
});

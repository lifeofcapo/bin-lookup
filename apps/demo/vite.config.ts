import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative base so the build works unmodified on GitHub Pages project
  // sites (served from /<repo-name>/) without hardcoding the repo name.
  base: "./",
});

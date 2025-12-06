import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  // Set base path for GitHub Pages (if deploying to /lisan/)
  // For root domain, use base: '/'
  const base = process.env.GITHUB_PAGES === "true" ? "/lisan/" : "/";

  return {
    base,
    root: ".",
    server: {
      port: 3000,
      host: "0.0.0.0",
      // Proxy API requests to backend server
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:3001",
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    build: {
      outDir: "dist",
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
        },
      },
    },
  };
});

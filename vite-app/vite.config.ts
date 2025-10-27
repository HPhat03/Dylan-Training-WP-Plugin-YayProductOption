import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    rollupOptions: {
      input: "src/admin-app.tsx",
      output: {
        entryFileNames: "admin-app.js",
        assetFileNames: "[name].[ext]",
      },
    },
    outDir: "../build",
    emptyOutDir: true,
  },

  server: {
    cors: true,
    strictPort: true,
    port: 3000,
    origin: `${process.env.VITE_SERVER_ORIGIN}`,
    hmr: {
      port: 3000,
      host: "localhost",
      protocol: "ws",
    },
  },
});

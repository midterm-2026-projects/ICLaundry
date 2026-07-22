import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

import process from "node:process";

export default defineConfig({
  plugins: [react()],

  server: {
    host: "127.0.0.1",

    port: 5173,

    strictPort: true,

    proxy: {
      "/api": {
        target: process.env.E2E_API_TARGET || "http://127.0.0.1:3000",

        changeOrigin: true,

        secure: false,
      },
    },
  },

  test: {
    environment: "jsdom",

    globals: true,

    setupFiles: ["./src/test/setupTests.js"],

    exclude: ["node_modules/**", "dist/**", "tests/e2e/**"],
  },
});

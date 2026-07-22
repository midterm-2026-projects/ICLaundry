import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,

    environment: "jsdom",

    setupFiles: ["./tests/setupTests.js", "./tests/mockAPI.js"],

    // Prevent Vitest from running Playwright tests
    exclude: [
      "node_modules/**",
      "dist/**",

      // Playwright tests
      "tests/e2e/**",
      "**/*.spec.js",
    ],
  },
});

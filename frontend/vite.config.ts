/// <reference types="vitest" />

import { UserConfigExport, defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    testMatch: ["**/*.test.tsx"],
    css: true,
  },
} as UserConfigExport);

import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./app/setupTests.ts",
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./app"),
    },
  },
});

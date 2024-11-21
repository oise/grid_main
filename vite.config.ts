import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "node:path";
import purgeCssPlugin from "@mojojoejo/vite-plugin-purgecss";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      ignoredRouteFiles: ["**/*.{spec,test}.{tsx,ts}"], // Ensure all test files are ignored as routes
    }),
    purgeCssPlugin({
      variables: true,
    }),

    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./app"),
    },
  },
  server: {
    watch: {
      ignored: ["**/*.{spec,test}.{tsx,ts}"],
    },
  },
  build: {
    rollupOptions: {
      external: ["**/*.{spec,test}.{tsx,ts}"],
    },
  },
});

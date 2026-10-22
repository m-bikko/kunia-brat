import path from "node:path";

import { defineConfig } from "vitest/config";

/** Unit tests for pure logic (no React, no Next.js runtime). */
export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname) } },
  test: {
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", "e2e/**"],
  },
});

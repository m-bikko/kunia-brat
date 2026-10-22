import { defineConfig } from "@playwright/test";

/** E2E against the production build. `pnpm test:e2e` builds first, then serves on :3200. */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:3200",
    channel: "chrome",
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm start -p 3200",
    url: "http://localhost:3200",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});

import { defineConfig, devices } from "@playwright/test";

const externalServer = process.env.PLAYWRIGHT_EXTERNAL_SERVER === "1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  timeout: 30_000,
  webServer: externalServer
    ? undefined
    : {
        command: "node ./node_modules/astro/bin/astro.mjs preview --host 127.0.0.1",
        url: "http://127.0.0.1:4321",
        reuseExistingServer: false,
        timeout: 120_000
      },
  use: {
    baseURL: "http://127.0.0.1:4321",
    channel: "chrome",
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    { name: "desktop-chrome", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } }
  ]
});

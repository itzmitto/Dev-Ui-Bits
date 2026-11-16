import { defineConfig } from '@playwright/test';

const externalURL = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = externalURL || 'http://127.0.0.1:5173';
export default defineConfig({
  testDir: './tests', timeout: 60_000, expect: { timeout: 10_000 },
  fullyParallel: false, workers: 1, reporter: 'list',
  use: {
    baseURL, viewport: { width: 1536, height: 1024 }, headless: true,
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : undefined,
    screenshot: 'only-on-failure',
  },
  webServer: externalURL ? undefined : {
    command: 'npm run dev -- --host 127.0.0.1 --port 5173 --strictPort',
    url: baseURL, reuseExistingServer: !process.env.CI,
  },
});

import { test, expect } from '@playwright/test';

const github = 'https://github.com/itzmitto/Dev-Ui-Bits';
const categories = ['text-animations','animations','components','backgrounds','micro-interactions'];

test('homepage, categories and public navigation use the existing registry', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Animated React Components for Creative Developers');
  await expect(page.locator('.home-category')).toHaveCount(5);
  await expect(page.locator('.home-feature')).toHaveCount(6);
  await expect(page.locator('.sidebar')).toHaveCount(0);
  await expect(page.getByRole('searchbox')).toHaveCount(0);
  await expect(page.locator('input[placeholder*="Search"], input[aria-label="Filter components"], a[href="/create"]')).toHaveCount(0);
  await page.keyboard.press('/'); await expect(page.getByRole('searchbox')).toHaveCount(0);
  const link = page.getByRole('link', { name: 'DevUI Bits on GitHub' });
  await expect(link).toHaveAttribute('href', github); await expect(link).toHaveAttribute('target', '_blank'); await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  await link.focus(); await expect(link).toBeFocused();
  await page.getByRole('link', { name: 'Browse Categories', exact: true }).click(); await expect(page).toHaveURL(/\/categories$/);
  const paths = await page.locator('.home-category').evaluateAll(elements => elements.map(element => element.getAttribute('href')));
  expect(paths).toEqual(categories.map(category => '/' + category));
  for (const path of paths) {
    await page.goto(path!); await expect(page.locator('.collection-card').first()).toBeVisible();
    await expect(page.locator('.component-link')).toHaveCount(29);
    await expect(page.locator('input[aria-label="Search collection"], a[href="/create"]')).toHaveCount(0);
  }
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Home', exact: true }).click();
  await page.getByRole('link', { name: 'Explore Components', exact: true }).click(); await expect(page).toHaveURL(/\/browse$/);
  expect(errors).toEqual([]);
});

test('system preference, manual theme, navigation and reload stay synchronized', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' }); await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' }); await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('devui-theme'))).toBe('light');
  await page.getByRole('link', { name: 'Explore Components', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload(); await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.goto('/backgrounds/micro-slats');
  await expect(page.locator('.customize')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('.sidebar')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await page.getByRole('tab', { name: 'Code', exact: true }).click();
  await expect(page.locator('.sp-code-editor')).toBeVisible();
  await expect(page.locator('.sp-code-editor')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload(); await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('mobile menu navigates and closes with Escape and route changes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 }); await page.goto('/');
  const opener = page.getByRole('button', { name: 'Open navigation', exact: true });
  await opener.click(); await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await page.keyboard.press('Escape'); await expect(opener).toBeFocused();
  await opener.click(); await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Components', exact: true }).click();
  await expect(page).toHaveURL(/\/browse$/); await expect(opener).toHaveAttribute('aria-expanded', 'false');
  await opener.click(); await expect(page.locator('.sidebar')).toBeVisible();
  await page.locator('.component-link').filter({ hasText: 'Micro Slats' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Micro Slats');
  await expect(opener).toHaveAttribute('aria-expanded', 'false');
});

test('home previews are real, visible only, and canvas respects reduced motion', async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => page.locator('.hero-background canvas').evaluate((canvas: HTMLCanvasElement) => canvas.width)).toBeGreaterThan(0);
  await expect(page.locator('.feature-demo')).toHaveCount(0);
  await page.locator('.home-feature').first().scrollIntoViewIfNeeded();
  const preview = page.locator('.feature-preview canvas').first(); await expect(preview).toBeVisible();
  await expect.poll(() => preview.evaluate((canvas: HTMLCanvasElement) => canvas.width)).toBeGreaterThan(0);
  const pixels = await preview.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
  await page.waitForTimeout(120); expect(await preview.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL())).not.toBe(pixels);
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.waitForTimeout(100);
  const still = await preview.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
  await page.waitForTimeout(120); expect(await preview.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL())).toBe(still);
  await page.getByRole('heading', { level: 1 }).scrollIntoViewIfNeeded(); await expect(page.locator('.feature-preview[data-active=true]')).toHaveCount(0);
});

const viewports = [[375,812],[430,932],[768,1024],[1024,768],[1280,800],[1366,768],[1440,900],[1920,1080],[2560,1440],[3440,1440],[3840,2160]];
for (const [width,height] of viewports) {
  for (const theme of ['dark','light'] as const) {
    test(`responsive ${width}x${height} ${theme}: home and component page`, async ({ page }) => {
      const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
      await page.setViewportSize({ width,height });
      await page.addInitScript(value => localStorage.setItem('devui-theme', value), theme);
      await page.goto('/'); await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const selector of ['.hero-content h1','.hero-primary','.header-right']) {
        const box = await page.locator(selector).boundingBox(); expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      }
      if (width === 375 || width === 1920) {
        for (const feature of await page.locator('.home-feature').all()) await feature.scrollIntoViewIfNeeded();
        await page.getByRole('heading', { level: 1 }).scrollIntoViewIfNeeded(); await page.evaluate(() => window.scrollTo(0,0));
      }
      await page.screenshot({ path:`screenshots/phase3-home-${width}-${theme}.png`,fullPage: width === 375 || width === 1920 });
      await page.goto('/backgrounds/micro-slats');
      await expect(page.getByLabel('Slat width', { exact: true })).toBeAttached();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const label of ['Mobile viewport','Copy component code']) {
        const box = await page.getByRole('button', { name: label, exact: true }).boundingBox(); expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      }
      const preview = await page.getByTestId('preview-device').boundingBox(); expect(preview!.width).toBeGreaterThan(width >= 1920 ? width * .5 : 280);
      await page.getByLabel('Slat width', { exact: true }).fill('19'); await expect(page.getByLabel('Slat width', { exact: true })).toHaveValue('19');
      await page.getByRole('heading', { level: 1 }).click(); await page.evaluate(() => window.scrollTo(0,0));
      await page.screenshot({ path:`screenshots/phase3-detail-${width}-${theme}.png`,fullPage: width === 375 || width === 1920 });
      await page.reload(); await expect(page.getByRole('heading', { level: 1 })).toHaveText('Micro Slats');
      expect(errors).toEqual([]);
    });
  }
}

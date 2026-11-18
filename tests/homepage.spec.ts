import { test, expect } from '@playwright/test';

const github = 'https://github.com/itzmitto/Dev-Ui-Bits';
const categories = ['text-animations','animations','components','backgrounds','micro-interactions','cursor-trails'];

test('homepage, categories and public navigation use the existing registry', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Animated React Components for Creative Developers');
  await expect(page.locator('.home-category')).toHaveCount(6);
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
    await expect(page.locator('.component-link[data-status=ready]')).toHaveCount(52);
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
        await expect(page.locator(selector)).toBeVisible(); const box = await page.locator(selector).boundingBox(); expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      }
      if (width === 375 || width === 1920) {
        for (const feature of await page.locator('.home-feature').all()) await feature.scrollIntoViewIfNeeded();
        await expect(page.locator('.feature-demo')).toHaveCount(6);
        await expect(page.locator('.home-feature .effect-heading span').last()).toHaveCSS('opacity','1');
        await page.getByRole('heading', { level: 1 }).scrollIntoViewIfNeeded(); await page.evaluate(() => window.scrollTo(0,0));
      }
      await page.screenshot({ path:`screenshots/phase3-home-${width}-${theme}.png`,fullPage: width === 375 || width === 1920 });
      await page.goto('/backgrounds/micro-slats');
      await expect(page.getByLabel('Slat width', { exact: true })).toBeAttached();
      if (width >= 840) await expect(page.locator('.component-link.active')).toBeInViewport();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const label of ['Mobile viewport','Copy component code']) {
        const button = page.getByRole('button', { name: label, exact: true }); await expect(button).toBeVisible(); const box = await button.boundingBox(); expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
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


test('featured components remain interactive and header stays visible when scrolling', async ({ page }) => {
  await page.goto('/');
  const card = page.getByRole('button', { name: 'Flip interactive card' });
  await page.locator('.home-feature').nth(2).scrollIntoViewIfNeeded(); await expect(card).toBeVisible();
  await card.click(); await expect(card).toHaveAttribute('aria-pressed','true');
  await page.locator('.home-feature').nth(3).scrollIntoViewIfNeeded();
  await page.getByRole('tablist', { name: 'Demo animated tabs' }).getByRole('tab', { name: 'Insights' }).click();
  await expect(page.getByRole('heading', { name: 'See the bigger picture.' })).toBeVisible();
  await page.locator('.home-feature').nth(4).scrollIntoViewIfNeeded();
  await page.getByRole('button', { name:'Launch something', exact:true }).click();
  await expect(page.getByRole('button', { name:'Launch again', exact:true })).toBeEnabled();
  await expect.poll(() => page.locator('.topbar').evaluate(element => Math.round(element.getBoundingClientRect().top))).toBe(0);
  await page.screenshot({ path:'screenshots/phase3-live-features.png' });
  await page.locator('.hero-content').scrollIntoViewIfNeeded();
  await page.locator('.home-feature').nth(2).scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('aria-pressed','true');
});

test('live editor retains authored code when changing the complete site theme', async ({ page }) => {
  await page.goto('/text-animations/blur-text');
  await page.getByRole('tab', { name:'Editor', exact:true }).click();
  const frame = page.frameLocator('iframe[title="Sandpack Preview"]');
  await expect(frame.getByText('Ideas', { exact:false })).toBeVisible({ timeout:45000 });
  const editor = page.locator('.cm-content[contenteditable="true"]').first();
  await editor.click(); await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.insertText("export default function App(){return <h1>My theme-safe preview</h1>}");
  await expect(frame.getByRole('heading', { name:'My theme-safe preview' })).toBeVisible();
  await page.getByRole('button', { name:'Copy', exact:true }).click();
  await expect(page.locator('.sp-code-editor')).toContainText('My theme-safe preview');
  await page.getByRole('button', { name:'File', exact:true }).click();
  await page.getByLabel('New file name').fill('theme-helper.ts'); await page.getByRole('button', { name:'Add file', exact:true }).click();
  await page.getByRole('button', { name:'Switch to light theme' }).click();
  await expect(page.getByRole('button', { name:'theme-helper.ts', exact:true })).toBeVisible();
  await page.getByRole('button', { name:'App.tsx', exact:true }).click();
  await expect(page.locator('.sp-code-editor')).toContainText('My theme-safe preview');
  await expect(frame.getByRole('heading', { name:'My theme-safe preview' })).toBeVisible();
  await expect(page.locator('.sp-code-editor')).toHaveCSS('background-color','rgb(255, 255, 255)');
  await page.screenshot({ path:'screenshots/phase3-light-editor.png',fullPage:true });
});

test('gallery dialogs follow light theme and preserve accessible controls', async ({ page }) => {
  await page.goto('/components/advanced-image-gallery');
  await page.getByRole('button', { name:'Switch to light theme' }).click();
  await page.getByRole('button', { name:'Open Beyond the dunes' }).click();
  const dialog = page.getByRole('dialog'); await expect(dialog).toHaveCSS('background-color','rgb(255, 255, 255)');
  await expect(dialog).toHaveCSS('color','rgb(33, 25, 44)');
  await page.screenshot({ path:'screenshots/phase3-light-dialog.png' });
  await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name:'Open Beyond the dunes' })).toBeFocused();
});

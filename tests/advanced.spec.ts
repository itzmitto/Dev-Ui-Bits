import { test, expect } from '@playwright/test';

test('mega menu supports keyboard opening, destinations, escape and outside click', async ({ page }) => {
  await page.goto('/components/advanced-mega-menu');
  const products = page.getByRole('button', { name: /^Products/ });
  await products.focus(); await products.press('ArrowDown');
  const destination = page.getByRole('button', { name: /Design system/ });
  await expect(destination).toBeFocused(); await destination.click();
  await expect(page.locator('.adv-mega-content h2')).toHaveText('Design system');
  await products.click(); await page.keyboard.press('Escape'); await expect(products).toBeFocused();
  await expect(products).toHaveAttribute('aria-expanded', 'false');
  await products.click(); await page.getByRole('heading', { level: 1 }).click(); await expect(products).toHaveAttribute('aria-expanded', 'false');
  await page.getByLabel('Panel columns', { exact: true }).fill('1'); await products.click();
  await expect(page.locator('.adv-mega-panel')).toHaveCSS('grid-template-columns', /\d/);
});

test('3D card flips with keyboard and morph button completes its async lifecycle', async ({ page }) => {
  await page.goto('/components/3d-interactive-card');
  const card = page.getByRole('button', { name: 'Flip interactive card' });
  await card.focus(); await card.press('Enter'); await expect(card).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.adv-3d-back')).toHaveAttribute('aria-hidden', 'false');
  await card.press('Enter'); await expect(card).toHaveAttribute('aria-pressed', 'false');
  await page.goto('/micro-interactions/morphing-button');
  await page.getByLabel('Duration', { exact: true }).fill('0.3');
  await page.getByRole('switch', { name: 'Auto reset' }).uncheck();
  await page.getByRole('button', { name: 'Launch something', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Launching', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Launch again', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Launch again', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Launch something', exact: true })).toBeEnabled();
});

test('animated tabs and magnetic navigation have roving keyboard focus and real panels', async ({ page }) => {
  await page.goto('/components/animated-tabs');
  const tablist = page.getByRole('tablist', { name: 'Demo animated tabs' });
  await tablist.getByRole('tab', { name: 'Overview' }).focus(); await page.keyboard.press('ArrowRight');
  await expect(tablist.getByRole('tab', { name: 'Insights' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.adv-tab-content h2')).toHaveText('See the bigger picture.');
  await page.getByLabel('Orientation', { exact: true }).selectOption('vertical');
  await expect(tablist).toHaveAttribute('aria-orientation', 'vertical');
  await tablist.getByRole('tab', { name: 'Insights' }).press('End');
  await expect(page.locator('.adv-tab-content h2')).toHaveText('Good things are happening.');
  await page.goto('/components/magnetic-navigation');
  const nav = page.getByRole('tablist', { name: 'Magnetic demo navigation' });
  await nav.getByRole('tab', { name: /Saved/ }).click();
  await expect(page.locator('.adv-magnetic-copy h2')).toHaveText('Keep a little inspiration.');
  await nav.getByRole('tab', { name: /Saved/ }).press('Home');
  await expect(nav.getByRole('tab', { name: /Discover/ })).toBeFocused();
});

test('particle physics changes pixels, controls work and reduced motion stops continuous drawing', async ({ page }) => {
  await page.goto('/backgrounds/interactive-particle-background');
  const canvas = page.locator('.adv-particle-scene canvas');
  await expect.poll(() => canvas.evaluate((c: HTMLCanvasElement) => c.width)).toBeGreaterThan(0);
  const before = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await canvas.hover(); await canvas.click(); await page.waitForTimeout(100);
  expect(await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL())).not.toBe(before);
  await page.getByLabel('Pointer force', { exact: true }).selectOption('attract');
  await page.getByLabel('Particle count', { exact: true }).fill('45');
  await expect(page.getByLabel('Particle count', { exact: true })).toHaveValue('45');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload(); await expect.poll(() => canvas.evaluate((c: HTMLCanvasElement) => c.width)).toBeGreaterThan(0);
  await page.waitForTimeout(200); const still = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await page.waitForTimeout(150); expect(await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL())).toBe(still);
});

test('scroll narrative advances chapters and gallery filters, zooms, traps focus and restores it', async ({ page }) => {
  await page.goto('/animations/scroll-storytelling-section');
  await page.locator('.adv-story-scroll').evaluate(el => { el.scrollTop = el.scrollHeight; });
  await expect(page.locator('.adv-story-counter')).toContainText('03');
  await page.goto('/components/advanced-image-gallery');
  await page.getByRole('button', { name: 'Nature', exact: true }).click();
  await expect(page.locator('.adv-gallery-grid button')).toHaveCount(3);
  const opener = page.getByRole('button', { name: 'Open Beyond the dunes' }); await opener.click();
  const dialog = page.getByRole('dialog'); await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close gallery' })).toBeFocused();
  await page.keyboard.press('Shift+Tab'); await expect(dialog.getByRole('button', { name: 'Next image' })).toBeFocused();
  await page.keyboard.press('ArrowRight'); await expect(dialog).toContainText('Quiet geometry');
  await dialog.getByRole('button', { name: 'Zoom image' }).click();
  await expect(dialog.getByRole('button', { name: 'Zoom image' })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0); await expect(opener).toBeFocused();
});

test('advanced gallery supporting files compile in Sandpack without the excluded Node runtime', async ({ page }) => {
  await page.goto('/components/advanced-image-gallery'); await page.getByRole('tab', { name: 'Editor', exact: true }).click();
  await expect(page.getByLabel('Workspace dependencies')).toContainText('motion');
  const frame = page.frameLocator('iframe[title="Sandpack Preview"]');
  await expect(frame.getByRole('heading', { name: 'Look a little closer.' })).toBeVisible({ timeout: 45_000 });
  await frame.getByRole('button', { name: 'Open Beyond the dunes' }).click();
  await expect(frame.getByRole('dialog')).toBeVisible(); await frame.getByRole('button', { name: 'Close gallery' }).click();
  await page.getByRole('button', { name: 'galleryArt.ts', exact: true }).click();
  await expect(page.locator('.sp-code-editor')).toContainText('Original vector artwork');
});

test('advanced components fit mobile viewports and do not produce runtime errors', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({ width: 390, height: 844 });
  const paths = ['components/advanced-mega-menu', 'components/3d-interactive-card', 'micro-interactions/morphing-button', 'components/animated-tabs', 'components/magnetic-navigation', 'backgrounds/interactive-particle-background', 'animations/scroll-storytelling-section', 'components/advanced-image-gallery'];
  for (const path of paths) {
    await page.goto('/' + path); await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const preview = page.getByTestId('preview-device');
    await expect(preview).toBeVisible();
  }
  await page.screenshot({ path: 'screenshots/advanced-gallery-mobile.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('production deep links, refreshes and built assets work without any login', async ({ page, request }) => {
  for (const path of ['/components/tilt-card', '/components/advanced-mega-menu', '/create']) {
    const response = await page.goto(path); expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible(); await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(page.url()).not.toContain('signin');
  }
  const license = await request.get('/third-party-notices.txt'); expect(license.status()).toBe(200);
  expect(await license.text()).toContain('SIL OPEN FONT LICENSE');
});

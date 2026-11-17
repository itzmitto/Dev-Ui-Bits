import { test, expect } from '@playwright/test';

const totals = [
  ['text-animations',34], ['animations',41], ['components',56], ['micro-interactions',39], ['backgrounds',69],
] as const;

test('catalog includes all entries, real statuses, category filters, sorting and URL persistence', async ({ page }) => {
  await page.goto('/browse');
  await expect(page.getByRole('heading',{level:1})).toHaveText('Components');
  await expect(page.locator('.collection-card')).toHaveCount(239);
  await expect(page.getByTestId('catalog-count')).toHaveAttribute('data-total','239');
  await expect(page.locator('.catalog-card[data-status=ready]')).toHaveCount(29);
  await expect(page.locator('.catalog-card[data-status=planned]')).toHaveCount(210);
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('input[placeholder*=Search], input[aria-label="Filter components"], a[href="/create"]')).toHaveCount(0);
  const allNames = await page.locator('.catalog-card h2').allTextContents();
  expect(allNames.slice(0,3)).toEqual(['Tech Text','Text Loop','Masked Heading']);
  for (const [slug,count] of totals) {
    await page.getByLabel('Filter category').selectOption(slug);
    await expect(page.locator('.collection-card')).toHaveCount(count);
    await expect(page.getByTestId('catalog-count')).toHaveAttribute('data-count',String(count));
    await page.reload(); await expect(page.getByLabel('Filter category')).toHaveValue(slug);
  }
  await page.getByLabel('Filter category').selectOption('all');
  await expect(page.getByLabel('Filter category')).toHaveValue('all');
  await expect(page.locator('.collection-card')).toHaveCount(239);
  await page.getByRole('button',{name:'Ready 29',exact:true}).click();
  await expect(page.locator('.collection-card')).toHaveCount(29);
  await expect(page.locator('.catalog-card[data-status=planned]')).toHaveCount(0);
  await page.getByLabel('Sort components').selectOption('name-asc');
  await expect.poll(async()=>{
    const names = await page.locator('.catalog-card h2').allTextContents();
    return names.join('|') === [...names].sort(new Intl.Collator('en',{numeric:true}).compare).join('|');
  }).toBe(true);
  await page.getByLabel('Sort components').selectOption('name-desc');
  await expect.poll(async()=>{
    const names = await page.locator('.catalog-card h2').allTextContents();
    return names.join('|') === [...names].sort((a,b)=>new Intl.Collator('en',{numeric:true}).compare(b,a)).join('|');
  }).toBe(true);
  await page.getByRole('button',{name:'Reset filters'}).click(); await expect(page).toHaveURL(/\/browse$/);
  await expect(page.locator('.collection-card')).toHaveCount(239);
  await page.goto('/get-started/index'); await expect(page.getByRole('heading',{level:1})).toHaveText('Components');
});

test('every one of the 239 sidebar component routes loads its own ready or planned page', async ({ page }) => {
  test.setTimeout(180000);
  const errors: string[] = []; page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/browse');
  const entries = await page.locator('.component-link').evaluateAll(elements=>elements.map(element=>({route:element.getAttribute('href')!,name:element.getAttribute('title')!,status:element.getAttribute('data-status')!})));
  expect(entries).toHaveLength(239); expect(new Set(entries.map(item=>item.route)).size).toBe(239);
  for (const item of entries) {
    const response = await page.goto(item.route); expect(response?.status(),item.route).toBe(200);
    await expect(page.getByRole('heading',{level:1})).toHaveText(item.name);
    await expect(page.locator('.component-link.active')).toHaveAttribute('title',item.name);
    if (item.status === 'planned') {
      await expect(page.getByTestId('planned-preview')).toContainText('This component will be implemented in a future update.');
      await expect(page.getByRole('tablist',{name:'Component view'})).toHaveCount(0);
      await expect(page.locator('.customize, canvas, .code-workspace')).toHaveCount(0);
    } else {
      await expect(page.getByTestId('preview-device')).toBeVisible();
      await expect(page.locator('.preview-device .loading-state')).toHaveCount(0);
      await expect(page.getByRole('tab',{name:'Code',exact:true})).toBeVisible();
    }
  }
  expect(errors).toEqual([]);
});

test('collapsible sidebar scrolls independently and opens the active category, including legacy URLs', async ({ page }) => {
  await page.goto('/browse');
  await page.getByRole('button',{name:'Collapse Text Animations',exact:true}).click();
  await expect(page.locator('#category-text-animations')).toBeHidden();
  await page.locator('.catalog-card-link').filter({hasText:'Tech Text'}).click();
  await expect(page.locator('#category-text-animations')).toBeVisible();
  await expect(page.locator('.component-link.active')).toBeInViewport();
  await page.goto('/backgrounds/balatro');
  await expect(page.locator('.component-link.active')).toHaveAttribute('title','Balatro');
  await expect(page.locator('.component-link.active')).toBeInViewport();
  expect(await page.locator('.component-list').evaluate(element=>element.scrollTop)).toBeGreaterThan(1000);
  expect(await page.evaluate(()=>scrollY)).toBe(0);
  for (const [legacy,canonical,name] of [
    ['/animations/scroll-reveal','/text-animations/scroll-reveal','Scroll Reveal'],
    ['/animations/animated-list','/components/animated-list','Animated List'],
  ]) {
    await page.goto(legacy); await page.reload();
    await expect(page.getByRole('heading',{level:1})).toHaveText(name);
    await expect(page.locator('.component-link.active')).toHaveAttribute('href',canonical);
    await expect(page.locator('.component-link.active')).toHaveAttribute('aria-current','page');
    await expect(page.getByTestId('preview-device')).toBeVisible();
  }
});

test('get started and explore links lead to honest working pages', async ({ page }) => {
  await page.goto('/browse');
  const links = await page.locator('.sidebar-page-link').evaluateAll(elements=>elements.map(element=>({href:element.getAttribute('href')!,label:element.textContent!})));
  expect(links.map(item=>item.label)).toEqual(['Introduction','Installation','MCP','Changelog','Favorites','Components','Blocks','App UI','Templates','Skills']);
  for (const {href,label} of links) {
    await page.locator(`.sidebar-page-link[href="${href}"]`).click();
    await expect(page.getByRole('heading',{level:1})).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(href);
    if (label === 'MCP') await expect(page.getByRole('heading',{name:'No MCP server is configured.'})).toBeVisible();
    if (['Blocks','App UI','Templates','Skills'].includes(label)) await expect(page.getByRole('heading',{name:'This collection is planned.'})).toBeVisible();
  }
});

test('favorites persist after reload and can be removed without touching custom component data', async ({ page }) => {
  await page.goto('/browse'); await page.getByRole('button',{name:'Save Tech Text to favorites',exact:true}).click();
  await page.goto('/animations/crystalized-ball'); await page.getByRole('button',{name:'Save Crystalized Ball to favorites',exact:true}).click();
  await page.goto('/favorites'); await expect(page.locator('.collection-card')).toHaveCount(2);
  await page.reload(); await expect(page.locator('.collection-card')).toHaveCount(2);
  await page.getByRole('button',{name:'Remove Tech Text from favorites',exact:true}).click();
  await expect(page.locator('.collection-card')).toHaveCount(1);
  await page.getByRole('button',{name:'Remove Crystalized Ball from favorites',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Keep a little inspiration.'})).toBeVisible();
  await page.reload(); await expect(page.locator('.collection-card')).toHaveCount(0);
});

test('only a requested ready preview mounts, switches and stops with no fake planned animations', async ({ page }) => {
  await page.goto('/browse?status=ready'); await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('button',{name:'Preview Micro Slats',exact:true}).click();
  await expect(page.locator('.catalog-live-host canvas')).toBeVisible();
  await page.getByRole('button',{name:'Preview Blur Text',exact:true}).click();
  await expect(page.locator('.catalog-live-host')).toHaveCount(1);
  await expect(page.locator('.catalog-live-demo')).toContainText('Ideas come to life.');
  await page.getByRole('button',{name:'Stop live preview',exact:true}).click();
  await expect(page.locator('.catalog-live-host')).toHaveCount(0);
  await page.goto('/animations/crystalized-ball'); await page.reload();
  await expect(page.locator('canvas, .customize, .code-workspace')).toHaveCount(0);
  await expect(page.getByRole('link',{name:'Back to Components'})).toHaveAttribute('href','/browse');
});

const viewports = [[375,812],[430,932],[768,1024],[1024,768],[1366,768],[1440,900],[1920,1080],[2560,1440],[3440,1440],[3840,2160]];
for (const [width,height] of viewports) for (const theme of ['dark','light'] as const) {
  test(`catalog responsive ${width} ${theme}: grid, drawer and planned detail`,async({page})=>{
    await page.setViewportSize({width,height}); await page.addInitScript(value=>localStorage.setItem('devui-theme',value),theme);
    await page.goto('/browse'); await page.evaluate(()=>document.fonts.ready);
    await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const columns = await page.locator('.catalog-grid').evaluate(element=>getComputedStyle(element).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(width<600?1:width<840?2:width<1920?3:width<2560?4:width<3440?5:6);
    await page.screenshot({path:`screenshots/phase4-catalog-${width}-${theme}.png`});
    if (width<840) {
      await page.getByRole('button',{name:'Open navigation',exact:true}).click();
      await expect(page.locator('.sidebar')).toHaveClass(/is-open/);
      const link=page.locator('.component-link[title="Crystalized Ball"]'); await link.click();
      await expect(page.locator('.sidebar')).not.toHaveClass(/is-open/);
    } else await page.goto('/animations/crystalized-ball');
    await expect(page.getByRole('heading',{level:1})).toHaveText('Crystalized Ball');
    await expect(page.getByTestId('planned-preview')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const initial = await page.locator('.planned-preview').evaluate(element=>getComputedStyle(element).backgroundColor);
    await page.getByRole('button',{name:`Switch to ${theme==='dark'?'light':'dark'} theme`}).click();
    expect(await page.locator('.planned-preview').evaluate(element=>getComputedStyle(element).backgroundColor)).not.toBe(initial);
    await page.getByRole('button',{name:`Switch to ${theme} theme`}).click();
    await page.screenshot({path:`screenshots/phase4-planned-${width}-${theme}.png`});
    await page.reload(); await expect(page.getByRole('heading',{level:1})).toHaveText('Crystalized Ball');
    if (width>=840) await expect(page.locator('.component-link.active')).toBeInViewport();
  });
}

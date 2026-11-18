import { expect, test, type Page } from '@playwright/test';

// 外部サービスへは送信せず、すべてモックで応答します。
const MOCKED_HOSTS = ['fonts.googleapis.com', 'www.google.com'];

type PageLog = {
  externalHosts: Set<string>;
  failedPaths: string[];
  errors: string[];
};

const openTopPage = async (page: Page, baseURL: string): Promise<PageLog> => {
  const origin = new URL(baseURL).origin;
  const log: PageLog = { externalHosts: new Set(), failedPaths: [], errors: [] };

  await page.context().route(
    (url) => url.origin !== origin,
    async (route) => {
      const url = new URL(route.request().url());
      log.externalHosts.add(url.hostname);
      if (url.hostname === 'fonts.googleapis.com') {
        await route.fulfill({ contentType: 'text/css', body: '' });
      } else if (url.hostname === 'www.google.com' && url.pathname.startsWith('/maps/embed/')) {
        await route.fulfill({ contentType: 'text/html', body: '<p id="map-mock">map mock</p>' });
      } else {
        await route.abort();
      }
    },
  );
  page.on('response', (response) => {
    const url = new URL(response.url());
    if (url.origin === origin && response.status() >= 400) {
      log.failedPaths.push(url.pathname);
    }
  });
  page.on('pageerror', (error) => log.errors.push(error.message));

  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  return log;
};

const scrollTo = async (page: Page, y: number): Promise<void> => {
  await page.evaluate((top) => window.scrollTo(0, top), y);
};

test('トップページが表示され、外部通信はすべてモックされます', async ({ page, baseURL }) => {
  const log = await openTopPage(page, baseURL!);

  await expect(page).toHaveTitle(/Peerless Hair Salon/);
  await expect(page.locator('.hero-wrap h1').first()).toHaveText('美しく');
  await expect(page.locator('#prls-loader')).not.toHaveClass(/\bshow\b/);
  await expect(page.locator('footer')).toContainText(String(new Date().getFullYear()));
  await expect(page.frameLocator('iframe').locator('#map-mock')).toHaveText('map mock');

  const viewportHeight = page.viewportSize()!.height;
  const heroHeight = await page.locator('.hero-wrap').evaluate((el) => el.getBoundingClientRect().height);
  expect(heroHeight).toBe(viewportHeight);

  await page.waitForLoadState('networkidle');
  expect([...log.externalHosts].filter((host) => !MOCKED_HOSTS.includes(host))).toEqual([]);
  // アイコンフォント (fonts/) はリポジトリに存在しないため除外します。
  expect(log.failedPaths.filter((path) => !path.startsWith('/fonts/'))).toEqual([]);
  expect(log.errors).toEqual([]);
});

test('スクロール量に応じてナビゲーションバーの状態が変わります', async ({ page, baseURL }) => {
  const log = await openTopPage(page, baseURL!);
  const navbar = page.locator('#prls-navbar');

  await scrollTo(page, 900);
  await expect(navbar).toHaveClass(/\bscrolled\b/);
  await expect(navbar).toHaveClass(/\bawake\b/);

  await scrollTo(page, 0);
  await expect(navbar).not.toHaveClass(/\bscrolled\b/);
  await expect(navbar).not.toHaveClass(/\bawake\b/);
  expect(log.errors).toEqual([]);
});

test('表示範囲に入った要素にアニメーションが付きます', async ({ page, baseURL }) => {
  const log = await openTopPage(page, baseURL!);
  const about = page.locator('#prls-about .prls-animate');

  await expect(about).not.toHaveClass(/\bprls-animated\b/);
  await about.scrollIntoViewIfNeeded();
  await expect(about).toHaveClass(/\bprls-animated\b/);
  await expect(about).toHaveClass(/\bfadeInUp\b/);
  expect(log.errors).toEqual([]);
});

test('スクロールに応じてパララックスが動きます', async ({ page, baseURL, isMobile }) => {
  const log = await openTopPage(page, baseURL!);
  const heroText = page.locator('.hero-wrap [data-scrollax]').first();
  const hero = page.locator('.hero-wrap');
  const heroPosition = () => hero.evaluate((el) => getComputedStyle(el).backgroundPosition);
  const before = await heroPosition();

  await scrollTo(page, 300);
  await expect(heroText).toHaveAttribute('style', /transform/);
  // css/style.css が幅 991.98px 以下で背景位置を !important で固定するため、デスクトップだけで確認します。
  if (!isMobile) {
    await expect.poll(heroPosition).not.toBe(before);
  }
  expect(log.errors).toEqual([]);
});

test('ナビゲーションのリンクで該当セクションへ移動します', async ({ page, baseURL, isMobile }) => {
  const log = await openTopPage(page, baseURL!);
  const menu = page.locator('#prls-nav');

  if (isMobile) {
    await expect(menu).not.toBeVisible();
    await page.locator('.navbar-toggler').click();
    await expect(menu).toHaveClass(/\bshow\b/);
  }
  await menu.getByRole('link', { name: 'Staff' }).click();

  await expect(page).toHaveURL(/#prls-staff$/);
  await expect
    .poll(() => page.locator('#prls-staff').evaluate((el) => Math.round(el.getBoundingClientRect().top)))
    .toBe(0);
  if (isMobile) {
    await expect(menu).not.toHaveClass(/\bshow\b/);
  }
  expect(log.errors).toEqual([]);
});

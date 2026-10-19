import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { verifyDocking } from './verify-docking.mjs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const url = process.argv[2] || 'http://localhost:3000';
const trigger = () => page.getByRole('button', { name: 'Close sidebar', exact: true });
const state = () => page.locator('[data-slot="sidebar"]').getAttribute('data-state');
async function reveal() {
  await page.mouse.move(600, 400);
  await page.mouse.move(3, 250);
  await page.waitForTimeout(80);
  await page.mouse.move(100, 250);
  await page.waitForTimeout(300);
}

try {
  await page.goto(url, { waitUntil: 'networkidle' });
  assert.equal(await trigger().count(), 1, 'There is only one sidebar content tree');
  await trigger().click();
  await page.waitForTimeout(350);
  await reveal();
  console.log('Visible docking:', await page.evaluate(verifyDocking));

  // Resizing must remain available after the rounded floating panel docks.
  const rail = await page.locator('[data-slot="sidebar-rail"]').boundingBox();
  const widthBefore = await page.locator('[data-slot="sidebar-container"]').evaluate(el => el.getBoundingClientRect().width);
  await page.mouse.move(rail.x + rail.width / 2, 400);
  await page.mouse.down();
  await page.mouse.move(rail.x + rail.width / 2 + 40, 400, { steps: 8 });
  await page.mouse.up();
  const widthAfter = await page.locator('[data-slot="sidebar-container"]').evaluate(el => el.getBoundingClientRect().width);
  assert.ok(widthAfter > widthBefore + 30, 'The docked resize rail remains usable');

  await page.getByRole('button', { name: 'Downloads', exact: true }).hover();
  await page.getByRole('menu', { name: 'Downloads', exact: true }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Downloads', exact: true }).click();
  await page.waitForTimeout(350);
  assert.equal(await page.locator('[data-slot="sidebar-container"]').evaluate(el => el.getBoundingClientRect().x), 88);
  await page.getByRole('button', { name: 'Close secondary sidebar', exact: true }).click();
  await page.waitForTimeout(300);

  await trigger().click();
  await page.waitForTimeout(350);
  await reveal();
  await trigger().evaluate(el => el.click());
  await page.waitForTimeout(60);
  await trigger().evaluate(el => el.click());
  await page.waitForTimeout(350);
  assert.equal(await state(), 'collapsed');
  assert.equal(await page.locator('[data-slot="sidebar-container"]').evaluate(el => el.getBoundingClientRect().x), 8);
  console.log('Reversed docking:', await page.evaluate(verifyDocking));

  // The same regression should cover a stored, non-default sidebar width.
  await trigger().click();
  await page.waitForTimeout(350);
  await reveal();
  console.log('Resized docking:', await page.evaluate(verifyDocking));
  await page.mouse.move(600, 400);
  for (const delay of [60, 45, 60, 350]) {
    await page.keyboard.press('Control+b');
    await page.waitForTimeout(delay);
  }
  assert.equal(await state(), 'expanded');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'networkidle' });
  await page.keyboard.press('Control+b');
  await page.waitForTimeout(50);
  await reveal();
  await trigger().click();
  await page.waitForTimeout(50);
  assert.equal(await state(), 'expanded');
  assert.equal(await page.locator('[data-slot="sidebar-container"]').evaluate(el => el.getBoundingClientRect().x), 0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile has no horizontal overflow');
  await page.keyboard.press('Control+b');
  await page.getByRole('dialog').waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  assert.deepEqual(errors, []);
  console.log('Passed resize, downloads, reversal, keyboard, reduced motion, and mobile checks.');
} finally {
  await browser.close();
}

import { record } from './studio.mjs';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const output = process.argv[2] || join(tmpdir(), 'arc-docking-inspection');
const measurements = [];
await record({
  name: 'docking-inspection',
  url: process.argv[3] || 'http://localhost:3000',
  output,
  outro: false,
  async tour(f) {
    const page = f.page;
    await f.click(page.getByRole('button', { name: 'Close sidebar', exact: true }));
    await f.move(3, 250, .2);
    await f.move(100, 250, .2);
    await f.beat(.4);
    const preview = page.getByRole('complementary', { name: 'Sidebar preview', exact: true });
    const button = await f.target(preview.getByRole('button', { name: 'Close sidebar', exact: true }));
    await f.move(button.x, button.y, .3);
    f.mark('Docking begins');
    f.rate = .1;
    await page.mouse.down();
    await page.mouse.up();
    for (let i = 0; i < 72; i++) {
      await f.frame();
      measurements.push(await page.evaluate(() => {
        function read(selector) {
          const el = document.querySelector(selector);
          if (!el) return null;
          const r = el.getBoundingClientRect(), s = getComputedStyle(el);
          return { x: r.x, y: r.y, width: r.width, height: r.height,
            radius: s.borderRadius, opacity: s.opacity, clip: s.clipPath,
            shadow: s.boxShadow, transform: s.transform };
        }
        return { time: performance.now(), page: read('[data-slot="page-frame"]'),
          preview: read('[role="complementary"]'), sidebar: read('[data-slot="sidebar-container"]') };
      }));
    }
    f.mark('Docking ends');
    f.rate = 1;
    await writeFile(join(output, 'measurements.json'), JSON.stringify(measurements, null, 2));
  },
});

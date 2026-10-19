// Run with page.evaluate(verifyDocking) after revealing the floating sidebar.
// Hit testing matters here: matching numeric radii alone misses a page corner
// hidden behind the preview for most of the animation.
export async function verifyDocking() {
  const frame = document.querySelector('[data-slot="page-frame"]');
  const preview = document.querySelector('[aria-label="Sidebar preview"]');
  if (!frame || !preview || preview.getAttribute('aria-hidden') !== 'false') {
    throw new Error('Reveal the floating sidebar before checking docking.');
  }
  await new Promise(resolve => setTimeout(resolve, 250));
  const samples = [];
  preview.querySelector('[data-slot="sidebar-trigger"]').click();
  const start = performance.now();
  await new Promise(resolve => {
    function sample() {
      const rect = frame.getBoundingClientRect();
      const radius = parseFloat(getComputedStyle(frame).borderTopLeftRadius);
      const floating = document.querySelector('[role="complementary"]');
      if (floating && radius > 4 && radius < 9) {
        // Find the painted edge, independently of the clipping calculation.
        let left = rect.left;
        let right = Math.min(rect.right - 1, floating.getBoundingClientRect().right + 32);
        for (let i = 0; i < 14; i++) {
          const x = (left + right) / 2;
          if (document.elementFromPoint(x, rect.top + rect.height / 2) === frame) right = x;
          else left = x;
        }
        samples.push({
          radius,
          edge: right,
          top: document.elementFromPoint(right + 1, rect.top + 1) !== frame,
          bottom: document.elementFromPoint(right + 1, rect.bottom - 1) !== frame,
          inside: document.elementFromPoint(right + radius + 2, rect.top + radius + 2) === frame,
        });
      }
      if (performance.now() - start < 450) requestAnimationFrame(sample);
      else resolve();
    }
    requestAnimationFrame(sample);
  });
  if (samples.length < 2 || !samples.every(s => s.top && s.bottom && s.inside)) {
    throw new Error(`Docking corners were obscured: ${JSON.stringify(samples)}`);
  }
  if (samples.some((s, i) => i > 0 && s.edge > samples[i - 1].edge + 1)) {
    throw new Error('The exposed page edge reversed direction during docking.');
  }
  if (getComputedStyle(frame).clipPath !== 'none' || document.querySelector('[role="complementary"]')) {
    throw new Error('Docking did not clear the temporary clipping and preview.');
  }
  return { checkedFrames: samples.length, visibleCorners: true, cleanHandoff: true };
}

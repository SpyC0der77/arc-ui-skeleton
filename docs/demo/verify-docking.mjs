// Run with page.evaluate(verifyDocking) after revealing the floating sidebar.
// Check the actual surface, painted corners, and the end of the transition.
// Numeric radii alone miss both occlusion and a floating/docked DOM swap.
export async function verifyDocking() {
  const frame = document.querySelector('[data-slot="page-frame"]');
  const preview = document.querySelector('[aria-label="Sidebar preview"]');
  if (!frame || !preview || preview.getAttribute('aria-hidden') !== 'false') {
    throw new Error('Reveal the floating sidebar before checking docking.');
  }
  await new Promise(resolve => setTimeout(resolve, 250));
  const samples = [];
  const continuity = [];
  const trigger = preview.querySelector('[data-slot="sidebar-trigger"]');
  trigger.click();
  const start = performance.now();
  await new Promise(resolve => {
    function sample() {
      const rect = frame.getBoundingClientRect();
      const radius = parseFloat(getComputedStyle(frame).borderTopLeftRadius);
      continuity.push(preview.isConnected && trigger.isConnected &&
        preview === document.querySelector('[data-slot="sidebar-container"]') &&
        getComputedStyle(preview).opacity === '1');
      if (radius > 4 && radius < 9) {
        samples.push({
          radius,
          edge: rect.left,
          top: document.elementFromPoint(rect.left + radius * .05, rect.top + radius * .05) !== frame,
          bottom: document.elementFromPoint(rect.left + radius * .05, rect.bottom - radius * .05) !== frame,
          inside: document.elementFromPoint(rect.left + radius + 2, rect.top + radius + 2) === frame,
        });
      }
      if (performance.now() - start < 450) requestAnimationFrame(sample);
      else resolve();
    }
    requestAnimationFrame(sample);
  });
  if (!continuity.every(Boolean)) {
    throw new Error('Docking replaced or hid the visible sidebar surface.');
  }
  if (samples.length < 2 || !samples.every(s => s.top && s.bottom && s.inside)) {
    throw new Error(`Docking corners were obscured: ${JSON.stringify(samples)}`);
  }
  if (samples.some((s, i) => i > 0 && s.edge > samples[i - 1].edge + 1)) {
    throw new Error('The exposed page edge reversed direction during docking.');
  }
  if (getComputedStyle(frame).clipPath !== 'none' || document.querySelector('[role="complementary"]')) {
    throw new Error('Docking did not clear the temporary clipping and preview.');
  }
  return { checkedFrames: continuity.length, visibleCorners: true, persistentSurface: true };
}

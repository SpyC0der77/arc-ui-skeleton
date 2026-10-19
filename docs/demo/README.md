# Recording the demo

This script captures the deployed app at [https://arc-ui-skeleton.vercel.app](https://arc-ui-skeleton.vercel.app). It uses real browser interactions, eased cursor movement, short pauses, and camera zooms.

Use Node.js 20.9 or newer and FFmpeg on your PATH. From the repository root, run:

```bash
npm ci --prefix docs/demo
npm exec --prefix docs/demo -- playwright install chromium
node docs/demo/record.mjs
```

The script replaces `docs/images/demo.gif` and `docs/images/demo.mp4`. It does not start a development server. The recording dependencies are separate from the app's dependencies.

Edit the tour in [record.mjs](record.mjs) to change the actions. Shared timing, cursor, camera, and encoding settings are in [studio.mjs](studio.mjs). The full viewport stays visible during docking and undocking. Detail zooms are limited to 1.1x for the address palette and downloads popup. The tour starts docked, undocks into the floating hover preview, and docks again. Both sidebar transitions run continuously without camera cuts. The browser clock runs at 35% speed around those transitions so the layout animation is visible. The clock is installed before loading the app so its animation library uses the same timer. Camera cuts only skip travel between the address palette and sidebar controls. Zooms crop the captured pixels without changing the app layout.

The MP4 is 960 x 600 at 18 fps. The smaller GIF is 720 x 450 at 10 fps. Captured frames stay in an OS temporary directory. `capture.json` contains the tour timings and local frame path for debugging; it is not intended for committing.

To inspect only docking at 10% speed, run `node docs/demo/inspect-docking.mjs <output-directory> [url]`. It defaults to the existing server at `http://localhost:3000` and writes a video, individual frames, and geometry measurements. It does not start a server or replace the published demo. `verify-docking.mjs` exports a browser check for surface identity, opacity, exposed page corners, and settling; call it with `page.evaluate(verifyDocking)` after revealing the preview.

Run `node docs/demo/check-docking.mjs [url]` for the docking regression, resizing, downloads rail, interrupted transitions, keyboard shortcut, reduced motion, and mobile sheet checks. It uses an isolated browser context and the already-running app.

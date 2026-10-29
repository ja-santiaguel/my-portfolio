// Pre-shrunk copies of a showcase screen capture (2026-10-21): a mipmap chain
// for PhotoShowcase's live screen. Warped by a CSS matrix3d, a 2880px capture
// drawn 500-1000px wide is shrunk 3-6x by the GPU without filtering, so thin
// lines and type edges came out jagged; the showcase now shows whichever
// level is closest to the screen's size on screen, and these are resized
// with Lanczos, so every edge is properly filtered.
//
// Usage (from the project root): node scripts/screen-levels.cjs <capture.webp> [...]
//   writes <name>-w1920.webp, -w1280.webp, -w960.webp and -w640.webp beside it.
const path = require("path");
const sharp = require(path.resolve("node_modules", "sharp"));

const WIDTHS = [1920, 1280, 960, 640];

(async () => {
  for (const file of process.argv.slice(2)) {
    const { width } = await sharp(file).metadata();
    for (const w of WIDTHS.filter((w) => w < width)) {
      const out = file.replace(/\.webp$/, `-w${w}.webp`);
      const info = await sharp(file).resize(w, null, { kernel: "lanczos3" }).webp({ quality: 90 }).toFile(out);
      console.log(out, `${info.width}x${info.height}`, Math.round(info.size / 1024) + " KB");
    }
  }
})();

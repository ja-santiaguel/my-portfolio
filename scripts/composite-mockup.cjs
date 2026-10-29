// Puts a real screenshot onto a generated mockup's chroma-green screen.
// Usage (from the project root): node scripts/composite-mockup.cjs . <scene.png> <screenshot.png> <out.png> [cropTopPx] [expand]
//   expand: grow the detected screen quad from its centre (e.g. 1.05) so a
//   phone screen's rounded corners are covered; only green pixels are
//   replaced, so the overflow never shows.
//
// 1. Key the screen: pixels that are clearly green (g well above r and b).
// 2. Corners: the screen is a convex quad; its corners are the mask pixels
//    with extreme x+y and x-y (top-left, bottom-right, top-right, bottom-left).
// 3. Warp: inverse homography from each output pixel into the screenshot,
//    bilinear sampling; alpha = how green the scene pixel was, so anti-aliased
//    edges and anything in front of the screen stay intact.
// 4. Glass: a faint diagonal sheen and a touch of the scene's light falloff.
const path = require("path");
const [, , root, scenePath, shotPath, outPath, cropTop = "0", expand = "1"] = process.argv;
const sharp = require(path.resolve(root, "node_modules", "sharp"));

const greenness = (r, g, b) => (g - Math.max(r, b)) / 255; // 0..1

// Solve the 3x3 homography mapping 4 src points to 4 dst points.
function homography(src, dst) {
  const A = [], B = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i], [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); B.push(v);
  }
  // Gaussian elimination
  const n = 8;
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]]; [B[c], B[p]] = [B[p], B[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < n; k++) A[r][k] -= f * A[c][k];
      B[r] -= f * B[c];
    }
  }
  const h = B.map((b, i) => b / A[i][i]);
  return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1];
}

(async () => {
  const scene = await sharp(scenePath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = scene.info;
  const S = scene.data;

  // Mask and corners.
  let tl = null, br = null, tr = null, bl = null, count = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 3;
    if (greenness(S[i], S[i + 1], S[i + 2]) < 0.35) continue;
    count++;
    if (!tl || x + y < tl[0] + tl[1]) tl = [x, y];
    if (!br || x + y > br[0] + br[1]) br = [x, y];
    if (!tr || x - y > tr[0] - tr[1]) tr = [x, y];
    if (!bl || x - y < bl[0] - bl[1]) bl = [x, y];
  }
  if (count < 500) throw new Error("no green screen found");
  // Grow the quad from its centre (rounded phone corners).
  const k = +expand;
  if (k !== 1) {
    const cx = (tl[0] + tr[0] + br[0] + bl[0]) / 4, cy = (tl[1] + tr[1] + br[1] + bl[1]) / 4;
    for (const p of [tl, tr, br, bl]) { p[0] = cx + (p[0] - cx) * k; p[1] = cy + (p[1] - cy) * k; }
  }
  console.log("screen corners", JSON.stringify({ tl, tr, br, bl }), "pixels", count);

  // Screenshot, cropped to the screen's aspect from the top.
  const shotMeta = await sharp(shotPath).metadata();
  const quadW = (Math.hypot(tr[0] - tl[0], tr[1] - tl[1]) + Math.hypot(br[0] - bl[0], br[1] - bl[1])) / 2;
  const quadH = (Math.hypot(bl[0] - tl[0], bl[1] - tl[1]) + Math.hypot(br[0] - tr[0], br[1] - tr[1])) / 2;
  const aspect = quadH / quadW; // approximate (perspective), good for the crop
  const top = +cropTop;
  const sw = shotMeta.width, sh = Math.min(shotMeta.height - top, Math.round(sw * aspect));
  // Pre-scale to ~2x the screen's size on the photo (Lanczos); each output
  // pixel then averages a 4x4 grid of samples across its footprint (2026-10-21:
  // one sample per pixel left angled lines and box edges stair-stepped).
  const tw = Math.min(sw, Math.round(quadW * 2)), th = Math.round(tw * sh / sw);
  const shot = await sharp(shotPath).extract({ left: 0, top, width: sw, height: sh }).resize(tw, th, { kernel: "lanczos3" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const P = shot.data;
  const SS = 4; // samples per pixel, per axis

  // Output -> screenshot mapping.
  const Hm = homography([tl, tr, br, bl], [[0, 0], [tw, 0], [tw, th], [0, th]]);
  const out = Buffer.from(S);
  // A margin around the screen, scaled with the image (upscaled scenes have
  // wider soft edges), for the warp and the green-spill clean-up.
  const M = Math.max(4, Math.round(W / 300));
  const minX = Math.floor(Math.min(tl[0], bl[0], tr[0], br[0])) - M, maxX = Math.ceil(Math.max(tl[0], bl[0], tr[0], br[0])) + M;
  const minY = Math.floor(Math.min(tl[1], tr[1], bl[1], br[1])) - M, maxY = Math.ceil(Math.max(tl[1], tr[1], bl[1], br[1])) + M;
  for (let y = Math.max(0, minY); y < Math.min(H, maxY); y++) for (let x = Math.max(0, minX); x < Math.min(W, maxX); x++) {
    const i = (y * W + x) * 3;
    const a = Math.min(1, Math.max(0, (greenness(S[i], S[i + 1], S[i + 2]) - 0.08) / 0.3));
    if (a <= 0) {
      // Faint green fringe on the bezel just outside the key (2026-10-20):
      // neutralise any green cast there.
      out[i + 1] = Math.min(out[i + 1], Math.max(out[i], out[i + 2]) + 2);
      continue;
    }
    const px = [0, 0, 0];
    let uc = 0, vc = 0;
    for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
      const X = x + (sx + 0.5) / SS, Y = y + (sy + 0.5) / SS;
      const d = Hm[6] * X + Hm[7] * Y + Hm[8];
      let u = (Hm[0] * X + Hm[1] * Y + Hm[2]) / d, v = (Hm[3] * X + Hm[4] * Y + Hm[5]) / d;
      u = Math.min(tw - 1.001, Math.max(0, u)); v = Math.min(th - 1.001, Math.max(0, v));
      uc += u; vc += v;
      const x0 = Math.floor(u), y0 = Math.floor(v), fx = u - x0, fy = v - y0;
      for (const [dx, dy, w] of [[0, 0, (1 - fx) * (1 - fy)], [1, 0, fx * (1 - fy)], [0, 1, (1 - fx) * fy], [1, 1, fx * fy]]) {
        const j = ((y0 + dy) * tw + (x0 + dx)) * 3;
        px[0] += P[j] * w; px[1] += P[j + 1] * w; px[2] += P[j + 2] * w;
      }
    }
    const n = SS * SS;
    px[0] /= n; px[1] /= n; px[2] /= n;
    const u = uc / n, v = vc / n;
    // Glass: a soft diagonal sheen across the upper left of the screen.
    const t = u / tw * 0.6 + v / th * 0.4;
    const sheen = Math.max(0, 0.06 - Math.abs(t - 0.32) * 0.12);
    for (let c = 0; c < 3; c++) {
      const lit = px[c] * (1 - sheen) + 255 * sheen;
      out[i + c] = Math.round(S[i + c] * (1 - a) + lit * a);
    }
    // Remove green spill left at the edge.
    if (a < 1) out[i + 1] = Math.min(out[i + 1], Math.max(out[i], out[i + 2]) + 2);
  }
  await sharp(out, { raw: { width: W, height: H, channels: 3 } }).png().toFile(outPath);
  console.log("written", outPath);
})();

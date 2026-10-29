// Upscales the ChatGPT-generated mockup scenes to the resolution of the
// photographed mockups (2026-10-20). Real-ESRGAN (realesrgan-x4plus, run on
// the GPU outside the repo) gives crisp edges but smooths texture into a
// painted look, so its output is blended with a plain Lanczos resize (25%)
// and given a fine monochrome grain, which keeps the edges and brings back
// the photo's texture. The scene is then graded (per project) and the real
// screenshot composited at the new size.
//
// Usage (from the project root, after Real-ESRGAN has written <name>-x4.png):
//   node scripts/upscale-mockups.cjs <esrgan-out-dir> <work-dir>
const path = require("path");
const { execFileSync } = require("child_process");
const sharp = require(path.resolve("node_modules", "sharp"));

const [, , esrDir, work] = process.argv;
const M = "content/mockups";
const GR = "public/images/projects/general-roofing";
const HV = "public/images/projects/highland-ventures";

const ONLY = process.argv[4];
const jobs = [
  { name: "gr2-laptop", size: [3840, 2560], grade: [0.95, 0.99, 1.06], shot: `${GR}/screen-home.webp`, out: `${GR}/scene-laptop.webp` },
  { name: "gr2-cover", size: [2048, 3072], grade: [0.95, 0.99, 1.06], shot: `${GR}/screen-d-home.webp`, out: `${GR}/cover-concrete.webp` },
  // Keyboard redrawn by Nano Banana Pro at 4K (2026-10-22), native like the
  // cover; its tones are matched to its own first, ungraded version, the same
  // cool neutral grey as the cover's reference (the warm grade is dropped).
  { name: "hv2-laptop", native: true, size: [3840, 2560], match: { src: `${M}/hv2-laptop-v1.png` }, shot: `${HV}/screen-home.webp`, out: `${HV}/scene-laptop.webp` },
  // Keyboard redrawn by Nano Banana Pro at 4K (2026-10-22, real legends): the
  // source is already larger than the cover, so no upscaler (`native`), just
  // a crop to 2:3 and a resize. Its tones are matched to the first, ungraded
  // cover (cool neutral grey stone), which Jonathan chose as the reference for
  // both Highland assets (2026-10-22).
  { name: "hv2-cover", native: true, size: [2048, 3072], match: { src: `${M}/hv2-cover-v1.png` }, shot: `${HV}/screen-home.webp`, out: `${HV}/cover-stone.webp` },
  // The phone's screen is part of the generated photo (not a real screenshot):
  // AI upscaling invents letters in small text, so the phone keeps the plain
  // resize (`keep`, a polygon in the source's pixels, feathered).
  { name: "aether-extended", size: [3840, 2560], out: "public/images/projects/aether/scene-phone.webp", keep: [[420, 280], [655, 272], [745, 760], [512, 790]] },
  // Landing covers (photographed mockups, 2026-10-20): 2x, their lettering
  // (the app screen, the magazine covers and spines) kept on the plain resize.
  { name: "aether-cover", src: "public/images/mockups/aether/mobile_mockup_02.png", size: [2628, 4238], out: "public/images/projects/aether/cover-phone.webp", keep: [[480, 595], [965, 590], [905, 1540], [365, 1520]] },
  { name: "arasaka-cover", src: "public/images/mockups/arasaka/magazine_mockup_01.png", size: [2400, 3696], out: "public/images/projects/arasaka/cover-magazines.webp",
    // Fine dark speckle the upscaler wipes out: mostly the plain resize.
    blend: 0.6, keep: [[140, 860], [650, 680], [1020, 960], [530, 1170]] },
];

const BLEND = 0.25; // share of the plain resize
const GRAIN = 3.2; // grain strength, in 0-255 levels (standard deviation)

// A deterministic gaussian-ish grain, so reruns give the same file.
let seed = 7;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const gauss = () => (rand() + rand() + rand() + rand() - 2) * 1.7;

// Matches an image's tones to an earlier version of the same scene, channel
// by channel (histogram matching), so a regenerated photo keeps the grade
// it had: contrast and colour, not just a tint. The chroma screen is left out
// of both histograms.
const isKey = (b, i) => b[i + 1] > 80 && b[i + 1] > b[i] * 1.4 && b[i + 1] > b[i + 2] * 1.4;
async function matchTones(out, w, h, { src, grade = [1, 1, 1] }) {
  const ref = await sharp(src).removeAlpha().resize(w, h, { kernel: "lanczos3" }).raw().toBuffer();
  for (let i = 0; i < ref.length; i += 3) for (let c = 0; c < 3; c++) ref[i + c] = Math.min(255, ref[i + c] * grade[c]);
  const cdf = (b) => {
    const hist = [0, 1, 2].map(() => new Float64Array(256));
    let n = 0;
    for (let i = 0; i < b.length; i += 3) {
      if (isKey(b, i)) continue;
      for (let c = 0; c < 3; c++) hist[c][b[i + c]]++;
      n++;
    }
    return hist.map((hc) => { let s = 0; return hc.map((v) => (s += v) / n); });
  };
  const a = cdf(out), r = cdf(ref);
  const lut = [0, 1, 2].map((c) => {
    const t = new Uint8Array(256);
    for (let v = 0, k = 0; v < 256; v++) {
      while (k < 255 && r[c][k] < a[c][v]) k++;
      t[v] = k;
    }
    return t;
  });
  for (let i = 0; i < out.length; i += 3) {
    if (isKey(out, i)) continue;
    for (let c = 0; c < 3; c++) out[i + c] = lut[c][out[i + c]];
  }
}

(async () => {
  for (const j of jobs.filter((x) => !ONLY || x.name === ONLY)) {
    const [w, h] = j.size;
    // A native source (already larger than the output) is cropped to the
    // output's aspect and resized; it needs no upscaler and no added grain.
    const native = async (file) => {
      const m = await sharp(file).metadata();
      const cw = Math.min(m.width, Math.round((m.height * w) / h)), ch = Math.min(m.height, Math.round((m.width * h) / w));
      return sharp(file).extract({ left: Math.floor((m.width - cw) / 2), top: Math.floor((m.height - ch) / 2), width: cw, height: ch });
    };
    const src = j.src || `${M}/${j.name}.png`;
    const e = await (j.native ? await native(src) : sharp(`${esrDir}/${j.name}-x4.png`)).removeAlpha().resize(w, h, { kernel: "lanczos3" }).raw().toBuffer();
    const l = await (j.native ? await native(src) : sharp(src)).removeAlpha().resize(w, h, { kernel: "lanczos3" }).raw().toBuffer();
    // Where to keep the plain resize: a feathered mask (1 = plain).
    let keep = null;
    if (j.keep) {
      const sm = await sharp((j.src || `${M}/${j.name}.png`)).metadata();
      const k = w / sm.width;
      const pts = j.keep.map(([x, y]) => `${x * k},${y * k}`).join(" ");
      const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#000"/><polygon points="${pts}" fill="#fff"/></svg>`);
      keep = await sharp(svg).blur(18).greyscale().raw().toBuffer();
    }
    const out = Buffer.alloc(e.length);
    for (let i = 0; i < e.length; i += 3) {
      const g = j.native ? 0 : gauss() * GRAIN;
      const base = j.blend ?? BLEND;
      const b = keep ? base + (1 - base) * (keep[i / 3] / 255) : base;
      for (let c = 0; c < 3; c++) {
        let v = e[i + c] * (1 - b) + l[i + c] * b + g;
        if (j.grade) v *= j.grade[c];
        out[i + c] = v < 0 ? 0 : v > 255 ? 255 : v;
      }
    }
    if (j.match) await matchTones(out, w, h, j.match);
    const scene = `${work}/${j.name}-hd.png`;
    await sharp(out, { raw: { width: w, height: h, channels: 3 } }).png().toFile(scene);
    let final = scene;
    if (j.shot) {
      final = `${M}/${j.name}-hd-composite.png`;
      const log = execFileSync("node", ["scripts/composite-mockup.cjs", ".", scene, j.shot, final]).toString();
      console.log(j.name, log.split("\n")[0]);
    }
    const info = await sharp(final).webp({ quality: 86 }).toFile(j.out);
    console.log(j.name, "->", j.out, `${info.width}x${info.height}`, Math.round(info.size / 1024) + " KB");
  }
})();

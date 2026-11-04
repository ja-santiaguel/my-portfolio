// Mixed display letters (2026-11-02, Jonathan): a few capitals in each display
// word are set in the serif italic (Bodoni Moda) among Archivo's. They must match
// Archivo's capitals exactly, with no pixel above its cap line or below its
// baseline (Jonathan: "zero pixel overhang"). Scaling to the cap height alone
// leaves 1-2px (round letters overshoot; baselines snap to whole pixels), so
// each serif letter is scaled to the cap height plus one device pixel, then
// clipped to the cap line and baseline. Both faces are measured from their
// rendered pixels, at the size in use.
//
// Source strings mark the serif letters with braces: "De{s}ign{e}r".
//
// Markup for a serif letter (globals.css styles it):
//   <span data-serif="">          clips to the band; carries the variables
//     <span data-serif-glyph>S</span>   the serif letter, sized and shifted
//     <span data-serif-probe />         finds the line's baseline
//   </span>

// The serif's family and weight come from the CSS (--font-serif,
// --type-serif-weight in globals.css), so changing the face is one line there.
let face;
function serifFace() {
  if (!face) {
    const root = getComputedStyle(document.documentElement);
    face = {
      family: root.getPropertyValue("--font-serif").split(",")[0].trim() || "serif",
      weight: root.getPropertyValue("--type-serif-weight").trim() || "400",
    };
  }
  return face;
}
const serifFont = (px) => `italic ${serifFace().weight} ${px}px ${serifFace().family}`;
const STRETCH = { "50%": "ultra-condensed", "62.5%": "extra-condensed", "75%": "condensed", "87.5%": "semi-condensed" };

// "De{s}ign{e}r" -> { text: "Designer", serif: Set { 2, 6 } }
export function parseMixed(source) {
  let text = "";
  const serif = new Set();
  for (let i = 0; i < source.length; i++) {
    if (source[i] === "{" && source[i + 2] === "}") {
      serif.add(text.length);
      text += source[i + 1];
      i += 2;
    } else {
      text += source[i];
    }
  }
  return { text, serif };
}

export const plainText = (source) => parseMixed(source).text;

const dpr = () => window.devicePixelRatio || 1;

let canvas;
function draw(size, paint) {
  canvas ??= document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  paint(ctx);
  const data = ctx.getImageData(0, 0, size, size).data;
  let top = -1;
  let bottom = -1;
  let topAlpha = 0;
  for (let y = 0; y < size; y++) {
    let alpha = 0;
    for (let x = 0, o = y * size * 4; x < size; x++) alpha = Math.max(alpha, data[o + x * 4 + 3]);
    if (!alpha) continue;
    if (top < 0) {
      top = y;
      topAlpha = alpha;
    }
    bottom = y;
  }
  return { top, bottom, topAlpha };
}

// The serif capital's ink, per em of its size: above and below the baseline,
// and across (x from the pen position): its full extent, and at half its
// height, where the eye judges the space between letters.
const glyphs = new Map();
function glyphInk(letter) {
  if (!glyphs.has(letter)) {
    const ink = draw(640, (ctx) => {
      ctx.font = serifFont(400);
      ctx.fillText(letter, 120, 480);
    });
    const data = canvas.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, 640, 640).data;
    const across = (y0, y1) => {
      let x0 = 640;
      let x1 = -1;
      for (let y = y0; y <= y1; y++) {
        for (let x = 0; x < 640; x++) {
          if (!data[(y * 640 + x) * 4 + 3]) continue;
          x0 = Math.min(x0, x);
          x1 = Math.max(x1, x);
        }
      }
      return [(x0 - 120) / 400, (x1 + 1 - 120) / 400];
    };
    const mid = Math.round((ink.top + 480) / 2);
    const [left, right] = across(ink.top, ink.bottom);
    const [midLeft, midRight] = across(mid - 2, mid + 2);
    const ctx = canvas.getContext("2d");
    ctx.font = serifFont(400);
    glyphs.set(letter, {
      above: (480 - ink.top) / 400,
      below: (ink.bottom + 1 - 480) / 400,
      left,
      right,
      midLeft,
      midRight,
      advance: ctx.measureText(letter).width / 400,
    });
  }
  return glyphs.get(letter);
}

// ---- Spacing between the two faces ----
// (2026-11-02, Jonathan: the footer read as "a jumble of letters", and the
// gaps around a serif letter were uneven: T to E wider than E to R.) The gap
// the eye sees between two letters depends on both shapes: an italic leans
// toward one neighbour and away from the other, and a T leaves open space
// under its bar. So each side of a serif letter is spaced against its actual
// neighbour: both letters' outlines are compared row by row up the capital
// height, and the serif letter sits where the average gap (open space counted
// only so far, ROW_DEPTH) equals the gap Archivo itself leaves between those
// two letters. Same row maths on both sides, so the rhythm matches the sans.
const ROWS = 24;
const ROW_DEPTH = 0.2; // the most open space one row can count, in cap heights

// A letter's left and right outline at ROWS heights across its band, in em
// of its size from the pen position (null where the row has no ink). `band`
// maps a row (0 = the baseline, 1 = the cap line) to a height above the
// baseline in em.
const outlines = new Map();
function outline(font, stretch, letter, band) {
  const key = `${font}|${stretch}|${letter}`;
  if (!outlines.has(key)) {
    const size = 400;
    const n = 900;
    const base = 650;
    const pen = 250;
    canvas ??= document.createElement("canvas");
    canvas.width = canvas.height = n;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.font = font.replace("{px}", `${size}px`);
    ctx.fontStretch = stretch;
    ctx.fillText(letter, pen, base);
    const data = ctx.getImageData(0, 0, n, n).data;
    const left = [];
    const right = [];
    for (let k = 0; k < ROWS; k++) {
      const y = Math.round(base - band((k + 0.5) / ROWS) * size);
      let x0 = n;
      let x1 = -1;
      for (let row = y - 3; row <= y + 3; row++) {
        for (let x = 0; x < n; x++) {
          if (data[(row * n + x) * 4 + 3] < 96) continue;
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
        }
      }
      left.push(x1 < 0 ? null : (x0 - pen) / size);
      right.push(x1 < 0 ? null : (x1 + 1 - pen) / size);
    }
    outlines.set(key, { left, right, advance: ctx.measureText(letter).width / size });
  }
  return outlines.get(key);
}

// The display face's letter: its band is its own capitals.
function sansOutline(style, letter) {
  const family = firstFamily(style.fontFamily);
  const capEm = capHeight(family, style.fontWeight, style.fontStretch, 400) / 400;
  return outline(`normal ${style.fontWeight} {px} ${family}`, STRETCH[style.fontStretch] ?? "normal", letter, (f) => f * capEm);
}

// The serif letter: its band is its own ink, which is fitted to the capitals.
function serifOutline(letter, ink) {
  return outline(`italic ${serifFace().weight} {px} ${serifFace().family}`, "normal", letter, (f) => -ink.below + f * (ink.above + ink.below));
}

// The average gap between a left letter's right outline and a right letter's
// left outline (both in px from their pens) when the right pen is `d` px on.
function gap(right, left, d, depth) {
  let sum = 0;
  for (let k = 0; k < ROWS; k++) {
    const a = right[k];
    const b = left[k];
    sum += a === null || b === null ? depth : Math.min(depth, d + b - a);
  }
  return sum / ROWS;
}

// The pen distance at which the average gap is `target` (it only grows with
// d). An italic may lean in where it tucks under its neighbour (Jonathan,
// 2026-11-02: "letter overlap is accepted"; a floor of 80% of the sans pair's
// narrowest gap left R and E too far apart), but never into it: with Bodoni
// Moda's hairlines, the E's top arm merged into the T's bar and read as a
// slash. So no row comes closer than `floor`, a hairline gap.
function solve(right, left, target, floor, depth, span) {
  let lo = -span;
  let hi = span;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (gap(right, left, mid, depth) < target) lo = mid;
    else hi = mid;
  }
  const d = (lo + hi) / 2;
  let near = Infinity;
  for (let k = 0; k < ROWS; k++) {
    if (right[k] !== null && left[k] !== null) near = Math.min(near, d + left[k] - right[k]);
  }
  return near < floor ? d + (floor - near) : d;
}

const MIN_GAP = 0.03; // the narrowest a serif letter may come to its neighbour, in cap heights

const scale = (list, px) => list.map((v) => (v === null ? null : v * px));
const mean = (list) => {
  const inked = list.filter((v) => v !== null);
  return inked.reduce((a, b) => a + b, 0) / (inked.length || 1);
};
const isLetter = (c) => /^[A-Z?!.,'’&]$/i.test(c || "");

// Room for the italic's lean (the split-flap cell clips at its box; the U and
// E were cut at their top right), then margins that put each neighbour where
// the matched gap says.
function setSides(el, m, style, letter, prev, next) {
  const { ink, size, fontSize } = m;
  const used = fontSize * adjustRatio(style);
  const spacing = parseFloat(style.letterSpacing) || 0;
  const edge = 1 / dpr();
  const padLeft = Math.max(0, -ink.left * size) + edge;
  const padRight = Math.max(0, (ink.right - ink.advance) * size) + edge;
  const cap = m.cap;
  const depth = ROW_DEPTH * cap;
  const upper = letter.toUpperCase();
  const serif = serifOutline(upper, ink);
  const sans = sansOutline(style, upper);
  const serifLeft = scale(serif.left, size);
  const serifRight = scale(serif.right, size);

  // Left: from the previous letter's pen to this one's.
  let marginLeft;
  if (isLetter(prev)) {
    const a = sansOutline(style, prev.toUpperCase());
    const aRight = scale(a.right, used);
    const plain = a.advance * used + spacing;
    const sansLeft = scale(sans.left, used);
    const target = gap(aRight, sansLeft, plain, depth);
    const d = solve(aRight, serifLeft, target, MIN_GAP * cap, depth, cap * 2);
    marginLeft = d - plain - padLeft;
  } else {
    // A word's edge: its outline, on average, where the sans letter's would be.
    marginLeft = mean(scale(sans.left, used)) - mean(serifLeft) - padLeft;
  }

  // Right: from this letter's pen to the next one's.
  let marginRight;
  if (isLetter(next)) {
    const c = sansOutline(style, next.toUpperCase());
    const cLeft = scale(c.left, used);
    const plain = sans.advance * used + spacing;
    const sansRight = scale(sans.right, used);
    const target = gap(sansRight, cLeft, plain, depth);
    const d = solve(serifRight, cLeft, target, MIN_GAP * cap, depth, cap * 2);
    marginRight = d - ink.advance * size - spacing - padRight;
  } else {
    marginRight =
      sans.advance * used - mean(scale(sans.right, used)) - (ink.advance * size - mean(serifRight)) - padRight;
  }

  el.style.setProperty("--serif-pad-left", `${padLeft.toFixed(3)}px`);
  el.style.setProperty("--serif-pad-right", `${padRight.toFixed(3)}px`);
  el.style.setProperty("--serif-margin-left", `${marginLeft.toFixed(3)}px`);
  el.style.setProperty("--serif-margin-right", `${marginRight.toFixed(3)}px`);
}

// How far the display face's H rises above the baseline at this size, to the
// fraction of a pixel (its top row is partly covered).
const caps = new Map();
function capHeight(family, weight, stretch, px) {
  const key = `${family}|${weight}|${stretch}|${px.toFixed(3)}`;
  if (!caps.has(key)) {
    const size = Math.ceil(px * 2);
    const base = Math.round(px * 1.5);
    const ink = draw(size, (ctx) => {
      ctx.font = `normal ${weight} ${px}px ${family}`;
      ctx.fontStretch = STRETCH[stretch] ?? "normal";
      ctx.fillText("H", Math.round(px * 0.2), base);
    });
    caps.set(key, base - (ink.top + 1 - ink.topAlpha / 255));
  }
  return caps.get(key);
}

// font-size-adjust scales the display face; canvas can't, so compare the
// rendered width of the same text with and without it.
const ratios = new Map();
function adjustRatio(style) {
  const adjust = style.fontSizeAdjust;
  if (!adjust || adjust === "none") return 1;
  const key = `${style.fontFamily}|${style.fontWeight}|${style.fontStretch}|${adjust}`;
  if (!ratios.has(key)) {
    const probe = document.createElement("span");
    probe.textContent = "HHHHHHHHHH";
    Object.assign(probe.style, {
      position: "absolute",
      visibility: "hidden",
      whiteSpace: "nowrap",
      font: `${style.fontWeight} 100px ${style.fontFamily}`,
      fontStretch: style.fontStretch,
    });
    document.body.appendChild(probe);
    const plain = probe.getBoundingClientRect().width;
    probe.style.fontSizeAdjust = adjust;
    ratios.set(key, probe.getBoundingClientRect().width / plain);
    probe.remove();
  }
  return ratios.get(key);
}

const firstFamily = (list) => list.split(",")[0].trim();

// Text baselines land on whole device pixels (counted from the page, which
// scrolls as one layer), so the clip does too.
function snap(viewportY) {
  const d = dpr();
  return Math.round((viewportY + window.scrollY) * d) / d - window.scrollY;
}

// The serif letter's size for the display text it sits in: its ink as tall as
// the capitals plus a device pixel either way (the clip trims that pixel).
function measure(style, letter) {
  const fontSize = parseFloat(style.fontSize);
  if (!fontSize) return null;
  const family = firstFamily(style.fontFamily);
  const used = fontSize * adjustRatio(style);
  // At the screen's own resolution: a 2x screen draws the H twice as large,
  // and its top edge falls a little differently (half a pixel at 240px).
  const cap = capHeight(family, style.fontWeight, style.fontStretch, used * dpr()) / dpr();
  const ink = glyphInk((letter || "H").toUpperCase());
  const bleed = 1 / dpr();
  const size = (cap + 2 * bleed) / (ink.above + ink.below);
  return { fontSize, cap, ink, bleed, size };
}

// Set one serif letter's size, shift, spacing and clip from the display text
// around it. Its neighbours come from data-prev and data-next.
export function fitSerifLetter(el) {
  const glyph = el.querySelector("[data-serif-glyph]");
  const probe = el.querySelector("[data-serif-probe]");
  if (!glyph || !probe) return;
  const style = getComputedStyle(el);
  const letter = glyph.textContent.trim();
  const m = measure(style, letter);
  if (!m) return;
  const { fontSize, cap, ink, bleed, size } = m;
  setSides(el, m, style, letter, el.dataset.prev, el.dataset.next);
  const box = el.getBoundingClientRect();
  const baseline = snap(probe.getBoundingClientRect().bottom);
  el.style.setProperty("--serif-size", `${(size / fontSize).toFixed(5)}em`);
  el.style.setProperty("--serif-shift", `${(bleed - ink.below * size).toFixed(3)}px`);
  el.style.setProperty("--serif-clip-top", `${(baseline - cap - box.top).toFixed(3)}px`);
  el.style.setProperty("--serif-clip-bottom", `${(box.bottom - baseline).toFixed(3)}px`);
  el.setAttribute("data-serif-fitted", "");
}

export function fitSerifLetters(root) {
  root?.querySelectorAll("[data-serif]").forEach(fitSerifLetter);
}

// The split-flap title (SplitFlapWord) draws its letters with pseudo-elements,
// which can't hold a probe. They're zero-height boxes with no line height, so
// measure how far a serif baseline sits below such a box's top at this size.
const offsets = new Map();
function baselineOffset(px) {
  const key = px.toFixed(3);
  if (!offsets.has(key)) {
    const box = document.createElement("div");
    Object.assign(box.style, {
      font: serifFont(px), // first: the shorthand resets line-height
      lineHeight: "0",
      position: "absolute",
      top: "0",
      left: "0",
      height: "0",
      whiteSpace: "nowrap",
      visibility: "hidden",
    });
    box.innerHTML = 'H<span style="display:inline-block;width:0;height:0"></span>';
    document.body.appendChild(box);
    offsets.set(key, box.lastChild.getBoundingClientRect().bottom - box.getBoundingClientRect().top);
    box.remove();
  }
  return offsets.get(key);
}

// One split-flap cell showing `letter` in the serif. The variables place its
// letters (and flaps) in the cell's own coordinates, so they move with the
// halves; the clip is the same cap line and baseline as fitSerifLetter's. Its
// neighbours are the cells either side (a serif one counts as a word's edge).
const cellLetter = (cell) =>
  cell && !cell.hasAttribute("data-serif-cell") ? cell.firstChild?.textContent ?? "" : "";

// `neighbours` ({ prev, next }) overrides the cells either side: a word that
// is changing passes its target letters, so a serif letter is spaced once,
// as its flip starts, not again when its neighbours land (2026-11-03,
// Jonathan: the E-V gap in DEVELOPER and R-O in FRONTEND shifted late).
export function fitSerifCell(cell, letter, neighbours) {
  const probe = cell.querySelector("[data-serif-probe]");
  if (!probe) return;
  const style = getComputedStyle(cell);
  const m = measure(style, letter);
  if (!m) return;
  const { fontSize, cap, ink, bleed, size } = m;
  const prev = neighbours ? neighbours.prev : cellLetter(cell.previousElementSibling);
  const next = neighbours ? neighbours.next : cellLetter(cell.nextElementSibling);
  setSides(cell, m, style, letter || "H", prev, next);
  const box = cell.getBoundingClientRect();
  // Snap where the cell rests, not where its rise has it now.
  const rise = style.transform !== "none" ? new DOMMatrixReadOnly(style.transform).m42 : 0;
  const restTop = box.top - rise;
  // The probe sits in .upper, whose split transform eases back to nothing for
  // a moment after a flip lands; measured against .upper itself (and undone
  // for its scale), the reading holds at any point of that ease (2026-11-03:
  // refits mid-ease crept the serif letter by a pixel at a time).
  const layer = probe.parentElement;
  const t = getComputedStyle(layer).transform;
  const scaleY = t !== "none" ? new DOMMatrixReadOnly(t).d : 1;
  if (!scaleY) return; // collapsed to its middle line: nothing to measure
  const laid = restTop + (probe.getBoundingClientRect().bottom - layer.getBoundingClientRect().top) / scaleY; // the baseline as laid out, in the viewport
  const baseline = snap(laid) - restTop; // in the cell
  const top = baseline + bleed - ink.below * size - baselineOffset(size);
  // These letters are drawn by absolutely placed pseudo-elements, and when
  // the baseline falls between pixels the browser may draw it on either one
  // (2026-11-02: at 180px+ it drew the H a pixel lower than rounding said,
  // leaving a row of the serif above it). So clip to the band both cases
  // share: exact on a whole pixel, at most a device pixel short otherwise,
  // never over.
  const d = dpr();
  const doc = (y) => (y + window.scrollY) * d;
  const lower = Math.ceil(doc(laid)) / d - window.scrollY; // baseline if drawn on the pixel below
  const upper = Math.floor(doc(laid)) / d - window.scrollY; // ... or above
  const boxTop = restTop + top; // the letter box, in the viewport
  cell.style.setProperty("--serif-size", `${(size / fontSize).toFixed(5)}em`);
  cell.style.setProperty("--serif-top", `${top.toFixed(3)}px`);
  // And one device pixel in at the top: the cap line these cells draw can sit
  // up to that much from the measured one (seen at 2x, 92-240px).
  cell.style.setProperty("--serif-clip-top", `${(lower - cap + 1 / d - boxTop).toFixed(3)}px`);
  cell.style.setProperty("--serif-clip-bottom", `${(boxTop - upper).toFixed(3)}px`);
  cell.style.setProperty("--serif-origin", `${(box.height / 2 - top).toFixed(3)}px`); // flaps hinge on the cell's middle line
  cell.setAttribute("data-serif-fitted", "");
}

// Fonts must be in before anything is measured.
export function serifFontsReady() {
  return Promise.all([
    document.fonts.load(serifFont(100), "ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
    document.fonts.ready,
  ]);
}

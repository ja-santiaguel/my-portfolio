// Runs a DOM-changing `update` inside a View Transition so shared elements
// (marked with data-vt / data-vt-class) glide to their new positions.
//
// Every project image moves to its real place (2026-10-20, Jonathan: "the
// photos actually go to their positions ... sequentially land in their
// proper order"): each travels its true path, nothing fades, and they leave
// 60 ms apart in project order, so they land one after another. An image
// whose start or end is off screen (the list's other slides, stacked above
// and below the window) keeps that order, but the part of its path outside
// the window is compressed to 30%, so it arrives as an ordered deck from
// just past the edge rather than streaking in from far away. Only images
// move (2026-10-20):
// titles are held hidden while they rearrange (html[data-layout-switching],
// which ViewTrigger respects) and play their own entrance once it's done.
// Browsers without the API, and visitors who prefer reduced motion, get an
// instant switch.

import { getLenis } from "@/lib/scroll";

const isOnScreen = (r) => r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;

const isShared = (el) => el.dataset.vtClass === "media";

// Nested groups: the photo inside each frame is its own group, nested in
// the frame's (which clips it), so it scales uniformly while the frame
// reshapes. Without support, the frames move as flat pictures.
// Checked in the browser only (the module also loads during server rendering).
const nested = () => typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("view-transition-group", "nearest");

const name = (root) => {
  root.querySelectorAll("[data-vt]").forEach((el) => {
    const on = isShared(el);
    el.style.viewTransitionName = on ? el.dataset.vt : "none";
    el.style.viewTransitionClass = on ? el.dataset.vtClass || "" : "";
  });
  if (!nested()) return;
  root.querySelectorAll("[data-vt-photo]").forEach((img) => {
    img.style.viewTransitionName = img.dataset.vtPhoto;
    img.style.viewTransitionClass = "photo";
    img.style.viewTransitionGroup = "nearest";
  });
};

const clearNames = (root) => {
  root.querySelectorAll("[data-vt], [data-vt-photo]").forEach((el) => {
    el.style.viewTransitionName = "";
    el.style.viewTransitionClass = "";
    el.style.viewTransitionGroup = "";
  });
};

// Each frame's clip (the list frames open from an inset as they scroll in):
// "none" becomes a zero inset so it can be animated to and from.
const OPEN = "inset(0px 0px 0px 0px)";
// A list frame's clip follows from its position (Slide.module.css,
// frameOpen: an inset of 14% top and 5% sides at the bottom edge of the
// window, open once 80% of the frame has entered), worked out here rather
// than read, because a freshly rendered frame's scroll-driven clip resolves
// a frame late. Grid cells have no clip.
const listClip = (el) => {
  const r = el.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (r.height * 0.8)));
  const k = 1 - p;
  return `inset(${(14 * k).toFixed(3)}% ${(5 * k).toFixed(3)}% 0% ${(5 * k).toFixed(3)}%)`;
};
const clips = (root) => {
  const map = new Map();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.querySelectorAll("[data-vt]").forEach((el) => {
    if (!isShared(el)) return;
    map.set(el.dataset.vt, el.closest("[data-slide]") && !reduce ? listClip(el) : OPEN);
  });
  return map;
};

const rects = (root) => {
  const map = new Map();
  root.querySelectorAll("[data-vt]").forEach((el) => {
    if (isShared(el)) map.set(el.dataset.vt, el.getBoundingClientRect());
  });
  return map;
};

// Off screen: the distance beyond the window's edge compressed to 30%,
// keeping the order and spacing of the stack.
const FAR = 0.3;
const pull = (r) => {
  const vh = window.innerHeight;
  if (r.bottom <= 0) return { left: r.left, top: r.bottom * FAR - r.height, width: r.width, height: r.height };
  if (r.top >= vh) return { left: r.left, top: vh + (r.top - vh) * FAR, width: r.width, height: r.height };
  return r;
};

const frame = (r) => ({ transform: `matrix(1, 0, 0, 1, ${r.left}, ${r.top})`, width: `${r.width}px`, height: `${r.height}px` });

// The big-move curve (--ease-move), read from the page so it stays one token.
const moveEase = () => getComputedStyle(document.documentElement).getPropertyValue("--ease-move").trim() || "cubic-bezier(0.76, 0, 0.24, 1)";

// One after another, in project order (the order of the frames in the page).
const STAGGER = 60;

// The sequence (2026-10-20, Jonathan: "allow things to load-out first
// before huge motions"): 1. the titles and text leave (html[data-layout-
// leaving], --dur-micro); 2. the images rearrange (--dur-move, --ease-move);
// 3. the titles enter (ViewTrigger, released when data-layout-switching
// clears). Returns false while a switch is already running.
const LEAVE_MS = 200;

export function runLayoutTransition(root, update) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const html = document.documentElement;
  if (html.hasAttribute("data-layout-switching")) return false;
  if (!document.startViewTransition || reduce) {
    update();
    return true;
  }
  // Stop any glide in progress (a settle snap between projects) where it
  // is, so the frames keep the clip they had when the visitor clicked.
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(window.scrollY, { immediate: true, force: true });
  html.setAttribute("data-layout-switching", "");
  html.setAttribute("data-layout-leaving", "");
  setTimeout(() => move(root, update, html), LEAVE_MS);
  return true;
}

function move(root, update, html) {
  const before = rects(root);
  const clipBefore = clips(root);
  let after = new Map();
  let clipAfter = new Map();
  name(root);
  const transition = document.startViewTransition(async () => {
    update();
    // The update scrolled to the new layout: place the pictures for it now.
    window.dispatchEvent(new Event("parallax:place"));
    html.removeAttribute("data-layout-leaving");
    name(root);
    after = rects(root);
    clipAfter = clips(root);
    // The new layout's pictures decoded before the move starts (at most
    // 400 ms; the old frame holds meanwhile), so none pops in mid-flight.
    // (No frame waits here: rendering is paused during this update, so a
    // requestAnimationFrame would never fire. The parallax places itself
    // synchronously when the new layout mounts.)
    const imgs = [...root.querySelectorAll("[data-vt-photo]")];
    imgs.forEach((img) => (img.loading = "eager"));
    await Promise.race([
      Promise.all(imgs.map((img) => img.decode().catch(() => {}))),
      new Promise((r) => setTimeout(r, 400)),
    ]);
  });

  // Re-aim the off-screen paths, and send the images one after another.
  transition.ready
    .then(() => {
      const order = [...after.keys()];
      document.getAnimations().forEach((a) => {
        const pseudo = a.effect?.pseudoElement || "";
        const m = pseudo.match(/^::view-transition-(group|new|old)\((.+)\)$/);
        if (!m) return;
        // The photo nested in a frame shares its frame's place in the order.
        const key = m[2].replace(/^photo-/, "media-");
        const i = order.indexOf(key);
        if (i < 0) return;
        a.effect.updateTiming({ delay: i * STAGGER, fill: "both" });
        if (m[1] !== "group" || !before.has(m[2])) return;
        const from = before.get(m[2]), to = after.get(m[2]);
        // The frame's window carries its clip from where it was to where it
        // will rest (2026-10-20): a list frame part-way through its scroll-in
        // reveal keeps that clip as it leaves, and one arriving lands with
        // the clip its position gives it, so nothing snaps open or shut.
        const clipFrom = clipBefore.get(m[2]) || OPEN, clipTo = clipAfter.get(m[2]) || OPEN;
        // The curve lives on the keyframes in a view transition: replacing
        // them without it moved these images at constant speed (2026-10-20),
        // so they carry the big-move curve like every other image.
        const kf = isOnScreen(from) && isOnScreen(to) ? a.effect.getKeyframes() : [frame(pull(from)), frame(pull(to))];
        const first = kf[0], last = kf[kf.length - 1];
        a.effect.setKeyframes([
          { ...first, clipPath: clipFrom, easing: moveEase(), offset: 0 },
          ...kf.slice(1, -1),
          { ...last, clipPath: clipTo, offset: 1 },
        ]);
      });
    })
    .catch(() => {});
  transition.finished.finally(() => {
    clearNames(root);
    html.removeAttribute("data-layout-leaving");
    html.removeAttribute("data-layout-switching");
  });
}

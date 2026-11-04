"use client";

import { useEffect, useRef, useState } from "react";
import { fitSerifCell, parseMixed, serifFontsReady } from "@/lib/serifLetters";
import styles from "./SplitFlapWord.module.css";

// Split-flap display (departure-board) word swap. Each character splits into
// top and bottom halves, flips through a few letters, lands on its target,
// then merges back together (the whole word, letters that stay the same too). Cells start one after another, first
// letter to last, and every swap takes the same total time whatever the word
// length. Letters that disappear collapse into their middle line; letters that
// appear open out of it. On load the letters rise in sequentially (same timing
// as the showcase titles).
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SPREAD_MS = 560; // first cell start -> last cell start, for any word length
const SPLIT_MS = 150; // halves pull apart (or open out of the middle line)
const FLIP_MS = 70; // each intermediate flip
const LAST_FLIP_MS = 180; // the final flip settles a little slower
const MERGE_MS = 200; // halves come back together (or collapse away)
const FLIPS = 5; // flips per cell, including the final one

// Each letter exists once as real text (the sizer, so the heading reads
// correctly for search and copy); the visible halves and flaps are CSS
// pseudo-elements fed from data attributes.
//   upper: data-static = top half shown behind the falling flap; data-flap = falling (old) letter
//   lower: data-static = bottom half; data-flap = rising (new) letter
// Serif cells (2026-11-02, braces in the word: "De{s}ign{e}r") draw in
// the serif italic (Bodoni Moda), cut to the capitals' height (lib/serifLetters.js);
// the probe finds the baseline for that. It sits in .upper, the layer that
// draws the letters, so it measures the baseline actually drawn (in the
// cell's own line it could round a pixel apart at large sizes, 2026-11-02).
const escape = (c) => c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const cellHTML = (c, i, serif = false) =>
  `<span class="${styles.cell}" style="--i:${i}"${serif ? " data-serif-cell" : ""}>` +
  `<span class="${styles.sizer}">${escape(c)}</span>` +
  `<span class="${styles.upper}" data-static="${escape(c)}" data-flap=""><span data-serif-probe=""></span></span>` +
  `<span class="${styles.lower}" data-static="${escape(c)}" data-flap=""></span>` +
  `</span>`;

// Cells mid-flip are skipped (2026-11-02): the baseline probe sits in .upper,
// which moves while the halves split, so a refit then (the word's width
// animates, which fires the resize observer) placed the serif letter high,
// and it dropped into place when the flip landed. They're fitted as they
// start and once every letter has landed.
const fitCells = (word) =>
  word.querySelectorAll("[data-serif-cell]").forEach((cell) => {
    if (!cell.classList.contains(styles.halves)) fitSerifCell(cell, cell.firstChild.textContent);
  });

// A cell takes the face of the letter it lands on, from the start of its
// change, so the old letter passes through the new face as it flips.
function setSerif(cell, serif, letter, neighbours) {
  if (serif) {
    cell.setAttribute("data-serif-cell", "");
    fitSerifCell(cell, letter, neighbours);
  } else {
    cell.removeAttribute("data-serif-cell");
    cell.removeAttribute("data-serif-fitted");
  }
}

// FLIPS letters a cell shows on its way from `from` to `to`, walking the
// alphabet forward like a real flap drum. Short hops go once round the drum so
// every cell flips the same number of times. A disappearing cell (to "") just
// walks on; it collapses afterwards instead of landing.
function flipSequence(from, to) {
  const fi = ALPHABET.indexOf((from || "").toUpperCase());
  const ti = ALPHABET.indexOf((to || "").toUpperCase());
  const start = fi >= 0 ? fi : 0;
  let distance = ti >= 0 ? (ti - start + 26) % 26 : 9;
  if (distance < FLIPS) distance += 26;
  const picks = [];
  for (let k = 1; k < FLIPS; k++) picks.push(ALPHABET[(start + Math.round((k * distance) / FLIPS)) % 26]);
  return [...picks, to === "" ? ALPHABET[(start + distance) % 26] : to];
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function flipOnce(cell, from, to, ms) {
  const [, upper, lower] = cell.children;
  upper.dataset.static = to; // revealed behind the falling flap
  upper.dataset.flap = from;
  lower.dataset.static = from;
  lower.dataset.flap = to;
  cell.style.setProperty("--flip", `${ms}ms`);
  cell.classList.remove(styles.flipping);
  void cell.offsetWidth; // restart the flap animation
  cell.classList.add(styles.flipping);
  return sleep(ms).then(() => {
    lower.dataset.static = to;
    cell.classList.remove(styles.flipping);
  });
}

// Animate the cell's width to fit `letter` (or to 0), so the centred word
// re-centres smoothly instead of jumping.
function resizeTo(cell, letter, ms) {
  const sizer = cell.firstChild;
  cell.style.width = `${cell.getBoundingClientRect().width}px`;
  if (letter) sizer.textContent = letter;
  const target = letter ? sizer.getBoundingClientRect().width : 0;
  cell.style.setProperty("--t", `${ms}ms`);
  void cell.offsetWidth;
  cell.style.width = `${target}px`;
}

// Every cell of a changing word cuts and flips, even one landing on the
// letter it already shows (2026-11-02, Jonathan: DEVELOPER -> DESIGNER kept
// its DE still); that one goes once round the drum.
async function runCell(cell, from, to, run, serif, neighbours) {
  if (from === "" && to === "") return;
  const entering = from === "";
  const leaving = to === "";

  // Hold the width while the face changes; resizeTo animates it from here.
  cell.style.width = `${cell.getBoundingClientRect().width}px`;
  setSerif(cell, serif && !leaving, to, neighbours);

  // Split: halves pull apart. A new cell grows and its halves open out of
  // the middle line instead.
  cell.style.setProperty("--t", `${SPLIT_MS}ms`);
  if (entering) cell.classList.add(styles.collapsed);
  cell.classList.add(styles.halves);
  void cell.offsetWidth;
  cell.classList.add(styles.apart);
  cell.classList.remove(styles.collapsed);
  resizeTo(cell, leaving ? from : to, SPLIT_MS);
  await sleep(SPLIT_MS);

  const sequence = flipSequence(from, to);
  let current = from;
  for (let i = 0; i < sequence.length; i++) {
    if (run.cancelled) break;
    await flipOnce(cell, current, sequence[i], i === sequence.length - 1 ? LAST_FLIP_MS : FLIP_MS);
    current = sequence[i];
  }

  // Merge: halves come back together. A disappearing cell collapses into its
  // middle line and its width closes up.
  cell.style.setProperty("--t", `${MERGE_MS}ms`);
  cell.classList.remove(styles.apart);
  if (leaving) {
    cell.classList.add(styles.collapsed);
    resizeTo(cell, "", MERGE_MS);
  }
  await sleep(MERGE_MS);
  if (!leaving) {
    cell.classList.remove(styles.halves);
    cell.style.width = "";
  }
}

export default function SplitFlapWord({ word: rawWord, riseDelay = 0 }) {
  // Spaces become non-breaking spaces: a plain space in an inline-block cell
  // collapses to nothing, which would run words together ("KEY DECISIONS").
  const source = rawWord.replace(/ /g, " ");
  const { text: word, serif } = parseMixed(source);
  const ref = useRef(null);
  // Created once: React 19 re-applies dangerouslySetInnerHTML whenever the
  // object identity changes, which would reset the live cells to the first
  // word on every parent re-render.
  const [initialHTML] = useState(() => ({
    __html: word
      .split("")
      .map((c, i) => cellHTML(c, i, serif.has(i)))
      .join(""),
  }));
  const [rising, setRising] = useState(true);
  const shown = useRef(word);

  // Fit the serif cells once the fonts are in, and whenever the title
  // changes size.
  useEffect(() => {
    const el = ref.current;
    let ready = false;
    const fit = () => ready && fitCells(el);
    serifFontsReady().then(() => {
      ready = true;
      fit();
    });
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => {
      ready = false;
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    const from = shown.current;
    if (word === from) return;
    shown.current = word;
    const { serif } = parseMixed(source);

    const length = Math.max(from.length, word.length);
    while (el.children.length < length) {
      el.insertAdjacentHTML("beforeend", cellHTML("", el.children.length));
      el.lastChild.style.width = "0px"; // new cells start closed
    }
    const cells = [...el.children];
    const stagger = length > 1 ? SPREAD_MS / (length - 1) : 0;
    const run = { cancelled: false };
    Promise.all(
      cells.map((cell, i) =>
        sleep(i * stagger).then(() =>
          // Neighbours from the word being flipped to (a serif one counts as a
          // word's edge), so the spacing is final from the start.
          runCell(cell, from[i] ?? "", word[i] ?? "", run, serif.has(i), {
            prev: serif.has(i - 1) ? "" : word[i - 1] ?? "",
            next: serif.has(i + 1) ? "" : word[i + 1] ?? "",
          })
        )
      )
    ).then(() => {
      if (run.cancelled) return;
      while (el.children.length > word.length) el.lastChild.remove();
      // Every letter has landed: space the serif cells against their final
      // neighbours (their margins ease there).
      fitCells(el);
    });
    return () => {
      run.cancelled = true;
    };
  }, [word, source]);

  // Stop the load-in rise once the last letter has landed, so cells added
  // later by a flip don't rise in.
  const onAnimationEnd = (e) => {
    if (e.animationName.includes("cellRise") && e.target === ref.current?.lastElementChild) setRising(false);
  };

  // The cells are managed imperatively after the first render.
  return (
    <span
      ref={ref}
      className={styles.word}
      data-rise={rising ? "" : undefined}
      style={{ "--rise-delay": `${riseDelay}s` }}
      onAnimationEnd={onAnimationEnd}
      dangerouslySetInnerHTML={initialHTML}
    />
  );
}

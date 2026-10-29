"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SplitFlapWord.module.css";

// Split-flap display (departure-board) word swap. Each changing character
// splits into top and bottom halves, flips through a few letters, lands on its
// target, then merges back together. Cells start one after another, first
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
const FLIPS = 5; // flips per changing cell, including the final one

// Each letter exists once as real text (the sizer, so the heading reads
// correctly for search and copy); the visible halves and flaps are CSS
// pseudo-elements fed from data attributes.
//   upper: data-static = top half shown behind the falling flap; data-flap = falling (old) letter
//   lower: data-static = bottom half; data-flap = rising (new) letter
const escape = (c) => c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const cellHTML = (c, i) =>
  `<span class="${styles.cell}" style="--i:${i}">` +
  `<span class="${styles.sizer}">${escape(c)}</span>` +
  `<span class="${styles.upper}" data-static="${escape(c)}" data-flap=""></span>` +
  `<span class="${styles.lower}" data-static="${escape(c)}" data-flap=""></span>` +
  `</span>`;

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

async function runCell(cell, from, to, run) {
  if (from === to) return;
  const entering = from === "";
  const leaving = to === "";

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
  const word = rawWord.replace(/ /g, " ");
  const ref = useRef(null);
  // Created once: React 19 re-applies dangerouslySetInnerHTML whenever the
  // object identity changes, which would reset the live cells to the first
  // word on every parent re-render.
  const [initialHTML] = useState(() => ({ __html: word.split("").map(cellHTML).join("") }));
  const [rising, setRising] = useState(true);
  const shown = useRef(word);

  useEffect(() => {
    const el = ref.current;
    const from = shown.current;
    if (word === from) return;
    shown.current = word;

    const length = Math.max(from.length, word.length);
    while (el.children.length < length) {
      el.insertAdjacentHTML("beforeend", cellHTML("", el.children.length));
      el.lastChild.style.width = "0px"; // new cells start closed
    }
    const cells = [...el.children];
    const stagger = length > 1 ? SPREAD_MS / (length - 1) : 0;
    const run = { cancelled: false };
    Promise.all(
      cells.map((cell, i) => sleep(i * stagger).then(() => runCell(cell, from[i] ?? "", word[i] ?? "", run)))
    ).then(() => {
      if (run.cancelled) return;
      while (el.children.length > word.length) el.lastChild.remove();
    });
    return () => {
      run.cancelled = true;
    };
  }, [word]);

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

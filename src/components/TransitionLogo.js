import styles from "./PageTransition.module.css";
import { LOGO_VIEWBOX, body, details } from "./logoShapes";

// The hand mark, broken apart for the page transition, with a glitch
// (after auge-xp.com's home-icon hover).
//
// The large hand is cut into twelve horizontal strips of uneven height (clip
// paths over one shape); the six detail shards are separate. Assembling,
// every piece appears knocked sideways and then jumps, in hard steps (no
// easing), through a few random offsets, with one flicker, before snapping
// into place. Strips start at slightly different moments, so the mark
// stutters together. Leaving, it jitters the same way and each piece snaps
// off to the side and vanishes, just ahead of the blocks.
//
// Offsets and delays are per piece (CSS variables), from a fixed seed so the
// server and the browser render the same thing. Keyframes live in
// PageTransition.module.css.

const H = 151.73;
// Strip heights in viewBox units: uneven, like a torn signal.
const STRIPS = [9, 14, 7, 16, 10, 18, 8, 13, 11, 17, 9, 19.73];

// Deterministic pseudo-random in [-1, 1] for piece i, channel c.
const rand = (i, c) => {
  const x = Math.sin(i * 12.9898 + c * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

const glitchVars = (i, inBase, inSpread, outSpread) => {
  const off = (c, max) => `${(rand(i, c) * max).toFixed(1)}px`;
  return {
    "--g1": off(1, 24),
    "--g2": off(2, 16),
    "--g3": off(3, 20),
    "--g4": off(4, 9),
    "--g5": off(5, 4),
    "--gout": `${(rand(i, 6) >= 0 ? 1 : -1) * (30 + Math.abs(rand(i, 7)) * 30)}px`,
    "--in-d": `${Math.round(inBase + Math.abs(rand(i, 8)) * inSpread)}ms`,
    "--out-d": `${Math.round(Math.abs(rand(i, 9)) * outSpread)}ms`,
  };
};

export default function TransitionLogo() {
  let y = 0;
  const strips = STRIPS.map((h) => {
    const strip = { y, h };
    y += h;
    return strip;
  });
  return (
    <svg className={styles.logo} viewBox={LOGO_VIEWBOX} aria-hidden="true" focusable="false">
      <defs>
        <polygon id="pt-hand" points={body} />
        {strips.map((s, k) => (
          <clipPath key={k} id={`pt-strip-${k}`}>
            {/* A hair of overlap so no seam shows between strips at rest;
                wide enough that sideways jumps stay inside the strip. */}
            <rect x="-60" y={s.y - 0.3} width="230" height={s.h + 0.6} />
          </clipPath>
        ))}
      </defs>
      {strips.map((s, k) => (
        <g key={k} clipPath={`url(#pt-strip-${k})`}>
          <use href="#pt-hand" className={styles.piece} style={glitchVars(k, 140, 160, 90)} />
        </g>
      ))}
      {details.map((d, i) => (
        <polygon key={i} points={d.points} className={styles.piece} style={glitchVars(20 + i, 260, 140, 60)} />
      ))}
    </svg>
  );
}

export const LOGO_HEIGHT = H;

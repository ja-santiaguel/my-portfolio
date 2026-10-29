// Motion system (JS side). Mirrors the CSS tokens in styles/globals.css.
//
// One curve: a critically damped spring, the model behind Apple's SwiftUI
// `.smooth` animation (omega0 = 2π / duration, no bounce). It moves quickly at
// first and settles gently with no visible end point. Duration sets the
// character: short = crisp, long = calm.

const W0 = 2 * Math.PI;
const END = 1 - (1 + W0) * Math.exp(-W0); // value at t = 1, used to land exactly on 1

/** Spring easing, t in [0, 1] -> [0, 1]. */
export const springSmooth = (t) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return (1 - (1 + W0 * t) * Math.exp(-W0 * t)) / END;
};

/** Text entrances (2026-10-18): underdamped spring, ~4% overshoot at the
 *  halfway point, soft settle (damping 0.72). Mirrors --ease-rise. */
const Z = 0.72;
const WN = 9;
const WD = WN * Math.sqrt(1 - Z * Z);
const RAW = (t) => 1 - Math.exp(-Z * WN * t) * (Math.cos(WD * t) + (Z / Math.sqrt(1 - Z * Z)) * Math.sin(WD * t));
const RAW_END = RAW(1);
export const springRise = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : RAW(t) / RAW_END);

/** Reveals (2026-10-19, after mikewilcockdesign.com): expo ease-out as cubic
 *  bezier control points, for libraries that take them. Mirrors --ease-reveal. */
export const EASE_REVEAL = [0.16, 1, 0.3, 1];

/** Big moves between two resting places (list <-> grid). Mirrors --ease-move. */
export const EASE_MOVE = [0.76, 0, 0.24, 1];

/** Durations in ms, by role. */
export const DURATION = {
  micro: 200, // hover / press feedback
  short: 350, // small UI changes
  medium: 500, // layout moves (Apple's default)
  long: 800, // large entrances
  reveal: 1100, // text lines and screens coming into view (--dur-reveal)
  move: 900, // the list <-> grid rearrange (--dur-move)
  leave: 200, // text leaving before a rearrange (--dur-micro)
};

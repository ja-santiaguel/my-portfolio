// Symbols that iOS can draw as emoji (2026-10-29: "↗" showed as a blue emoji
// tile in the footer on an iPhone). The variation selector U+FE0E asks for
// the plain text glyph instead; it's invisible and screen readers skip it.
const TEXT = "︎";

export const ARROW_OUT = `↗${TEXT}`; // external links
export const COPYRIGHT = `©${TEXT}`;
export const TRIANGLE_LEFT = `◀${TEXT}`;
export const TRIANGLE_RIGHT = `▶${TEXT}`;

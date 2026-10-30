import styles from "./InkText.module.css";

// Text that fills with ink word by word when it comes into view (2026-10-19,
// for facts worth stopping on, e.g. Aether's problem). Until then it sits in
// a faint grey, already readable; ViewTrigger sets [data-in] and the words
// darken left to right, 35 ms apart. Leaving (scrolled back up), it plays
// in reverse: the last word greys first, back to the first (2026-10-19).
// `start` continues the word count from a previous InkText and `total` is
// the whole sentence's count, so two lines fill and empty as one sentence.
//
// mode="scroll" (2026-10-19, Aether's context): the fill follows the scroll
// instead, each word inking over its own stretch of the block's pass through
// the screen (CSS scroll-driven, or ScrollTimelineFallback where that's
// unsupported), and un-inking as you scroll back.
export default function InkText({ text, start = 0, total, mode = "trigger", className = "" }) {
  const words = text.split(" ");
  const n = total ?? start + words.length;
  return (
    <span
      className={`${styles.ink} ${className}`}
      data-mode={mode}
      data-trigger={mode === "trigger" ? "" : undefined}
      data-ink-scroll={mode === "scroll" ? "" : undefined}
      style={{ "--n": n }}
    >
      {words.map((w, i) => (
        <span key={i} className={styles.word} style={{ "--w": start + i }}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

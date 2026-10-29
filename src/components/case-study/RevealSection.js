import styles from "./CaseStudy.module.css";
import { RiseLettersScroll } from "../RiseText";

// A story section. Its title's letters ripple up as the title travels into
// view (tied to scroll, reversing when scrolled back). Focusable so the
// content list can move focus here.
// tone="ink": the section sits on a full-width ink band (the showcase).
export default function RevealSection({ id, title, tone, children }) {
  const headingId = `${id}-title`;
  return (
    <section id={id} className={styles.section} data-tone={tone} data-trigger="" aria-labelledby={headingId} tabIndex={-1}>
      <h2 id={headingId} className={styles.sectionTitle} aria-label={title}>
        <RiseLettersScroll text={title} />
      </h2>
      {children}
    </section>
  );
}

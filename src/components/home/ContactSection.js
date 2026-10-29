import { Fragment } from "react";
import Bracketed from "../Bracketed";
import HoverArrow from "../HoverArrow";
import slide from "./Slide.module.css";
import { FitLine } from "./FooterParts";
import styles from "./ContactSection.module.css";

// The footer: the site's ink ending across all eight columns (2026-10-15).
// After mikewilcockdesign.com's: one emphasised call to action, then a single
// row of details. The question spans columns 1-8 (FitLine fits its longer
// line to the margins). The details row continues the fixed corner label,
// which sits in columns 1-2 and serves as the footer's credit and "return to
// top". It never snaps (data-snap="free" opts it out of settle snapping).
const QUESTION = ["Interested in creating", "a digital experience?"];

// A details line. The footer's text enters on a trigger (2026-10-19): when
// the question comes into view its letters rise, then "[ Let's talk ]", the
// rule and the details follow on fixed delays; the ink columns stay tied to
// scroll.
function Line({ muted = false, children }) {
  return (
    <span className={styles.mask}>
      <span className={muted ? `${styles.rise} ${styles.muted}` : styles.rise}>{children}</span>
    </span>
  );
}

export default function ContactSection({ profile }) {
  let letter = 0;
  return (
    <section id="contact" className={styles.ending} data-snap="free" aria-labelledby="contact-title">
      {/* The ink: eight columns, like the page transition's blocks. As the
          footer scrolls in they rise one after another, left to right, and
          settle into a straight edge as it fills the screen. */}
      <div className={styles.columns} aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} style={{ "--i": i }} />
        ))}
      </div>

      {/* Letters rise one after another when the question comes into view
          (it starts the footer's text sequence). */}
      <FitLine as="h2" id="contact-title" className={styles.title} data-trigger="">
        <span className="visually-hidden">{QUESTION.join(" ")}</span>
        {QUESTION.map((line) => (
          <span key={line} className={styles.titleLine} data-fit-line="" aria-hidden="true">
            {line.split(" ").map((word, w) => (
              <Fragment key={word}>
                {w > 0 && " "}
                <span className={styles.word}>
                  {word.split("").map((ch) => (
                    <span key={letter} className={styles.letterMask}>
                      <span className={styles.letter} style={{ "--i": letter++ }}>
                        {ch}
                      </span>
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </span>
        ))}
      </FitLine>

      {/* The answer to the question, centred under it: opens an email (worded
          apart from the navbar's "Get in touch"). */}
      <a className={`${slide.learnMoreButton} ${styles.cta} touch-target`} href={`mailto:${profile.email}`}>
        <HoverArrow>
          <Line>
            <Bracketed>[ Let’s talk ]</Bracketed>
          </Line>
        </HoverArrow>
      </a>

      <div className={styles.details}>
        {/* Email, socials and the résumé: one centred row, evenly spaced, set
            apart from the strict column positions for visual balance
            (2026-10-16; the résumé joined 2026-10-27). The navbar's order: the
            email and résumé first, then the socials. */}
        <div className={styles.trio}>
          <div className={`${styles.detail} ${styles.contact}`}>
            <a className={`${styles.email} touch-target`} href={`mailto:${profile.email}`}>
              <Line>{profile.email}</Line>
            </a>
          </div>
          <div className={`${styles.detail} ${styles.resume}`}>
            <a className="touch-target" href={profile.resume} target="_blank" rel="noopener noreferrer" aria-label="Resume (PDF, opens in a new tab)">
              <Line>Resume ↗</Line>
            </a>
          </div>
          <div className={`${styles.detail} ${styles.linkedin}`}>
            <a className="touch-target" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">
              <Line>LinkedIn ↗</Line>
            </a>
          </div>
          <div className={`${styles.detail} ${styles.instagram}`}>
            <a className="touch-target" href={profile.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram (opens in a new tab)">
              <Line>Instagram ↗</Line>
            </a>
          </div>
        </div>
        <p className={`${styles.detail} ${styles.end}`}>
          <Line>© {new Date().getFullYear()}</Line>
          <Line>{profile.name}</Line>
        </p>
      </div>
    </section>
  );
}

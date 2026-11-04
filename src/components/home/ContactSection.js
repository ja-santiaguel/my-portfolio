import { Fragment } from "react";
import { ARROW_OUT, COPYRIGHT } from "@/lib/glyphs";
import { parseMixed, plainText } from "@/lib/serifLetters";
import Bracketed from "../Bracketed";
import HoverArrow from "../HoverArrow";
import slide from "./Slide.module.css";
import { FitLine, MailLink } from "./FooterParts";
import styles from "./ContactSection.module.css";

// The footer: the site's ink ending across all eight columns (2026-10-15).
// After mikewilcockdesign.com's: one emphasised call to action, then a single
// row of details. The question spans columns 1-8 (FitLine fits its longer
// line to the margins). The details row continues the fixed corner label,
// which sits in columns 1-2 and serves as the footer's credit and "return to
// top". It never snaps (data-snap="free" opts it out of settle snapping).
// Braces mark the serif letters (lib/serifLetters.js), chosen by the rules in
// content/projects.js (heroWords): open shapes, never a stem letter inside a
// word, spread evenly; one in a short word, two in a long one.
// The question (2026-11-02, Jonathan: "ready to create a visual experience?";
// it was "Interested in creating a digital experience?").
const QUESTION = ["Re{a}dy to cre{a}te", "a vi{s}u{a}l exp{e}rien{c}e?"];

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
      <div className={styles.columns} aria-hidden="true" data-ending-columns="">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} style={{ "--i": i }} />
        ))}
      </div>

      {/* Letters rise one after another when the question comes into view
          (it starts the footer's text sequence). */}
      <FitLine as="h2" id="contact-title" className={styles.title} data-trigger="">
        <span className="visually-hidden">{QUESTION.map(plainText).join(" ")}</span>
        {QUESTION.map((line) => (
          <span key={line} className={styles.titleLine} data-fit-line="" aria-hidden="true">
            {line.split(" ").map(parseMixed).map(({ text, serif }, w) => (
              <Fragment key={text}>
                {w > 0 && " "}
                <span className={styles.word}>
                  {text.split("").map((ch, c) => (
                    <span key={letter} className={styles.letterMask}>
                      {serif.has(c) ? (
                        <span
                          className={styles.letter}
                          style={{ "--i": letter++ }}
                          data-serif=""
                          data-prev={text[c - 1] ?? ""}
                          data-next={text[c + 1] ?? ""}
                        >
                          <span data-serif-glyph="">{ch}</span>
                          <span data-serif-probe="" />
                        </span>
                      ) : (
                        <span className={styles.letter} style={{ "--i": letter++ }}>
                          {ch}
                        </span>
                      )}
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
      <MailLink
        email={profile.email}
        className={`${slide.learnMoreButton} ${styles.cta} touch-target`}
        copied={
          <HoverArrow>
            <Line>
              <Bracketed>[ Email copied ]</Bracketed>
            </Line>
          </HoverArrow>
        }
      >
        <HoverArrow>
          <Line>
            <Bracketed>[ Let’s talk ]</Bracketed>
          </Line>
        </HoverArrow>
      </MailLink>

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
              <Line>Resume {ARROW_OUT}</Line>
            </a>
          </div>
          <div className={`${styles.detail} ${styles.linkedin}`}>
            <a className="touch-target" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">
              <Line>LinkedIn {ARROW_OUT}</Line>
            </a>
          </div>
          <div className={`${styles.detail} ${styles.instagram}`}>
            <a className="touch-target" href={profile.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram (opens in a new tab)">
              <Line>Instagram {ARROW_OUT}</Line>
            </a>
          </div>
        </div>
        <p className={`${styles.detail} ${styles.end}`}>
          <Line>{COPYRIGHT} {new Date().getFullYear()}</Line>
          <Line>{profile.name}</Line>
        </p>
      </div>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
import slide from "../home/Slide.module.css";
import styles from "./CaseStudy.module.css";
import Bracketed from "../Bracketed";
import HoverArrow from "../HoverArrow";
import ActionLabel from "../ActionLabel";
import Decision from "./Decision";
import { Panel, Phone, Screen } from "./Devices";
import RevealSection from "./RevealSection";
import RiseText, { RiseLine, RiseLettersScroll } from "../RiseText";
import InkText from "../InkText";

// Building blocks for "55-second" case studies: what a reviewer needs in
// under a minute, visible, visual and concise. A page composes these from its content file
// (src/content/case-studies/<slug>.js).
//
// Layout: a sticky content column, then a reading column (~65 characters)
// with a margin beside it. Screens are laid out like a drawing set: one
// scale (each spans as many columns as its crop needs) and notes level with
// the features they describe (Decision).
//
// Entrances (motion skill), all tied to scroll position rather than
// triggered: section titles' letters ripple up, text rises line by line as
// each line travels into view (RiseText), screens clip-open and drift with
// the site's depth parallax. Scrolling back reverses them.

// "In short": the whole story in three lines, before any scrolling.
export function Summary({ items }) {
  return (
    <section className={styles.summary} data-trigger="" aria-labelledby="summary-title">
      {/* No visible heading; kept for the page outline and screen readers. */}
      <h2 id="summary-title" className="visually-hidden">
        In short
      </h2>
      <dl className={styles.trio}>
        {items.map((item, i) => (
          <div key={i}>
            {/* A cell that continues the one before keeps its label for screen
                readers only (hideLabel), so the row reads as one group. */}
            <dt className={item.hideLabel ? "visually-hidden" : styles.label}>
              {item.hideLabel ? item.label : <RiseLine>{item.label}</RiseLine>}
            </dt>
            {item.hideLabel && <span className={styles.labelSpacer} aria-hidden="true" />}
            <dd className={styles.trioText}>
              <RiseText text={item.text} lead={item.lead} leadClassName={styles.leadIn} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export { RevealSection as Section };

// Three labelled facts in a row (context: client, goal, constraint).
export function Facts({ items }) {
  return (
    <dl className={`${styles.trio} ${styles.wideBlock}`}>
      {items.map((f) => (
        <div key={f.label}>
          <dt className={styles.label}>
            <RiseLine>{f.label}</RiseLine>
          </dt>
          <dd className={styles.trioText}>
            <RiseText text={f.text} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

// Each decision: numbered headline, a Why / Trade-off / What to notice strip,
// then the screen (Decision.js).
export function Decisions({ items }) {
  return (
    <div className={styles.decisions}>
      {items.map((d, i) => (
        <Decision key={d.title} index={i} decision={d} />
      ))}
    </div>
  );
}

// The process steps with a large preview of the active step (client).
export { default as Steps } from "./ProcessSteps";

// The finished product as real screens (2026-10-17): flat desktop screens
// and current iPhone frames (Devices.js), straight on the page.
//   layout "pages":  one screen full width, then two more as an unequal
//                    staggered pair.
//   layout "phones": three phones in a row, the middle one raised.
//   layout "hero":   a desktop screen with a phone over its lower right
//                    corner (the product first, at both sizes).
//   layout "photo":  one photographed mockup across the width ("narrow":
//                    the middle four columns, for a portrait).
//   layout "photos": two photographed mockups as a staggered pair.
//   Phones rows take any number of phones (two or three).
export function Showcase({ items }) {
  return (
    <>
      {items.map((item, i) => (
        <ShowcaseFigure key={`${item.layout}-${i}`} item={item} />
      ))}
    </>
  );
}

export function ShowcaseFigure({ item, className = "" }) {
  const { layout, screens = [], phones = [], images = [], image, caption } = item;
  return (
    <figure className={`${styles.showcaseFigure} ${className}`} data-layout={layout}>
      {layout === "pages" && (
        <>
          <Panel className={styles.showcaseFull}>
            <Screen image={screens[0]} />
          </Panel>
          <Panel className={styles.showcasePairA}>
            <Screen image={screens[1]} sizes="(min-width: 1024px) 40vw, 100vw" />
          </Panel>
          <Panel className={styles.showcasePairB} delay={120}>
            <Screen image={screens[2]} sizes="(min-width: 1024px) 30vw, 100vw" />
          </Panel>
        </>
      )}
      {layout === "phones" && (
        <Panel className={`${styles.showcaseFull} ${styles.phonePanel}`}>
          <div className={styles.phoneRow}>
            {phones.map((p) => (
              <div key={p.image.src} className={styles.phoneCell} data-count={phones.length}>
                <Phone {...p} />
              </div>
            ))}
          </div>
        </Panel>
      )}
      {layout === "photo" && (
        <Panel className={item.width === "narrow" ? styles.photoNarrow : styles.showcaseFull}>
          <Photo image={image} sizes={item.width === "narrow" ? "(min-width: 1024px) 45vw, 100vw" : "(min-width: 1024px) 70vw, 100vw"} />
        </Panel>
      )}
      {layout === "photos" && (
        <>
          <Panel className={styles.showcasePairA}>
            <Photo image={images[0]} sizes="(min-width: 1024px) 40vw, 100vw" />
          </Panel>
          <Panel className={styles.showcasePairB} delay={120}>
            <Photo image={images[1]} sizes="(min-width: 1024px) 30vw, 100vw" />
          </Panel>
        </>
      )}
      {layout === "hero" && (
        <Panel className={`${styles.showcaseFull} ${styles.heroPanel}`}>
          <div className={styles.heroScreen}>
            <Screen image={screens[0]} sizes="(min-width: 1024px) 70vw, 100vw" />
          </div>
          <div className={styles.heroPhone}>
            <Phone {...phones[0]} sizes="(min-width: 1024px) 14vw, 30vw" />
          </div>
        </Panel>
      )}
      {caption && (
        <figcaption className={`${styles.caption} ${styles.showcaseCaption}`}>
          <RiseText text={caption} />
        </figcaption>
      )}
    </figure>
  );
}

// Three lessons side by side, like "In short": each a heading, what
// happened, and what I'd do next time (labelled like the decisions' "Why").
export function Lessons({ items }) {
  return (
    <div className={`${styles.trio} ${styles.wideBlock} ${styles.lessons}`}>
      {items.map((l) => (
        <article key={l.title} className={styles.lesson}>
          <h3 className={styles.heading}>
            <RiseText text={l.title} />
          </h3>
          {l.paragraphs ? (
            l.paragraphs.map((p) => (
              <p key={p} className={`${styles.trioText} ${styles.lessonText}`}>
                <RiseText text={p} />
              </p>
            ))
          ) : (
            <>
              <p className={styles.trioText}>
                <span className={styles.inlineLabel}>
                  <RiseLine>What happened</RiseLine>
                </span>
                <RiseText text={l.happened} />
              </p>
              <p className={styles.trioText}>
                <span className={styles.inlineLabel}>
                  <RiseLine>Next time</RiseLine>
                </span>
                <RiseText text={l.next} />
              </p>
            </>
          )}
        </article>
      ))}
    </div>
  );
}

// A photographed mockup: the photo carries its own setting, so no edge.
function Photo({ image, sizes }) {
  return <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} className={styles.photo} />;
}

// Reading text in two columns under an optional sub-heading (3 + 3 content
// columns), like the decisions' strip.
export function TextPair({ title, paragraphs }) {
  return (
    <div className={`${styles.textPair} ${styles.wideBlock}`}>
      {title && (
        <h3 className={styles.heading}>
          <RiseText text={title} />
        </h3>
      )}
      {paragraphs.map((p) => (
        <p key={p} className={styles.trioText}>
          <RiseText text={p} />
        </p>
      ))}
    </div>
  );
}

// Statements that carry a section on their own (e.g. a problem's numbers),
// set large and stepping across the grid: the first from the left edge, the
// next ending on the rightmost column. They fill with ink word by word as
// one sentence (InkText), rather than rising.
export function Statements({ lines, mode = "trigger" }) {
  const total = lines.join(" ").split(" ").length;
  let start = 0;
  return (
    <div className={`${styles.statements} ${styles.wideBlock}`} data-ink={mode}>
      {lines.map((line) => {
        const from = start;
        start += line.split(" ").length;
        return (
          <p key={line} className={styles.statement}>
            <InkText text={line} start={from} total={total} mode={mode} />
          </p>
        );
      })}
    </div>
  );
}

// A numbered set of short findings, three across ("[ 1 ] Tiring").
export function Highlights({ items }) {
  return (
    <ol className={`${styles.trio} ${styles.wideBlock} ${styles.highlights}`}>
      {items.map((item, i) => (
        <li key={item} className={styles.decisionTitle}>
          <span className={styles.decisionNo}>
            <RiseLine>
              <Bracketed>{`[ ${i + 1} ]`}</Bracketed>
            </RiseLine>
          </span>
          <span className={styles.heading}>
            <RiseText text={item} />
          </span>
        </li>
      ))}
    </ol>
  );
}

// A research artefact (persona, journey map) as a framed screen with a
// title block above, like the decision screens.
export function FramedFigure({ title, image }) {
  return (
    <figure className={`${styles.framedFigure} ${styles.wideBlock}`}>
      <figcaption className={`${styles.label} ${styles.frameTitle}`}>
        <RiseLine>{title}</RiseLine>
      </figcaption>
      <Panel>
        <Screen image={image} sizes="(min-width: 1024px) 70vw, 100vw" />
      </Panel>
    </figure>
  );
}

export function Quote({ quote }) {
  if (!quote) return null;
  return (
    <blockquote className={styles.quote}>
      <p>“{quote.text}”</p>
      <footer className={styles.caption}>{quote.by}</footer>
    </blockquote>
  );
}

// The previous and next projects in the home page's order, paired before the
// footer: previous on the left, next on the right (mirrored), one large link
// each.
export function AdjacentProjects({ previous, next }) {
  if (!previous && !next) return null;
  const name = (p) => [p.title, p.secondTitle].filter(Boolean).join(" ");
  const half = (p, side) => (
    <Link href={p.href} className={styles.adjacentLink} data-side={side}>
      {/* Below 1024px the halves sit side by side, so the label says the
          direction with chevrons, like "< Drag >" (2026-10-26). */}
      <span className={styles.label}>
        <RiseLine>
          <span className={styles.adjacentLong}>{side === "previous" ? "Previous project" : "Next project"}</span>
          <span className={styles.adjacentShort} aria-hidden="true">
            {side === "previous" ? (
              <>
                <span className="bracket chevron-back">&lt;</span> Previous
              </>
            ) : (
              <>
                Next <span className="bracket chevron-forward">&gt;</span>
              </>
            )}
          </span>
        </RiseLine>
      </span>
      {/* Letters ripple up word by word, like the section titles. */}
      <span className="visually-hidden">{name(p)}</span>
      <span className={`${styles.nextTitle} ${styles.adjacentTitle}`} aria-hidden="true">
        {name(p)
          .split(" ")
          .map((word, i, words) => (
            <RiseLettersScroll key={word} text={word} start={words.slice(0, i).join("").length} />
          ))}
      </span>
      <span className={slide.learnMoreButton}>
        <HoverArrow back={side === "previous"}>
          <ActionLabel>{p.button}</ActionLabel>
        </HoverArrow>
      </span>
    </Link>
  );
  return (
    <nav className={styles.adjacent} aria-label="More projects">
      <div className={styles.adjacentHalf}>{previous && half(previous, "previous")}</div>
      <div className={styles.adjacentHalf}>{next && half(next, "next")}</div>
    </nav>
  );
}

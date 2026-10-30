"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";
import slide from "./Slide.module.css";
import RiseText, { RiseLettersScroll, RiseLine } from "../RiseText";
import HoverArrow from "../HoverArrow";
import ActionLabel from "../ActionLabel";
import Bracketed from "../Bracketed";
import { coverPhotoProps } from "./coverPhoto";
import { mediaCursorLabel } from "@/content/projects";

export const projectName = (p) => [p.title, p.secondTitle].filter(Boolean).join(" ").replace(/\u00A0/g, " ");

// Hierarchy: title -> lead (what it is) -> spec table -> action.
// The spec table works like a drawing title block: fixed label column, one
// value per line. Bullets ("- ") and trailing colons in the data are
// presentation, so they are dropped here; the copy itself is unchanged.
const cleanLabel = (s) => s.replace(/:\s*$/, "");
// "Involvement (Team)" -> "Involvement" with "(Team)" on its own line.
const labelLines = (s) => {
  const [, main, note] = cleanLabel(s).match(/^(.*?)\s*(\(.*\))?$/);
  return note ? [main, note] : [main];
};
const listItems = (s) => s.split("\n").map((line) => line.replace(/^-\s*/, ""));
export default function ProjectSlide({ project, flightTarget = false }) {
  const ref = useRef(null);
  const { slug, title, secondTitle, description, href, button, media } = project;
  const [type, ...details] = description;
  const lead = media[0];
  const name = projectName(project);
  const titleId = `project-${slug}-title`;

  return (
    <article
      ref={ref}
      id={`project-${slug}`}
      data-slide={slug}
      data-snap="start"
      className={slide.slide}
      aria-labelledby={titleId}
    >
      <div
        className={slide.media}
        data-vt={`media-${slug}`}
        data-vt-class="media"
        data-flight-target={flightTarget || undefined}
        data-parallax=""
        data-parallax-reveal=""
        // Per-cover framing (2026-10-19): a narrower parallax range, so a
        // subject high in the photo rests nearer the middle of the frame.
        data-parallax-from={lead.parallax?.[0]}
        data-parallax-to={lead.parallax?.[1]}
      >
        <div className={slide.parallaxImage} data-parallax-image="">
          <Image src={lead.src} alt={lead.alt} // The photo is drawn wider than its frame (it covers a box 130% of the
          // frame's height, then zoomed): at 2560px it renders ~1270px wide,
          // half the window, so ask for that, at a high quality (2026-10-20).
          sizes="(min-width: 1024px) 55vw, 150vw" quality={90} data-vt-photo={`photo-${slug}`} {...coverPhotoProps(lead, lead.list)} />
        </div>
        {/* The whole image opens the project. Mouse shortcut only: keyboard and
            screen-reader users get the same destination from the CTA below. */}
        {href && (
          <Link
            href={href}
            className={slide.mediaLink}
            tabIndex={-1}
            aria-hidden="true"
            data-cursor-label={mediaCursorLabel}
          />
        )}
      </div>

      <div className={slide.left}>
        <h3
          id={titleId}
          className={slide.title}
          data-vt={`title-${slug}`}
          data-vt-class="title"
          tabIndex={-1}
          aria-label={name}
        >
          <RiseLettersScroll text={title} />
          {secondTitle && <RiseLettersScroll text={secondTitle} start={2} />}
        </h3>

        {/* Lead: what the project is (the "Project type" copy), wrapped naturally. */}
        <p className={slide.lead}>
          <span className="visually-hidden">{cleanLabel(type.header)}: </span>
          <RiseText text={type.body.replaceAll("\n", " ")} />
        </p>

        <dl className={slide.spec}>
          {details.map((d) => (
            <div key={d.header} className={slide.specRow}>
              <dt className={slide.specLabel} data-trigger="">
                {labelLines(d.header).map((line) => (
                  <RiseLine key={line}>{line}</RiseLine>
                ))}
              </dt>
              <dd className={slide.specValue} data-trigger="">
                <ul>
                  {listItems(d.body).map((item) => (
                    <li key={item}>
                      <RiseText text={item} />
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>

        <div>
          {href ? (
            <Link href={href} className={classNames(slide.learnMoreButton, "touch-target")} aria-label={`${button}: ${name}`}>
              <HoverArrow>
                <RiseLine>
                  <ActionLabel>{button}</ActionLabel>
                </RiseLine>
              </HoverArrow>
            </Link>
          ) : (
            <RiseLine>
              <span className={classNames(slide.learnMoreButton, slide.disabledButton)}>
                <Bracketed>{button}</Bracketed>
              </span>
            </RiseLine>
          )}
        </div>
      </div>
    </article>
  );
}

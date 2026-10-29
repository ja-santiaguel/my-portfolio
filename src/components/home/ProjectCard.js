import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";
import styles from "./ProjectCard.module.css";
import { projectName } from "./ProjectSlide";
import { mediaCursorLabel } from "@/content/projects";
import { coverPhotoProps } from "./coverPhoto";
import CategoryIcon, { CATEGORIES } from "../CategoryIcon";

// Bento tile for the grid view: the visual leads; the only text is the
// project's category icon and name in a corner tab. The tile goes straight to
// the case study; a project without one opens its details in the list view.
export default function ProjectCard({ project, onOpen, index = 0, flightTarget = false, featured = false }) {
  const { slug, href, media, category, title, secondTitle } = project;
  const lead = media[0];
  const name = projectName(project);
  const categoryLabel = CATEGORIES[category]?.label;

  const tab = (
    <span className={styles.tab} data-vt={`title-${slug}`} data-vt-class="title" data-trigger="1" style={{ "--i": index }}>
      <CategoryIcon category={category} className={styles.icon} />
      {categoryLabel && <span className="visually-hidden">{categoryLabel}: </span>}
      {/* Two-word names break onto two lines only when the tile is narrow
          (container query), so the label still hugs its text. */}
      <span className={styles.name}>
        {title}
        {secondTitle && (
          <>
            {" "}
            <span className={styles.nameLine}>{secondTitle}</span>
          </>
        )}
      </span>
    </span>
  );

  return (
    <article className={classNames(styles.tile, { [styles.featured]: featured })} data-card={slug} data-flight-tile={flightTarget || undefined}>
      <div
        className={styles.media}
        data-vt={`media-${slug}`}
        data-vt-class="media"
        data-flight-target={flightTarget || undefined}
        data-parallax=""
      >
        <div className={styles.parallaxImage} data-parallax-image="">
          <Image
            src={lead.src}
            alt=""
            // Drawn past the cell (zoomed, 130% tall box): ask for room (2026-10-20).
            sizes={featured ? "(min-width: 1024px) 60vw, 130vw" : "(min-width: 1024px) 35vw, 70vw"}
            quality={90}
            data-vt-photo={`photo-${slug}`}
            {...coverPhotoProps(lead, lead.grid)}
          />
        </div>
      </div>
      <h3 className={styles.heading}>
        {href ? (
          <Link href={href} className={styles.open} data-cursor-label={mediaCursorLabel}>
            {tab}
          </Link>
        ) : (
          <button
            type="button"
            className={styles.open}
            onClick={() => onOpen(slug)}
            aria-label={`${categoryLabel ? `${categoryLabel}: ` : ""}${name}, show details`}
            data-cursor-label={mediaCursorLabel}
          >
            {tab}
          </button>
        )}
      </h3>
    </article>
  );
}

import Image from "next/image";
import Link from "next/link";
import { availability, profile, projects, toolkit } from "@/content/projects";
import { about } from "@/content/about";
import SmoothScroll from "@/components/home/SmoothScroll";
import ContactSection from "@/components/home/ContactSection";
import Reveal from "@/components/case-study/Reveal";
import RevealSection from "@/components/case-study/RevealSection";
import { Statements } from "@/components/case-study/CaseStudy";
import { RiseLetters } from "@/components/home/Rise";
import RiseText, { RiseLine } from "@/components/RiseText";
import HoverArrow from "@/components/HoverArrow";
import Bracketed from "@/components/Bracketed";
import ActionLabel from "@/components/ActionLabel";
import cs from "@/components/case-study/CaseStudy.module.css";
import slide from "@/components/home/Slide.module.css";
import services from "@/components/home/ServicesSection.module.css";
import styles from "./styles.module.css";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "/about",
  title: "About | Jonathan Andrew",
  description:
    "Jonathan Andrew Santiaguel is a UX/UI designer and frontend developer in Greater Vancouver: his path from architecture and the kitchen to digital design, his background and his toolkit.",
});

const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
const projectName = (p) => [p.title, p.secondTitle].filter(Boolean).join(" ");

// About (redesigned 2026-10-27). The case studies' language, so it reads as
// part of the same set: a title block first (title, lead, facts and the
// resume beside a tall portrait, the page's one signature moment as it
// clip-opens on load), then ruled sections on columns 2-7 whose titles'
// letters rise and whose lines rise in on trigger, then the ink footer.
export default function AboutPage() {
  const { path, why, background } = about;
  const facts = about.facts;

  return (
    <main>
      <SmoothScroll />

      {/* On screen at load: the title's letters, then the text line by line,
          the facts' rules drawing in under them. */}
      <Reveal as="header" className={styles.header}>
        <h1 className={`${cs.title} ${styles.title}`} aria-label="About me">
          <RiseLetters text="ABOUT" base={0} />
          <RiseLetters text="ME" base={0.15} />
        </h1>

        <div className={styles.details}>
          <p className={`${cs.lead} ${styles.lead}`}>
            <RiseText text={about.lead} mode="load" delay={0.5} />
          </p>

          <dl className={styles.spec}>
            {facts.map((row, i) => (
              <div key={row.label} className={styles.specRow} style={{ "--i": i }}>
                <dt className={`${cs.label} ${styles.specLabel}`}>
                  <RiseLine mode="load" delay={0.62 + i * 0.05}>
                    {row.label}
                  </RiseLine>
                </dt>
                <dd className={styles.specValue}>
                  {row.items.map((item, k) => (
                    <RiseText key={item} as="span" text={item} mode="load" delay={0.64 + i * 0.05 + k * 0.03} className={styles.specLine} />
                  ))}
                </dd>
              </div>
            ))}
            {/* Availability, kept current in projects.js, as in Services. */}
            <div className={styles.specRow} style={{ "--i": facts.length }}>
              <dt className={`${cs.label} ${styles.specLabel}`}>
                <RiseLine mode="load" delay={0.62 + facts.length * 0.05}>
                  Status
                </RiseLine>
              </dt>
              <dd className={styles.specValue}>
                <span className={services.availability} data-status={availability.status} style={{ "--delay": `${0.64 + facts.length * 0.05}s` }}>
                  <span className={services.dot} aria-hidden="true" />
                  <RiseLine mode="load" delay={0.64 + facts.length * 0.05}>
                    {availability.label}
                  </RiseLine>
                </span>
              </dd>
            </div>
          </dl>

          <a className={`${slide.learnMoreButton} ${styles.resume} touch-target`} href={profile.resume} target="_blank" rel="noopener noreferrer" aria-label="View resume (PDF, opens in a new tab)">
            <HoverArrow>
              <RiseLine mode="load" delay={0.9}>
                <ActionLabel>[ View resume ]</ActionLabel>
              </RiseLine>
            </HoverArrow>
          </a>
        </div>

        <figure className={styles.portrait}>
          <Image
            src={about.portrait.src}
            width={about.portrait.width}
            height={about.portrait.height}
            alt={about.portrait.alt}
            sizes="(max-width: 1023px) 100vw, 34vw"
            className={styles.portraitImage}
          />
        </figure>
      </Reveal>

      <div className={cs.layout}>
        <div className={cs.content}>
          <RevealSection id="path" title={path.title}>
            <p className={`${cs.lead} ${styles.sectionLead}`}>
              <RiseText text={path.lead} />
            </p>
            {/* A real sequence, so numbered. */}
            <ol className={`${cs.trio} ${cs.wideBlock} ${styles.steps}`}>
              {path.steps.map((step, i) => (
                <li key={step.title} className={styles.step}>
                  <span className={styles.stepNo}>
                    <RiseLine>
                      <Bracketed>{`[ ${i + 1} ]`}</Bracketed>
                    </RiseLine>
                  </span>
                  <h3 className={cs.heading}>
                    <RiseText text={step.title} />
                  </h3>
                  <p className={cs.trioText}>
                    <RiseText text={step.text} />
                  </p>
                </li>
              ))}
            </ol>
          </RevealSection>

          <RevealSection id="why" title={why.title}>
            <Statements lines={why.statements} />
            <div className={styles.afterStatements}>
              {why.text.map((text) => (
                <p key={text} className={cs.prose}>
                  <RiseText text={text} />
                </p>
              ))}
            </div>
          </RevealSection>

          <RevealSection id="background" title={background.title}>
            <ol className={`${styles.rows} ${cs.wideBlock}`}>
              {background.items.map((item) => {
                const p = item.project && bySlug[item.project];
                return (
                  <li key={item.when + (item.project || item.name)} className={styles.row} data-trigger="">
                    <span className={styles.when}>
                      <RiseLine trim="start">{item.when}</RiseLine>
                    </span>
                    <h3 className={styles.what}>
                      <RiseLine trim="start">{p ? projectName(p) : item.name}</RiseLine>
                    </h3>
                    <p className={styles.detail}>
                      <RiseText text={item.detail} trim />
                    </p>
                    {p?.href && (
                      <Link href={p.href} className={`${slide.learnMoreButton} ${styles.rowLink} touch-target`} aria-label={`${p.button.replace(/[[\]]/g, "").trim()}: ${projectName(p)}`}>
                        <HoverArrow>
                          <RiseLine trim="start">
                            <ActionLabel>{p.button}</ActionLabel>
                          </RiseLine>
                        </HoverArrow>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </RevealSection>

          <RevealSection id="toolkit" title={about.toolkit.title}>
            <dl className={`${styles.rows} ${cs.wideBlock}`}>
              {[about.toolkit.practice, ...toolkit].map((group) => (
                <div key={group.name} className={styles.row} data-trigger="">
                  <dt className={styles.when}>
                    <RiseLine trim="start">{group.name}</RiseLine>
                  </dt>
                  <dd className={styles.tools}>
                    <RiseText text={group.items.join(", ")} trim />
                  </dd>
                </div>
              ))}
            </dl>
          </RevealSection>
        </div>
      </div>

      <ContactSection profile={profile} />
    </main>
  );
}

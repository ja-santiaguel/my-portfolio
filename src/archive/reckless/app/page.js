import { profile, projects } from "@/content/projects";
import { reckless as study } from "@/content/case-studies/reckless";
import SmoothScroll from "@/components/home/SmoothScroll";
import ContactSection from "@/components/home/ContactSection";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import ScreenParallax from "@/components/case-study/ScreenParallax";
import { Summary, Section, Showcase, ShowcaseFigure, TextPair, AdjacentProjects } from "@/components/case-study/CaseStudy";
import styles from "@/components/case-study/CaseStudy.module.css";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "/projects/reckless",
  title: "Reckless | Jonathan Andrew",
  description:
    "An experimental graphic design project that explores different digital design techniques, pushing my personal creative boundaries to practice composition, typography, and visual design.",
});

// The previous and next projects in the home page's order (wrapping round).
const adjacent = () => {
  const i = projects.findIndex((p) => p.slug === study.slug);
  const after = [...projects.slice(i + 1), ...projects.slice(0, i)].filter((p) => p.href);
  return { previous: after[after.length - 1] ?? null, next: after[0] ?? null };
};

// A showcase on the case-study layout (2026-10-19), trimmed like Highland
// Ventures: the header, the piece full width, what I did, the lesson, then
// the piece in its settings.
export default function RecklessPage() {
  const { lesson, showcase } = study;
  return (
    <main>
      <SmoothScroll />
      <ScreenParallax />
      <CaseStudyHeader study={study} />

      <div className={styles.heroWrap}>
        <ShowcaseFigure item={study.hero} className={styles.heroFigure} />
      </div>

      <div className={styles.layout}>
        <div id="story" className={styles.content}>
          <Summary items={study.summary} />
          <Section id="lesson" title={lesson.title}>
            <TextPair paragraphs={lesson.paragraphs} />
          </Section>
          <Section id="showcase" title={showcase.title} tone="ink">
            <Showcase items={showcase.items} />
          </Section>
        </div>
      </div>

      <AdjacentProjects {...adjacent()} />
      <ContactSection profile={profile} />
    </main>
  );
}

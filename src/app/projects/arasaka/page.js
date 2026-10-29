import { profile, projects } from "@/content/projects";
import { arasaka as study } from "@/content/case-studies/arasaka";
import SmoothScroll from "@/components/home/SmoothScroll";
import ContactSection from "@/components/home/ContactSection";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import ScreenParallax from "@/components/case-study/ScreenParallax";
import { Summary, Section, Showcase, ShowcaseFigure, TextPair, AdjacentProjects } from "@/components/case-study/CaseStudy";
import styles from "@/components/case-study/CaseStudy.module.css";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "/projects/arasaka",
  title: "Arasaka Estate | Jonathan Andrew",
  description: "A conceptual magazine cover meant to reel the viewer into the powerhouse that is the ARASAKA ESTATE.",
});

// The previous and next projects in the home page's order (wrapping round).
const adjacent = () => {
  const i = projects.findIndex((p) => p.slug === study.slug);
  const after = [...projects.slice(i + 1), ...projects.slice(0, i)].filter((p) => p.href);
  return { previous: after[after.length - 1] ?? null, next: after[0] ?? null };
};

// A showcase on the case-study layout (2026-10-19), trimmed like Highland
// Ventures: the header, the piece full width, the story in short, the
// approach, then the piece in its setting.
export default function ArasakaPage() {
  const { approach, showcase } = study;
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
          <Section id="approach" title={approach.title}>
            <TextPair paragraphs={approach.paragraphs} />
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

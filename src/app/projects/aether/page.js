import { profile, projects } from "@/content/projects";
import { aether as study } from "@/content/case-studies/aether";
import SmoothScroll from "@/components/home/SmoothScroll";
import ContactSection from "@/components/home/ContactSection";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import CaseStudyContents from "@/components/case-study/CaseStudyContents";
import ScreenParallax from "@/components/case-study/ScreenParallax";
import PhotoShowcase from "@/components/case-study/PhotoShowcase";
import {
  Summary,
  Section,
  Facts,
  Statements,
  Decisions,
  Steps,
  Showcase,
  Lessons,
  AdjacentProjects,
} from "@/components/case-study/CaseStudy";
import styles from "@/components/case-study/CaseStudy.module.css";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "/projects/aether",
  title: "Aether case study | Jonathan Andrew",
  description:
    "AETHER is a mobile application designed to ease the burden of form-filling for caregivers by streamlining complex documentation into an intuitive and efficient experience.",
});

// The previous and next projects in the home page's order (wrapping round).
const adjacent = () => {
  const i = projects.findIndex((p) => p.slug === study.slug);
  const after = [...projects.slice(i + 1), ...projects.slice(0, i)].filter((p) => p.href);
  return { previous: after[after.length - 1] ?? null, next: after[0] ?? null };
};

// AETHER on the General Roofing structure (2026-10-19): the product full
// width, in short, the problem in two numbers, a key decision for each
// research finding, the process on the sticky stage, what I learned, then
// the final design.
export default function AetherPage() {
  const { context, decisions, process, lessons, showcase } = study;
  const sections = [
    { id: "context", title: context.title },
    { id: "decisions", title: decisions.title },
    { id: "process", title: process.title },
    { id: "lessons", title: lessons.title },
    { id: "showcase", title: showcase.title },
  ];

  return (
    <main>
      <SmoothScroll />
      <ScreenParallax />
      <CaseStudyHeader study={study} />

      <PhotoShowcase scene={study.scene} />

      <div className={styles.layout}>
        <CaseStudyContents sections={sections} />

        <div id="story" className={styles.content}>
          <Summary items={study.summary} />

          <Section id="context" title={context.title}>
            <Statements lines={context.statements} mode="scroll" />
            <Facts items={context.facts} />
          </Section>

          <Section id="decisions" title={decisions.title}>
            <Decisions items={decisions.items} />
          </Section>

          <Section id="process" title={process.title}>
            <Steps steps={process.steps} />
          </Section>

          <Section id="lessons" title={lessons.title}>
            <Lessons items={lessons.items} />
          </Section>

          {/* Last: the finished product, after the thinking. */}
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

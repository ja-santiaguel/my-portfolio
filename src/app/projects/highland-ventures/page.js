import { profile, projects } from "@/content/projects";
import { highlandVentures as study } from "@/content/case-studies/highland-ventures";
import SmoothScroll from "@/components/home/SmoothScroll";
import ContactSection from "@/components/home/ContactSection";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import ScreenParallax from "@/components/case-study/ScreenParallax";
import PhotoShowcase from "@/components/case-study/PhotoShowcase";
import { Summary, Section, Showcase, AdjacentProjects } from "@/components/case-study/CaseStudy";
import styles from "@/components/case-study/CaseStudy.module.css";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  path: "/projects/highland-ventures",
  title: "Highland Ventures | Jonathan Andrew",
  description:
    "A small, modern website Jonathan Andrew designed in Figma and built in Webflow for a new venture capital group.",
});

// The previous and next projects in the home page's order (wrapping round).
const adjacent = () => {
  const i = projects.findIndex((p) => p.slug === study.slug);
  const after = [...projects.slice(i + 1), ...projects.slice(0, i)].filter((p) => p.href);
  return { previous: after[after.length - 1] ?? null, next: after[0] ?? null };
};

// A showcase: the General Roofing building blocks, trimmed to what a smaller
// project needs: the header, the product full width, the whole story in
// three lines, then the rest of the site in mockups.
export default function HighlandVenturesPage() {
  const { showcase } = study;
  return (
    <main>
      <SmoothScroll />
      <ScreenParallax />
      <CaseStudyHeader study={study} />

      <PhotoShowcase scene={study.scene} />

      <div className={styles.layout}>
        <div id="story" className={styles.content}>
          <Summary items={study.summary} />
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

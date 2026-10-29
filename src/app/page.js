import { availability, profile, projects, services } from "@/content/projects";
import HeroStage from "@/components/home/HeroStage";
import WorkSection from "@/components/home/WorkSection";
import ServicesSection from "@/components/home/ServicesSection";
import ContactSection from "@/components/home/ContactSection";
import SmoothScroll from "@/components/home/SmoothScroll";

export default function Home() {
  return (
    <main>
      <SmoothScroll />
      <HeroStage profile={profile} projects={projects} />
      <WorkSection projects={projects} />
      <ServicesSection services={services} projects={projects} availability={availability} email={profile.email} />
      <ContactSection profile={profile} />
    </main>
  );
}

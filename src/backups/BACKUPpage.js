"use client";

// Imports
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
// Components
import HeroSection from "@/components/HeroSection";

export default function Home() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();
    })();
  }, []);

  return (
    <main className={styles.main}>
      <HeroSection />

    </main>
  );
}

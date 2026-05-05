"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import classNames from "classnames";
import gsap from "gsap";
import LocomotiveScroll from "locomotive-scroll";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { CiLinkedin, CiMail, CiInstagram } from "react-icons/ci";

gsap.registerPlugin(ScrollTrigger);

export default function AboutMePage() {
  const router = useRouter();
  const headerRef = useRef(null);
  const scrollRef = useRef(null);
  const imageRef = useRef(null);

  const headerTexts = [
    "",
    "About Me",
    "Interested in creating a digital experience?",
  ];

  useLayoutEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
    });

    const sections = document.querySelectorAll(`.${styles.container}`);
    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        end: "bottom 75%",
        onEnter: () => updateHeader(index),
        onLeaveBack: () => updateHeader(index - 1),
        // markers: true,
      });
    });

    function updateHeader(index) {
      const header = headerRef.current;
      if (!header) return;
      if (index < 0) {
        gsap.to(header, { opacity: 0, duration: 0.25 });
      } else {
        gsap.to(header, {
          opacity: 0,
          duration: 0.25,
          onComplete: () => {
            header.textContent = headerTexts[index];
            gsap.to(header, { opacity: 1, duration: 0.5 });
          },
        });
      }
    }

    updateHeader(0);

    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });

    sections.forEach((section) => resizeObserver.observe(section));

    // Clip path animation for the image
    gsap.fromTo(
      imageRef.current,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power2.out" }
    );

    return () => {
      resizeObserver.disconnect();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main className={classNames(styles.main, "relative w-full")}>
      <section
        className={classNames(
          "fixed w-full grid grid-cols-8 px-16",
          styles.sectionHeaderContainer
        )}
      >
        <div
          ref={headerRef}
          className={classNames(
            "w-full bottom-0 mb-7 col-start-2 col-span-6 self-end",
            styles.sectionHeader
          )}
        ></div>
      </section>

      {/* Header */}
      <section
        className={classNames(
          styles.container,
          "w-full grid grid-cols-8 px-16"
        )}
      >
        <h1
          className={classNames(
            "col-start-2 col-span-3 self-end",
            styles.projectTitle
          )}
        >
          Hello, I'm Jonathan Andrew Santiaguel
        </h1>
        <div className="col-start-5 col-span-3">
          <Image
            ref={imageRef}
            src="/images/portrait_02.png"
            alt="Photo of myself, Jonathan Andrew Santiaguel"
            width={1440}
            height={1080}
            className={styles.image}
          />
        </div>
      </section>

      {/* Showcase */}
      <section
        className={classNames(
          styles.container,
          "w-full grid grid-cols-8 px-16 gap-y-16 py-16"
        )}
      >
        <div className="col-start-2 col-span-6 grid grid-cols-6 gap-y-16">
          <div className="col-start-1 col-span-4 pr-4">
            <h4 className={styles.descriptionHeader}>My Story</h4>
            <div className="flex flex-col">
              <p className={styles.descriptionBody}>
                An Architecture student, turned Junior Sous Chef, turned Digital Designer—life has
                taken me on a journey of exploration and self-discovery, leading
                me to where I am today. As a believer in crafting your own
                destiny, I have always been driven by the desire to create and
                inspire. This passion has led me to pursue a career in Digital
                Design, where I can express my creativity and connect with
                others through my work.
              </p>
              <p className={styles.descriptionBody}>
                Beyond design, I am an avid water drinker, technology
                enthusiast, and a well-proficient digital strategist in
                interactive entertainment (video games). Alongside gaming, I am
                also an advocate for mental health awareness, physical fitness,
                and music therapy. Personally, nothing beats whipping up a strawberry
                rhubarb crumble on a Sunday afternoon listening to old school
                R&B.
              </p>
            </div>
          </div>
          <div className="col-start-3 col-span-4 pr-4">
            <h4 className={styles.descriptionHeader}>Why I Design</h4>
            <div className="flex flex-col">
              <p className={styles.descriptionBody}>
                Having spent my lifetime accustom to technology, I am constantly
                connected to digital and visual interactions. Whether it be
                through film, visual design, or interactive
                experiences, I have always been fascinated by the power of
                design to evoke emotions and inspire action.
              </p>
              <p className={styles.descriptionBody}>
                My design philosophy is centered around the belief that good
                design shouldn't just be seen—it should also be felt. So, as a
                designer, I strive to create work that not only looks beautiful
                but also resonates and reaches an audience on a deeper level.
              </p>
              <p className={classNames("italic", styles.descriptionBody)}>
                Moving forward, I am excited to continue my journey in the world
                of Digital Design, where I can push my boundaries of creativity
                and create meaningful experiences that inspire and connect with
                others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Last */}
      <section
        className={classNames(
          styles.container,
          "w-full grid grid-cols-8 px-16 py-16"
        )}
      >
        <div className="col-start-2 col-span-6 grid grid-cols-6 gap-y-16">
          <div className="col-start-1 col-span-2 pr-4">
            <h4 className={classNames("", styles.descriptionHeader)}>
              Jonathan Andrew
            </h4>
            <p className={classNames("", styles.descriptionBody)}>
              Design to express, connect, and inspire.
            </p>
          </div>
          <div className="col-start-3 col-span-2 flex items-center"></div>
          <div className="col-start-5 col-span-2 flex flex-col items-end">
            <h4 className={classNames("text-right", styles.descriptionHeader)}>
              Get in touch
            </h4>
            <div className="flex flex-row gap-x-4">
              <CiMail className="w-6 h-6 opacity-20" />
              <a
                href="https://www.linkedin.com/in/jonathan-andrew-santiaguel/"
                target="_blank"
                rel="noreferrer"
              >
                <CiLinkedin className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/jasantiaguel/"
                target="_blank"
                rel="noreferrer"
              >
                <CiInstagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
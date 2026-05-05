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

export default function ArasakaPage() {
  const router = useRouter();
  const headerRef = useRef(null);
  const scrollRef = useRef(null);

  const headerTexts = [
    "",
    "Showcase",
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
          "w-full grid grid-cols-8 px-16 py-16"
        )}
      >
        <div className="col-start-1">
          <button
            onClick={() => router.push("/")}
            className={styles.backButton}
          >
            ← Go back
          </button>
        </div>
          <h1
            className={classNames(
              "col-start-2 col-span-6",
              styles.projectTitle
            )}
          >
            Reckless
          </h1>
        <div
          className={classNames(
            "col-start-2 col-span-6 grid grid-cols-6",
            styles.titleDescContainer
          )}
        >
          <div className="col-start-1 col-span-3 pr-4">
            <h4 className={styles.descriptionHeader}>Involvement (Solo)</h4>
            <div className="flex flex-col">
              <p className={styles.descriptionBody}>
                <span className="font-extrabold">Art Direction & Concept:</span>{" "}
                Experimented with various compositions, color schemes, and
                typography to practice expressing meaningful narratives through
                design.
              </p>
              <p className={styles.descriptionBody}>
                <span className="font-extrabold">Graphical Editing:</span>{" "}
                Explored various techniques to create a visual narrative
                surrounding the word RECKLESS.
              </p>
            </div>
          </div>
          <div className="col-start-4 col-span-3 pr-4">
            <h4 className={styles.descriptionHeader}>Overview</h4>
            <div className="flex flex-col">
              <p className={styles.descriptionBody}>
                An experimental graphic design project that explores different
                digital design techniques, pushing my personal creative
                boundaries to practice composition, typography, and visual
                design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section
        className={classNames(
          styles.container,
          "w-full grid grid-cols-8 px-16 gap-y-16 py-16"
        )}
      >
        <div className="col-start-1 col-span-5 p-4">
          <Image
            src="/images/mockups/reckless/poster_mockup_04.png"
            alt="Wall mounted Mockup Poster of RECKLESS graphic design"
            width={1920}
            height={1080}
            className={styles.image}
          />
        </div>
        <div className="col-start-4 col-span-5 p-4">
          <Image
            src="/images/mockups/reckless/poster_mockup_03.png"
            alt="Hung Mockup Poster of RECKLESS graphic design"
            width={1920}
            height={1080}
            className={styles.image}
          />
        </div>
        <div className="col-start-2 col-span-6 grid grid-cols-6">
          <div className="col-start-1 col-span-3 pr-4">
            <h4 className={styles.descriptionHeader}>A Lesson</h4>
            <div className="flex flex-col">
              <p className={styles.descriptionBody}>
                This project was a personal challenge adhering to specific
                editing techniques, pushing my creative boundaries to express a
                word through design. While the primary focus of this work was
                meant as a creative practice, this project pushed me
                to recognize the importance of intentional expression in design.
              </p>
              <p className={styles.descriptionBody}>
                Moving forward, this project serves as a reminder for myself, to
                build a stronger conceptual foundation that guides my design
                decisions towards clearer purpose and impact.
              </p>
            </div>
          </div>
          <div className="col-start-5 col-span-1">
            <h4 className={classNames("", styles.descriptionHeader)}>
              Tools Used:
            </h4>
            <div className="flex flex-col">
              <p className={styles.descriptionBody}>
                - Adobe Photoshop 2024
                <br />- Adobe Illustrator 2024
              </p>
            </div>
          </div>
          <div className="col-start-6 col-span-1">
            <h4 className={classNames("text-right", styles.descriptionHeader)}>
              Timeline:
            </h4>
            <div className="flex flex-col text-right">
              <p className={styles.descriptionBody}>—Nov 2024</p>
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

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
          "w-full grid grid-cols-8 px-16"
        )}
      >
        <div className="col-start-1">
          <button
            onClick={() => router.push("/")}
            className={styles.backButton}
          >
            ← Go Back
          </button>
        </div>
          <h1
            className={classNames(
              "col-start-2 col-span-6",
              styles.projectTitle
            )}
          >
            Arasaka<br/>Estate
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
                Developed the visual direction and approach, ensuring the
                magazine cover captured the essence of the ARASAKA Estate within
                Cyberpunk 2077.
              </p>
              <p className={styles.descriptionBody}>
                <span className="font-extrabold">Graphical Editing:</span>{" "}
                Manipulated photos, balanced colors, and refined a composition
                to enhance the cover's visual impact.
              </p>
            </div>
          </div>
          <div className="col-start-4 col-span-3 pr-4">
            <h4 className={styles.descriptionHeader}>Overview</h4>
            <div className="flex flex-col">
              <p className={styles.descriptionBody}>
                A conceptual magazine cover meant to reel the viewer into the
                powerhouse that is the ARASAKA ESTATE. The cover was designed to
                be mysterious, alluring, and captivating, drawing focus towards
                a prominent figure that embodies ARASAKA itself.
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
        <div className="col-start-1 col-span-8 p-4">
          <Image
            src="/images/mockups/arasaka/magazine_mockup_02.png"
            alt="Mockup Magazine Cover of the embodiment of ARASAKA ESTATE"
            width={1920}
            height={1080}
            className={styles.image}
          />
        </div>
        <div className="col-start-2 col-span-6 grid grid-cols-6">
          <div className="col-start-1 col-span-3 pr-4">
            <h4 className={styles.descriptionHeader}>The Approach</h4>
            <div className="flex flex-col">
              <p className={styles.descriptionBody}>
                Rather than showcasing the ARASAKA Estate itself, the cover was
                intentionally designed to display the embodiment of ARASAKA,
                Hanako Arasaka.
              </p>
              <p className={styles.descriptionBody}>
                This choice was made to push the estate's authority and
                mystique, while shifting the emphasis from a traditional
                architectural showcase to a narrative-driven composition. By
                doing so, the viewer experiences the power, exclusivity, and
                controlled presence that defines the ARASAKA legacy.
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
                <br />- Adobe InDesign 2024
              </p>
            </div>
          </div>
          <div className="col-start-6 col-span-1">
            <h4 className={classNames("text-right", styles.descriptionHeader)}>
              Timeline:
            </h4>
            <div className="flex flex-col text-right">
              <p className={styles.descriptionBody}>—Oct 2024</p>
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

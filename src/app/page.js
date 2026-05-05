"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import classNames from "classnames";
import AnimationRiseUp from "../animations/AnimationRiseUp";
import SectionTracker from "@/components/SectionTracker";

gsap.registerPlugin(Observer);

const sections = [
  {
    src: "/images/hover_assets/portrait_01_bg.png",
    foregroundSrc: "/images/hover_assets/portrait_01_fg_crop.png",
    title: "DIGITAL",
    secondTitle: "DESIGN/R",
    description: [
      {
        header: "Jonathan Andrew",
        body: "Design to express, connect, and inspire.",
      },
      { header: "", body: "" },
    ],
  },
  {
    src: "/images/hover_assets/mobile_mockup_02.png",
    // foregroundSrc: "/images/hover_assets/mobile_mockup_02_fg.png",
    title: "AETHER",
    secondTitle: "",
    description: [
      {
        header: "Project Type:",
        body: "Mobile Application helping caregivers simplify\ntheir form-filling processes.",
      },
      {
        header: "Involvement (Team):",
        body: "- Research & Ideation\n- Wireframing & Prototyping\n- UX/UI Design & Development",
      },
      {
        header: "Tools Used:",
        body: "- Figma\n- Visual Studio Code\n- React / Next.js Framework",
      },
      { header: "Timeline:", body: "Sep—Dec 2024" },
      { header: "", body: "", button: true },
    ],
  },
  {
    src: "/images/mockups/arasaka/magazine_mockup_01.png",
    title: "ARASAKA",
    secondTitle: "ESTATE",
    description: [
      {
        header: "Project Type:",
        body: "Magazine Cover for an architectural showcase of\nthe ARASAKA Estate within Cyberpunk 2077.",
      },
      {
        header: "Involvement (Solo):",
        body: "- Art Direction & Concept\n- Graphical Editing",
      },
      {
        header: "Tools Used:",
        body: "- Adobe Photoshop 2024\n- Adobe InDesign 2024",
      },
      { header: "Timeline:", body: "—Oct 2024" },
      { header: "", body: "", button: true },
    ],
  },
  {
    src: "/images/mockups/reckless/poster_mockup_02.png",
    title: "RECKLESS",
    secondTitle: "",
    description: [
      {
        header: "Project Type:",
        body: "Experimental Poster Graphic practicing diverse\nediting techniques.",
      },
      {
        header: "Involvement (Solo):",
        body: "- Art Direction & Concept\n- Graphical Editing",
      },
      {
        header: "Tools Used:",
        body: "- Adobe Photoshop 2024\n- Adobe Illustrator 2024",
      },
      { header: "Timeline:", body: "—Nov 2024" },
      { header: "", body: "", button: true },
    ],
  },
  {
    src: "/images/mockups/sha-tea/soda_mockup_01.png",
    title: "SHA\u00A0TEA",
    secondTitle: "",
    description: [
      {
        header: "Project Type:",
        body: "Product Design for SHA TEA—a deluxe canned tea brand.",
      },
      {
        header: "Involvement (Solo):",
        body: "- Art Direction & Concept\n- Graphical Editing",
      },
      {
        header: "Tools Used:",
        body: "- Adobe Photoshop 2024\n- Adobe Illustrator 2024",
      },
      { header: "Timeline:", body: "—Nov 2024" },
      { header: "", body: "", button: true },
    ],
  },
  {
    src: "",
    title: "Website\u00A0currently",
    secondTitle: "in\u00A0development.",
    description: [
      {
        header: "More content coming soon!",
        body: "Stayed tuned for updates and development.",
      },
    ],
  },
];

const AnimatedText = ({
  text,
  handleClick,
  baseDelay = 0,
  className,
  disablePointerEvents,
}) => {
  return (
    <div
      className={classNames("row", className, {
        "pointer-events-none": disablePointerEvents,
      })}
      onClick={handleClick}
    >
      {text.split("").map((letter, index) => (
        <AnimationRiseUp
          key={`${text}-${index}`}
          className={styles.letter}
          duration={1.4}
          delay={baseDelay + index * 0.05}
        >
          {letter}
        </AnimationRiseUp>
      ))}
    </div>
  );
};

const AnimatedParagraph = ({ text, baseDelay = 0, className }) => {
  return (
    <div className={className}>
      {text.split("\n").map((line, index) => (
        <AnimationRiseUp
          key={`${text}-${index}`}
          className={styles.line}
          duration={1.4}
          delay={baseDelay + index * 0.1}
        >
          {line}
        </AnimationRiseUp>
      ))}
    </div>
  );
};

export default function Home() {
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);

  let animating = false;
  const wrap = gsap.utils.wrap(0, sections.length);

  const [mainText, setMainText] = useState(sections[0].title);
  const [subText, setSubText] = useState(sections[0].secondTitle);
  const [description, setDescription] = useState(sections[0].description);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [descKey, setDescKey] = useState(0);

  const foregroundRefs = useRef([]);

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse X position relative to the element
    const y = e.clientY - rect.top; // Mouse Y position relative to the element
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15; // Adjust tilt intensity
    const rotateY = ((x - centerX) / centerX) * 15; // Positive to tilt towards the cursor

    const foregroundImage = foregroundRefs.current[index];
    if (foregroundImage) {
      foregroundImage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  };

  const resetTilt = (index) => {
    const foregroundImage = foregroundRefs.current[index];
    if (foregroundImage) {
      foregroundImage.style.transform = `rotateX(0deg) rotateY(0deg)`;
    }
  };

  useEffect(() => {
    const observer = Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => !animating && gotoSection(currentIndexRef.current - 1, -1),
      onUp: () => !animating && gotoSection(currentIndexRef.current + 1, 1),
      tolerance: 10,
      preventDefault: true,
    });

    gsap.set(sectionRefs.current[0], {
      clipPath: "inset(0% 0% 0% 0%)",
      zIndex: 2,
    });

    gotoSection(0, 1);
    setIsFirstLoad(false);

    return () => observer.kill();
  }, []);

  function gotoSection(index, direction) {
    index = wrap(index);
    animating = true;
    let fromTop = direction === -1;
    const prevIndex = currentIndexRef.current;

    const tl = gsap.timeline({
      defaults: { duration: 1.6, ease: "power2.out" },
      onComplete: () => {
        animating = false;
      },
    });

    if (prevIndex >= 0 && prevIndex !== index) {
      gsap.set(sectionRefs.current[prevIndex], {
        zIndex: 1,
        clipPath: "inset(0% 0% 0% 0%)",
      });
    }

    gsap.set(sectionRefs.current[index], { zIndex: 2 });

    tl.fromTo(
      sectionRefs.current[index],
      { clipPath: fromTop ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)" }
    );

    if (prevIndex !== index) {
      tl.set(
        sectionRefs.current[prevIndex],
        { clipPath: "inset(100% 0% 0% 0%)" },
        "+=0.2"
      );
    }

    currentIndexRef.current = index;
    setCurrentIndex(index);

    setMainText(sections[index].title);
    setSubText(sections[index].secondTitle);
    setDescription(sections[index].description);
    setDescKey((prevKey) => prevKey + 1);
  }

  const handleMainTextClick = () => {
    if (mainText === "DIGITAL" || mainText === "VISUAL") {
      setMainText(mainText === "DIGITAL" ? "VISUAL" : "DIGITAL");
    }
  };

  const handleSubTextClick = () => {
    if (subText === "DESIGN/R" || subText === "ENTHUSIAST") {
      setSubText(subText === "DESIGN/R" ? "ENTHUSIAST" : "DESIGN/R");
    }
  };

  const handleLearnMoreClick = (title) => {
    let path = "";
    switch (title) {
      case "AETHER":
        path = "/projects/aether";
        break;
      case "RECKLESS":
        path = "/projects/reckless";
        break;
      case "ARASAKA":
        path = "/projects/arasaka";
        break;
      case "SHA\u00A0TEA":
        path = "/projects/sha-tea";
        break;
      default:
        path = "/";
    }
    router.push(path);
  };

  return (
    <>
      <SectionTracker
        sections={sections}
        currentIndex={currentIndex}
        onSectionClick={(index) =>
          gotoSection(index, index > currentIndex ? 1 : -1)
        }
      />
      <main
        ref={containerRef}
        className={classNames(
          styles.main,
          "relative w-full h-screen overflow-hidden"
        )}
      >
        {sections.map((section, index) => (
          <div
            key={index}
            ref={(el) => (sectionRefs.current[index] = el)}
            className={classNames(
              styles.container,
              "absolute top-0 w-full h-full grid-8-column px-16"
            )}
            style={{
              clipPath:
                index === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
            }}
          >
            <div className="col-span-3 col-start-5 flex items-center justify-center">
              {/* {section.src && (
                <Image
                  className={styles.image}
                  src={section.src}
                  alt={`Section ${index + 1}`}
                  width={1000}
                  height={1000}
                />
              )} */}
              {section.src && (
                <div
                  className={styles.imageWrapper}
                  onMouseMove={
                    index === 0 ? (e) => handleMouseMove(e, index) : null
                  } // Apply hover effect only to the first item for now
                  onMouseLeave={index === 0 ? () => resetTilt(index) : null}
                >
                  {/* Background Image */}
                  <Image
                    className={classNames(styles.image, styles.backgroundImage)}
                    src={section.src}
                    alt={`Section ${index + 1} Background`}
                    width={1000}
                    height={1000}
                  />
                  {/* Foreground Image */}
                  {index === 0 && (
                    <Image
                      className={classNames(
                        styles.foregroundImage,
                        `${styles.foregroundImage}${index + 1}`
                      )} // Dynamically add unique class
                      src={section.foregroundSrc || section.src}
                      alt={`Section ${index + 1} Foreground`}
                      width={1000}
                      height={1000}
                      style={{ transform: `rotateX(0deg) rotateY(0deg)` }} // Default transform
                      ref={(el) => (foregroundRefs.current[index] = el)}
                    />
                  )}
                </div>
              )}
            </div>
            <div
              className={classNames(
                styles.leftContainer,
                "absolute top-0 h-full col-span-3 col-start-2 flex flex-grow flex-col justify-center"
              )}
            >
              <div className={styles.descriptionContainer}>
                {description.map((desc, i) => (
                  <div key={`desc-${descKey}-${i}`} className="mb-4">
                    <AnimationRiseUp
                      key={`header-${descKey}-${i}`}
                      className={styles.descriptionHeader}
                      delay={i * 0.1}
                    >
                      <h3>{desc.header}</h3>
                    </AnimationRiseUp>
                    <AnimatedParagraph
                      key={`body-${descKey}-${i}`}
                      className={styles.descriptionBody}
                      text={desc.body}
                      baseDelay={i * 0.1 + 0.05}
                    />
                    {desc.button && (
                      <AnimationRiseUp
                        key={`button-${descKey}-${i}`}
                        className={styles.descriptionButton}
                        delay={i * 0.1 + 0.1}
                      >
                        <button
                          className={classNames(styles.learnMoreButton, {
                            [styles.disabledButton]:
                              section.title !== "AETHER" &&
                              section.title !== "ARASAKA" &&
                              section.title !== "RECKLESS",
                          })}
                          onClick={() => handleLearnMoreClick(section.title)}
                          disabled={
                            section.title !== "AETHER" &&
                            section.title !== "ARASAKA" &&
                            section.title !== "RECKLESS"
                          }
                        >
                          {section.title === "AETHER"
                            ? "[ View case study ]"
                            : section.title === "ARASAKA" ||
                              section.title === "RECKLESS"
                            ? "[ View showcase ]"
                            : "[ Showcase coming soon ]"}
                        </button>
                      </AnimationRiseUp>
                    )}
                  </div>
                ))}
              </div>
              <div
                className={classNames(
                  styles.titleContainer,
                  "absolute bottom-0 mb-7"
                )}
              >
                <AnimatedText
                  text={mainText}
                  handleClick={handleMainTextClick}
                  baseDelay={isFirstLoad ? 0 : 0}
                  className={styles.titleText}
                  disablePointerEvents={
                    mainText !== "DIGITAL" && mainText !== "VISUAL"
                  }
                />
                <AnimatedText
                  text={subText}
                  handleClick={handleSubTextClick}
                  baseDelay={isFirstLoad ? 0.2 : 0.1}
                  className={styles.titleText}
                  disablePointerEvents={
                    subText !== "DESIGN/R" && subText !== "ENTHUSIAST"
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}

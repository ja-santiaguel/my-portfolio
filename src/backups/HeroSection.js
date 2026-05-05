"use client";

// Imports
import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import styles from "./HeroSection.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
// Components
import AnimationRiseUp from "../animations/AnimationRiseUp";
import ImageShowcase from "@/components/ImageShowcase";

gsap.registerPlugin(ScrollTrigger);

const AnimatedText = ({ text, handleClick, baseDelay = 0, className }) => {
  const additionalClass = text !== "VISUAL" ? styles.titleAdjusted : "";
  return (
    <div
      className={classNames("row", className, additionalClass)}
      onClick={handleClick}
    >
      {text.split("").map((letter, index) => (
        <AnimationRiseUp
          key={`${text}-${index}`}
          className={letter === "/" ? styles.slash : styles.letter}
          duration={1.4}
          delay={baseDelay + index * 0.1}
        >
          {letter}
        </AnimationRiseUp>
      ))}
    </div>
  );
};

export default function HeroSection() {
  const imagesRef = useRef([]);
  const scrollRef = useRef(null);

  const [mainText, setMainText] = useState("DIGITAL");
  const [subText, setSubText] = useState("DESIGN/R");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    setIsFirstLoad(false);
  }, []);

  const handleMainTextClick = () => {
    setMainText((prevText) => (prevText === "DIGITAL" ? "VISUAL" : "DIGITAL"));
  };

  const handleSubTextClick = () => {
    setSubText((prevText) =>
      prevText === "DESIGN/R" ? "ENTHUSIAST" : "DESIGN/R"
    );
  };

  useEffect(() => {
    if (imagesRef.current.length === 0) return;

    // Create a timeline for progressive unmasking
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollRef.current, // Scrollable container
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        pin: true,
      },
    });

    imagesRef.current.forEach((image, index) => {
      if (index === 0) {
        // Start the first image fully revealed
        gsap.set(image, { clipPath: "inset(0% 0 0 0)" });
      } else {
        tl.fromTo(
          image,
          { clipPath: "inset(100% 0 0 0)" }, // Start fully masked (hidden)
          { clipPath: "inset(0% 0 0 0)", duration: 1 } // Reveal image (from bottom up)
        );
      }
    });
  }, []);

  return (
    <>
      <div className={classNames("grid-8-column", styles.pageContainer)}>
        <div className={classNames("col-start-1 col-span-full", styles.title)}>
          <div className={classNames("col", styles.descriptionContainer)}>
            <AnimationRiseUp className={styles.descriptionText}>
              DESIGN WITH PURPOSE—
            </AnimationRiseUp>
            <AnimationRiseUp className={styles.descriptionText} delay={0.2}>
              BRIDGING VISUALS WITH MEANING AS A
            </AnimationRiseUp>
          </div>
          <div className={classNames("col", styles.titleText)}>
            <AnimatedText
              text={mainText}
              handleClick={handleMainTextClick}
              className={styles.titleLetter}
            />
            <AnimatedText
              text={subText}
              handleClick={handleSubTextClick}
              baseDelay={isFirstLoad ? 0.8 : 0}
              className={styles.titleLetter}
            />
          </div>
        </div>
      </div>
    </>
  );
}

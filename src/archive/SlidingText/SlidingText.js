"use client";

// Imports
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./SlidingText.module.css";

export default function SlidingText() {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  const sliderContainer = useRef(null);
  const frame = useRef(0);
  let yPercent = 1;
  let direction = -1;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(
      sliderContainer.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        delay: 0.8,
        ease: "sine.out",
      }
    );

    // Continuous motion is skipped for visitors who prefer reduced motion.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) frame.current = requestAnimationFrame(animation);

    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        // markers: true,
        onUpdate: (e) => {
          direction = e.direction * 1;
        },
      },
      y: "-=200px",
    });

    return () => cancelAnimationFrame(frame.current);
  }, []);

  const animation = () => {
    if (yPercent <= -100) {
      yPercent = 0;
    }
    if (yPercent > 0) {
      yPercent = -100;
    }
    gsap.set(firstText.current, { yPercent: yPercent });
    gsap.set(secondText.current, { yPercent: yPercent });
    yPercent += 0.025 * direction;
    frame.current = requestAnimationFrame(animation);
  };

  const TextBlock = ({ barcodeText }) => (
    <>
      DIGITAL &nbsp;&nbsp; DESIGNER &nbsp;&nbsp;&nbsp;//&nbsp;&nbsp;&nbsp;
      JONATHAN &nbsp;&nbsp; ANDREW &nbsp;&nbsp; Y.97
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span className={styles.barcodeText}>{barcodeText}</span>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </>
  );

  return (
    <div ref={sliderContainer} className={styles.sliderContainer} data-chrome>
      <div ref={slider} className={styles.slider}>
        <p ref={firstText}>
          <TextBlock barcodeText="SURPASS YOUR LIMITS" />
          <TextBlock barcodeText="PURSUE GREATNESS" />
        </p>
        <p ref={secondText}>
          <TextBlock barcodeText="SURPASS YOUR LIMITS" />
          <TextBlock barcodeText="PURSUE GREATNESS" />
        </p>
      </div>
    </div>
  );
}

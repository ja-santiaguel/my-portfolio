"use client";

// Imports
import { useState, useEffect } from "react";
import styles from "./BackToTop.module.css";
import classNames from "classnames";
// Components
import AnimationRiseUp from "../animations/AnimationRiseUp";
import { scrollToTarget } from "@/lib/scroll";

// Back-to-top: the fixed bottom-left corner label. A site credit over a
// scroll cue that turns into a "return to top" button once you scroll.
export default function BackToTop() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    scrollToTarget(0);
  };

  return (
    <footer className={styles.backToTop} data-chrome>
      <div className="grid-8-column">
        <div className="col-start-1 col-span-2">
          <ul className={classNames(styles.list, "stacked")}>
            <li>
              <AnimationRiseUp className={styles.text} delay={0.45} duration={0.8}>
                <p className={classNames(styles.credit, "row")}>CA / DEV BY J.A.</p>
              </AnimationRiseUp>
            </li>
            <li>
              <AnimationRiseUp className={styles.text} delay={0.5} duration={0.8}>
                {scrolled ? (
                  <button type="button" className={classNames(styles.topButton, "row")} onClick={handleScrollToTop}>
                    RETURN TO TOP ⬏
                  </button>
                ) : (
                  <p className="row">SCROLL TO EXPLORE ⬎</p>
                )}
              </AnimationRiseUp>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
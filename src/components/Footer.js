"use client";

// Imports
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Footer.module.css";
import classNames from "classnames";
import { MdArrowRightAlt } from "react-icons/md";
// Components
import AnimationRiseUp from "../animations/AnimationRiseUp";

export default function Footer() {
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer}>
      <div className="grid-8-column">
        <div className="col-start-7 col-span-2">
          <ul className={classNames(styles.list, "stacked")}>
            <li>
              <AnimationRiseUp className={styles.footerText} delay={3.3}>
                <p
                  className={classNames(styles.primaryText, "row justify-end")}
                >
                  CA / DEV J.A.
                </p>
              </AnimationRiseUp>
            </li>
            <li>
              <AnimationRiseUp className={styles.footerText} delay={3.4}>
                {scrolled ? (
                  <p
                    className="row justify-end cursor-pointer"
                    onClick={handleScrollToTop}
                  >
                    ⬑ RETURN TO TOP
                  </p>
                ) : (
                  <p className="row justify-end">⬐ SCROLL TO EXPLORE</p>
                )}
              </AnimationRiseUp>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
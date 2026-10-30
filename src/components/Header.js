"use client";

// Imports
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Header.module.css";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { CiMail, CiLinkedin, CiInstagram, CiFileOn } from "react-icons/ci";
import { profile } from "@/content/projects";
// Components
import TimeDate from "./TimeDate";
import AnimationRiseUp from "../animations/AnimationRiseUp";
import HoverArrow from "./HoverArrow";
import Bracketed from "./Bracketed";
import Wordmark from "./Wordmark";
import MobileMenu from "./MobileMenu";
import { scrollToTarget } from "@/lib/scroll";

const EMAIL = "santiaguel.ja@gmail.com";
// Nav is usable immediately; the entrance is a short, quick rise.
const RISE = 0.8;

export default function Header() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const toggleRef = useRef(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // iOS Safari only applies :active (the press effect on brackets and
  // chevrons, globals.css) when the page listens for touches.
  useEffect(() => {
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });
    return () => document.removeEventListener("touchstart", noop);
  }, []);

  // Below 1024px the navbar slides away while scrolling down and comes back
  // on scrolling up, so it never sits over what's being read (CSS applies it
  // only at those widths). Never while the menu is open.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 80);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleHomeClick = (e) => {
    if (pathname === "/") {
      e.preventDefault();
      scrollToTarget(0);
    }
  };

  // "Work" and "Services": on the home page, glide to the section; elsewhere
  // the link goes to /#work or /#services through the page transition.
  const glideTo = (id) => (e) => {
    if (pathname === "/") {
      e.preventDefault();
      scrollToTarget(document.getElementById(id));
    }
  };
  const handleWorkClick = glideTo("work");
  const handleServicesClick = glideTo("services");

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <>
    <header className={styles.header} data-chrome data-hidden={hidden && !menuOpen} data-menu-open={menuOpen}>
      <nav className={classNames("grid-8-column", styles.nav)} aria-label="Main">
        <div className="col-span-1">
          <Link
            href="/"
            onClick={handleHomeClick}
            className={classNames(styles.logo, "row")}
          >
            <AnimationRiseUp className={styles.navText} delay={0.1} duration={RISE}>
              <img
                src="/favicon-dark.svg"
                alt=""
                className={styles.logoIcon}
              />
            </AnimationRiseUp>
            {/* The name as outlines (Wordmark), read out as one name. */}
            <span className="visually-hidden">{profile.name}</span>
            <ul className={classNames(styles.logoWordmark, "stacked")} aria-hidden="true">
              <li className={styles.logoText}>
                <AnimationRiseUp className={styles.navText} delay={0.1} duration={RISE}>
                  <Wordmark word="Jonathan" />
                </AnimationRiseUp>
              </li>
              <li className={styles.logoText}>
                <AnimationRiseUp className={styles.navText} delay={0.15} duration={RISE}>
                  <Wordmark word="Andrew" />
                </AnimationRiseUp>
              </li>
            </ul>
          </Link>
        </div>
        <div className={classNames("col-span-3", styles.time)}>
          <TimeDate />
        </div>
        {/* Work (column 5), Services (6) and About me (7), a column each, in
            the home page's order (2026-10-26: Services joined). */}
        <div className="col-span-3">
          <ul className={styles.navLinks}>
            {/* Each link wraps its rise mask, so its touch area isn't clipped. */}
            <li>
              <Link href="/#work" onClick={handleWorkClick} className={classNames(styles.navLink, styles.navLinkFirst)}>
                <AnimationRiseUp className={styles.navText} delay={0.3} duration={RISE}>
                  <HoverArrow>Work</HoverArrow>
                </AnimationRiseUp>
              </Link>
            </li>
            <li>
              <Link href="/#services" onClick={handleServicesClick} className={styles.navLink}>
                <AnimationRiseUp className={styles.navText} delay={0.33} duration={RISE}>
                  <HoverArrow>Services</HoverArrow>
                </AnimationRiseUp>
              </Link>
            </li>
            <li>
              <Link href="/about" className={classNames(styles.navLink, styles.navLinkSecond)}>
                <AnimationRiseUp className={styles.navText} delay={0.36} duration={RISE}>
                  <HoverArrow>About me</HoverArrow>
                </AnimationRiseUp>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1">
          <ul className={classNames(styles.endList, "stacked")}>
            <li>
              <AnimationRiseUp className={styles.navText} delay={0.35} duration={RISE}>
                <div
                  className={classNames(styles.contactText, "row justify-end")}
                >
                  Get in touch
                </div>
              </AnimationRiseUp>
            </li>
            <li>
              {/* Each icon wraps its own rise mask, so its touch area isn't clipped. */}
              <div className="flex flex-row gap-x-4 justify-end">
                <button
                  type="button"
                  className={classNames(styles.iconButton, styles.iconTarget)}
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                >
                  <AnimationRiseUp className={styles.navText} delay={0.4} duration={RISE}>
                    <CiMail className="w-4 h-4" aria-hidden="true" />
                  </AnimationRiseUp>
                </button>
                {/* The résumé (2026-10-27, Jonathan): the PDF in a new tab. Order:
                    the email and résumé first, then the socials. */}
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Resume (PDF, opens in a new tab)"
                  className={styles.iconTarget}
                >
                  <AnimationRiseUp className={styles.navText} delay={0.42} duration={RISE}>
                    <CiFileOn className="w-4 h-4" aria-hidden="true" />
                  </AnimationRiseUp>
                </a>
                <a
                  href="https://www.linkedin.com/in/jonathan-andrew-santiaguel/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn (opens in a new tab)"
                  className={styles.iconTarget}
                >
                  <AnimationRiseUp className={styles.navText} delay={0.44} duration={RISE}>
                    <CiLinkedin className="w-4 h-4" aria-hidden="true" />
                  </AnimationRiseUp>
                </a>
                <a
                  href="https://www.instagram.com/jasantiaguel/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram (opens in a new tab)"
                  className={styles.iconTarget}
                >
                  <AnimationRiseUp className={styles.navText} delay={0.46} duration={RISE}>
                    <CiInstagram className="w-4 h-4" aria-hidden="true" />
                  </AnimationRiseUp>
                </a>
              </div>
            </li>
            <li aria-live="polite">
              {copied && (
                <div className="flex flex-row gap-x-4 justify-end">
                  <p className={classNames("row justify-end text-end", styles.navText, styles.copiedText)}>
                    Email copied to clipboard!
                  </p>
                </div>
              )}
            </li>
          </ul>
        </div>
        {/* Phones and tablets: one button for the menu. */}
        <div className={styles.menuCell}>
          <button
            ref={toggleRef}
            type="button"
            className={classNames(styles.menuButton, "touch-target")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <AnimationRiseUp className={styles.navText} delay={0.3} duration={RISE}>
              <Bracketed>{menuOpen ? "[ Close ]" : "[ Menu ]"}</Bracketed>
            </AnimationRiseUp>
          </button>
        </div>
      </nav>
    </header>
    <MobileMenu open={menuOpen} onClose={closeMenu} toggleRef={toggleRef} />
    </>
  );
}

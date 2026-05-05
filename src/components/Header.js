"use client";

// Imports
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import classNames from "classnames";
import { useRouter, usePathname } from "next/navigation";
import { MdArrowRightAlt } from "react-icons/md";
import { CiMail, CiLinkedin, CiInstagram } from "react-icons/ci";
// Components
import TimeDate from "./TimeDate";
import AnimationRiseUp from "../animations/AnimationRiseUp";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const handleHomeClick = (e) => {
    if (pathname === "/") {
      e.preventDefault();
      window.location.reload();
    } else {
      router.push("/");
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("santiaguel.ja@gmail.com");
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <header className={styles.header}>
      <nav className="grid-8-column">
        <div className="col-span-1">
          <Link
            href="/"
            onClick={handleHomeClick}
            className={classNames(styles.logo, "row")}
          >
            <AnimationRiseUp className={styles.navText} delay={2.2}>
              <img
                src="/favicon-dark.svg"
                alt="JA Logo Icon"
                className={styles.logoIcon}
              />
            </AnimationRiseUp>
            <ul className={classNames(styles.logoWordmark, "stacked")}>
              <li className={styles.logoText}>
                <AnimationRiseUp className={styles.navText} delay={2.2}>
                  Jonathan
                </AnimationRiseUp>
              </li>
              <li className={styles.logoText}>
                <AnimationRiseUp className={styles.navText} delay={2.3}>
                  Andrew
                </AnimationRiseUp>
              </li>
            </ul>
          </Link>
        </div>
        <div className="col-span-3">
          <TimeDate />
        </div>
        <div className="col-span-2">
          <ul className={classNames(styles.list, "stacked invisible")}>
            <li>
              <AnimationRiseUp className={styles.navText} delay={2.6}>
                <div
                  className="row"
                  style={{ opacity: 0.2, pointerEvents: "none" }}
                >
                  <MdArrowRightAlt className={styles.icon} />
                  Interactive Design
                </div>
              </AnimationRiseUp>
            </li>
            <li>
              <AnimationRiseUp className={styles.navText} delay={2.7}>
                <div
                  className="row"
                  style={{ opacity: 0.2, pointerEvents: "none" }}
                >
                  <MdArrowRightAlt className={styles.icon} />
                  Graphic Design
                </div>
              </AnimationRiseUp>
            </li>
          </ul>
        </div>
        <div className="col-span-1">
          <ul className={classNames(styles.list, "stacked")}>
            <li>
              <AnimationRiseUp className={styles.navText} delay={2.8}>
                <Link href="/about" className="row">
                  <MdArrowRightAlt className={styles.icon} />
                  About me
                </Link>
              </AnimationRiseUp>
            </li>
          </ul>
        </div>
        <div className="col-span-1">
          <ul className={classNames(styles.endList, "stacked")}>
            <li>
              <AnimationRiseUp className={styles.navText} delay={3.0}>
                <div
                  className={classNames(styles.contactText, "row justify-end")}
                >
                  Get in touch
                </div>
              </AnimationRiseUp>
            </li>
            <li>
              <AnimationRiseUp className={styles.navText} delay={3.1}>
                <div className="flex flex-row gap-x-4 justify-end">
                  <CiMail className="w-4 h-4 cursor-pointer" onClick={handleCopyEmail} />
                  <a
                    href="https://www.linkedin.com/in/jonathan-andrew-santiaguel/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <CiLinkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.instagram.com/jasantiaguel/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <CiInstagram className="w-4 h-4" />
                  </a>
                </div>
              </AnimationRiseUp>
            </li>
            {copied && (
              <li>
                <div className="flex flex-row gap-x-4 justify-end">
                  <p className={classNames("row justify-end text-end", styles.navText, styles.copiedText)}>
                  Email copied to clipboard!
                  </p>
                </div>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

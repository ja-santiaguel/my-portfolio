"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/content/projects";
import { getLenis, scrollToTarget } from "@/lib/scroll";
import styles from "./MobileMenu.module.css";

// The phone and tablet menu (below 1024px; 2026-10-16). Opened by the
// navbar's "[ Menu ]" button, which stays on top and becomes "[ Close ]".
// Eight ink columns drop from the top one after another, right to left (it
// opens from the top-right button; 2026-10-26), then the destinations rise in
// at the top right with the site's line entrance. A modal dialog: the page
// behind is inert and can't scroll, Tab stays within the menu and its button,
// Escape closes it, and focus returns to the button. Choosing a link closes
// it (internal links then play the page transition on top).
// "Home" first (2026-10-26, Jonathan: the menu had no way home but the logo).
const LINKS = [
  { href: "/", label: "Home", top: true },
  { href: "/#work", label: "Work", id: "work" },
  { href: "/#services", label: "Services", id: "services" },
  { href: "/about", label: "About me" },
];

export default function MobileMenu({ open, onClose, toggleRef }) {
  const panel = useRef(null);
  const pathname = usePathname();

  // Closing (2026-10-26): the content lifts out first (the entrance
  // reversed), then the columns follow it up; [data-closing] marks that
  // stretch so the exit never plays on opening.
  const [closing, setClosing] = useState(false);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      setClosing(false);
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    setClosing(true);
    const t = setTimeout(() => setClosing(false), 150 + 350 + 7 * 30);
    return () => clearTimeout(t);
  }, [open]);

  // Lock the page, trap focus, close on Escape.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const main = document.querySelector("main");
    html.dataset.menuOpen = "";
    if (main) main.inert = true;
    getLenis()?.stop();

    const focusables = () => [toggleRef.current, ...panel.current.querySelectorAll("a[href], button")].filter(Boolean);
    focusables()[1]?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      const i = list.indexOf(document.activeElement);
      const next = e.shiftKey ? (i <= 0 ? list.length - 1 : i - 1) : i === list.length - 1 ? 0 : i + 1;
      e.preventDefault();
      list[next].focus();
    };
    // Back to desktop width: the menu doesn't exist there.
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => wide.matches && onClose();

    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      delete html.dataset.menuOpen;
      if (main) main.inert = false;
      // A page transition holds the scroll itself; don't restart it mid-way.
      if (!("pageTransition" in html.dataset)) getLenis()?.start();
    };
  }, [open, onClose, toggleRef]);

  // Closed by navigation (e.g. back button).
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const choose = (e, link) => {
    // "Home" on the home page: close, then glide to the top.
    if (link.top && pathname === "/") {
      e.preventDefault();
      onClose();
      requestAnimationFrame(() => scrollToTarget(0));
      return;
    }
    // "Work" or "Services" on the home page: close, then glide to the section.
    if (link.id && pathname === "/") {
      e.preventDefault();
      onClose();
      requestAnimationFrame(() => scrollToTarget(document.getElementById(link.id)));
      return;
    }
    onClose();
  };

  return (
    <div
      ref={panel}
      id="mobile-menu"
      className={styles.menu}
      data-open={open}
      data-closing={closing || undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
    >
      <div className={styles.columns} aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} style={{ "--i": i }} />
        ))}
      </div>

      <nav className={styles.content} aria-label="Menu">
        <ul className={styles.links}>
          {LINKS.map((link, i) => (
            <li key={link.href} className={styles.mask}>
              <Link
                href={link.href}
                className={styles.link}
                style={{ "--i": i }}
                tabIndex={open ? 0 : -1}
                aria-current={!link.id && pathname === link.href ? "page" : undefined}
                onClick={(e) => choose(e, link)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.contact}>
          <p className={`${styles.mask} ${styles.label}`}>
            <span className={styles.rise} style={{ "--i": LINKS.length }}>
              Get in touch
            </span>
          </p>
          <ul className={styles.details}>
            {[
              { href: `mailto:${profile.email}`, label: profile.email },
              { href: profile.resume, label: "Resume ↗", external: "Resume (PDF, opens in a new tab)" },
              { href: profile.linkedin, label: "LinkedIn ↗", external: "LinkedIn (opens in a new tab)" },
              { href: profile.instagram, label: "Instagram ↗", external: "Instagram (opens in a new tab)" },
            ].map((d, i) => (
              <li key={d.href} className={styles.mask}>
                <a
                  href={d.href}
                  className={styles.detail}
                  style={{ "--i": LINKS.length + 0.5 + i * 0.5 }}
                  tabIndex={open ? 0 : -1}
                  {...(d.external ? { target: "_blank", rel: "noopener noreferrer", "aria-label": d.external } : {})}
                >
                  {d.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}

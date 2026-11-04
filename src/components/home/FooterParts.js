"use client";

import { useEffect, useRef, useState } from "react";
import useSerifLetters from "@/lib/useSerifLetters";

// The footer's live part: fitting the question to the margins, and its serif
// letters to its capitals (once fitted: they follow the text's size).

// Text that spans its container exactly (desktop): measures the widest
// [data-fit-line] child (or the text itself) at its CSS size and scales the
// font so it meets both margins. Below 1024px it wraps and keeps its CSS size.
export function FitLine({ as: Tag = "p", className, children, ...rest }) {
  const ref = useRef(null);
  useSerifLetters(ref);

  useEffect(() => {
    const el = ref.current;
    const wide = window.matchMedia("(min-width: 1024px)");
    const fit = () => {
      el.style.fontSize = "";
      if (!wide.matches) return;
      const lines = el.querySelectorAll("[data-fit-line]");
      const parts = lines.length ? [...lines] : [el.lastElementChild];
      const widest = Math.max(...parts.map((n) => n.getBoundingClientRect().width));
      const size = parseFloat(getComputedStyle(el).fontSize);
      el.style.fontSize = `${((size * el.clientWidth) / widest).toFixed(2)}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement);
    wide.addEventListener("change", fit);
    return () => {
      ro.disconnect();
      wide.removeEventListener("change", fit);
    };
  }, []);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

// "[ Let’s talk ]" (2026-11-03, Jonathan: it had "no function"). A mailto link
// only does something where a mail app is set up, so on many computers the
// click looked dead. It still opens the mail app where there is one, and it
// also copies the address and says so ("[ Email copied ]") for a few seconds.
export function MailLink({ email, className, copied: copiedLabel, children }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 3000);
    return () => clearTimeout(timer);
  }, [copied]);

  const onClick = () => {
    navigator.clipboard?.writeText(email).then(
      () => setCopied(true),
      () => {}
    );
  };

  return (
    <>
      <a className={className} href={`mailto:${email}`} onClick={onClick}>
        {copied ? copiedLabel : children}
      </a>
      <span className="visually-hidden" role="status">
        {copied ? `Email address copied: ${email}` : ""}
      </span>
    </>
  );
}

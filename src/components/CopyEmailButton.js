"use client";

import { useEffect, useState } from "react";
import classNames from "classnames";
import { CiMail } from "react-icons/ci";
import { profile } from "@/content/projects";
import styles from "./CopyEmailButton.module.css";

// Mail icon that copies the email address, like the header's (it opens the mail
// app if the clipboard is unavailable). The confirmation hangs below the icon
// row, right-aligned: the parent row must be position: relative.
export default function CopyEmailButton({ className }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 3000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <>
      <button
        type="button"
        className={classNames(styles.button, className)}
        onClick={handleCopy}
        aria-label="Copy email address"
      >
        <CiMail size={16} className={styles.icon} aria-hidden="true" />
      </button>
      <span className={styles.status} role="status">
        {copied && <span className={styles.message}>Email copied to clipboard!</span>}
      </span>
    </>
  );
}

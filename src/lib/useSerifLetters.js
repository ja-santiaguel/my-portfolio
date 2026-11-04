"use client";

import { useEffect } from "react";
import { fitSerifLetters, serifFontsReady } from "./serifLetters";

// Fits the serif letters inside `ref` (lib/serifLetters.js) once the fonts are
// in, and again whenever the text changes size (FitLine, breakpoints, window
// resizes).
export default function useSerifLetters(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ready = false;
    let gone = false;
    const fit = () => ready && !gone && fitSerifLetters(el);
    serifFontsReady().then(() => {
      ready = true;
      fit();
    });
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit);
    return () => {
      gone = true;
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [ref]);
}

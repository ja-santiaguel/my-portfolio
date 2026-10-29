"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import styles from "./CaseStudy.module.css";

// Loaded only on the client, after the page has appeared: the 3D libraries
// never count towards the first load.
const LaptopScene = dynamic(() => import("./LaptopScene"), { ssr: false });

// The pinned 3D showcase. The section is tall; its stage sticks to the
// screen while you scroll through it, and the scroll position (0..1) drives
// the scene. Native scroll is never hijacked: keyboard, scrollbar and
// trackpad keep working, and scrolling back reverses it. Once the motion
// completes, the stage unsticks and the page carries on.
//
// Phones, small windows and reduced motion get a still image instead (no
// pinning, no WebGL).
export default function LaptopShowcase({ poster, label }) {
  const sectionRef = useRef(null);
  const target = useRef(0);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const [mode, setMode] = useState("pending"); // pending | 3d | still

  useEffect(() => {
    const big = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setMode(big.matches && !reduce.matches ? "3d" : "still");
    decide();
    big.addEventListener("change", decide);
    reduce.addEventListener("change", decide);
    return () => {
      big.removeEventListener("change", decide);
      reduce.removeEventListener("change", decide);
    };
  }, []);

  useEffect(() => {
    if (mode !== "3d") return;
    const el = sectionRef.current;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      target.current = Math.min(1, Math.max(0, -r.top / (travel || 1)));
    };
    const onPointer = (e) => {
      pointerTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [mode]);

  if (mode === "still") {
    return (
      <figure className={styles.showcaseStill}>
        <Image src={poster.src} alt={poster.alt} width={poster.width} height={poster.height} sizes="100vw" className={styles.plateImage} />
      </figure>
    );
  }

  return (
    <section ref={sectionRef} className={styles.showcase3d} aria-label={label}>
      <div className={styles.showcaseStage} role="img" aria-label={label}>
        {mode === "3d" && <LaptopScene target={target} pointerTarget={pointerTarget} />}
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { useReveal } from "../home/Rise";

// Plays the <Rise> entrances inside it when it comes into view (its top
// reaches 85% of the viewport), and resets once it is fully off screen.
export default function Reveal({ as: Tag = "div", className, children, ...rest }) {
  const ref = useRef(null);
  const reveal = useReveal(ref);
  return (
    <Tag ref={ref} className={className} data-reveal={reveal} {...rest}>
      {children}
    </Tag>
  );
}

// Imports
import { motion } from "framer-motion";
import classNames from "classnames";
import { springSmooth, springRise, DURATION } from "@/lib/motion";

// The focus-in (2026-10-18): transparent, a third of a line low, softly
// blurred, settling into place (no mask).
const textRiseVariants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(0.1em)" },
  visible: { opacity: 1, y: 0, filter: "blur(0em)" },
};

export default function AnimationRiseUp({
  uniqueKey,
  className,
  duration = DURATION.long / 1000,
  delay = 0,
  ease = springSmooth,
  onClick,
  children,
}) {
  return (
    <div className="masking-container">
      <motion.div
        key={uniqueKey}
        className={classNames(className)}
        initial="hidden"
        animate="visible"
        variants={textRiseVariants}
        transition={{
          // The rise on the overshooting spring; blur and opacity clear early.
          y: { duration, ease: springRise, delay },
          opacity: { duration: DURATION.short / 1000, ease, delay },
          filter: { duration: DURATION.short / 1000, ease, delay },
        }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    </div>
  );
}
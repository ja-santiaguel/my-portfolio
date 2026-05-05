// Imports
import { motion } from "framer-motion";
import classNames from "classnames";

const textRiseVariants = {
  hidden: { y: "160%"},
  visible: { y: 0},
};

export default function AnimationRiseUp({
  uniqueKey,
  className,
  duration = 1.4,
  delay = 0,
  ease = [0.2, 0.8, 0.3, 1],
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
          duration: duration,
          ease: ease,
          delay: delay,
        }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    </div>
  );
}
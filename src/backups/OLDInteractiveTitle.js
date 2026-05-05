"use client";

// Imports
import { useState } from "react";
import { motion } from "framer-motion";
import classNames from "classnames";
import styles from "./InteractiveTitle.module.css";
// Components
import AnimationRiseUp from "../animations/AnimationRiseUp";

const BoldText = ({ children }) => {
  return <span className={styles.boldText}>{children}</span>;
};

export default function InteractiveTitle() {
  const [selectedText, setSelectedText] = useState("INTERACTIVE");

  const handleTextClick = () => {
    setSelectedText((prevText) =>
      prevText === "INTERACTIVE" ? "GRAPHIC" : "INTERACTIVE"
    );
  };

  const textRiseVariants = {
    hidden: { y: "160%", opacity: 1 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className={classNames("grid-8-column", styles.titleContainer)}>
      <div className={classNames("col-start-1 col-span-full", styles.title)}>
        <div className={styles.mainText}>
          {selectedText === "INTERACTIVE" ? (
            <div className="stacked">
              <AnimationRiseUp
                key={`${selectedText}-part1`}
                onClick={handleTextClick}
                className={styles.interactiveText}
                duration={1.8}
              >
                INTER-
              </AnimationRiseUp>
              <AnimationRiseUp
                key={`${selectedText}-part2`}
                onClick={handleTextClick}
                className={styles.interactiveText}
                duration={1.8}
                delay={0.1}
              >
                ACTIVE
              </AnimationRiseUp>
            </div>
          ) : (
            <div className="stacked">
              <AnimationRiseUp
                key={`${selectedText}-part1`}
                onClick={handleTextClick}
                className={styles.graphicText}
                duration={1.8}
              >
                GRA-
              </AnimationRiseUp>
              <AnimationRiseUp
                key={`${selectedText}-part2`}
                onClick={handleTextClick}
                className={styles.graphicText}
                duration={1.8}
                delay={0.1}
              >
                PHIC
              </AnimationRiseUp>
            </div>
          )}
        </div>
        {/* <div className={styles.secondaryText} onClick={handleTextClick}>
          {selectedText === "INTERACTIVE" ? (
            <div className="stacked">
            <AnimationRiseUp
              key={`${selectedText}-part1`}
              onClick={handleTextClick}
              className={styles.graphicSecondaryText}
              duration={1.8}
              delay={0.8}
            >
              GRA-
            </AnimationRiseUp>
            <AnimationRiseUp
              key={`${selectedText}-part2`}
              onClick={handleTextClick}
              className={styles.graphicSecondaryText}
              duration={1.8}
              delay={0.9}
            >
              PHIC
            </AnimationRiseUp>
          </div>
          ) : (
            <div className="stacked">
              <AnimationRiseUp
                key={`${selectedText}-part1`}
                onClick={handleTextClick}
                className={styles.interactiveSecondaryText}
                duration={1.8}
                delay={0.8}
              >
                INTER-
              </AnimationRiseUp>
              <AnimationRiseUp
                key={`${selectedText}-part2`}
                onClick={handleTextClick}
                className={styles.interactiveSecondaryText}
                duration={1.8}
                delay={0.9}
              >
                ACTIVE
              </AnimationRiseUp>
            </div>
          )}
        </div> */}
        <div className={styles.secondaryText} onClick={handleTextClick}>
          {selectedText === "INTERACTIVE" ? (
            <AnimationRiseUp
              key={selectedText}
              className={styles.graphicSecondaryText}
              duration={1.8}
              delay={0.8}
            >
              GRAPHIC
            </AnimationRiseUp>
          ) : (
            <AnimationRiseUp
              key={selectedText}
              className={styles.interactiveSecondaryText}
              duration={1.8}
              delay={0.8}
            >
              INTERACTIVE
            </AnimationRiseUp>
          )}
        </div>
        <div className={classNames(styles.subTextContainer, "row")}>
          <AnimationRiseUp
            key={`${selectedText}-design`}
            className={styles.designText}
            delay={0.2}
            duration={1.6}
          >
            DESIGN
          </AnimationRiseUp>
          {selectedText === "INTERACTIVE" ? (
            <ul className={classNames(styles.list, "stacked")}>
              <li className="masking-container">
                <motion.div
                  key={selectedText}
                  className={styles.descriptionText}
                  initial="hidden"
                  animate="visible"
                  variants={textRiseVariants}
                  transition={{
                    duration: 1.6,
                    ease: [0.1, 0.8, 0.2, 1],
                    delay: 0.6,
                  }}
                >
                  Building <BoldText>innovative</BoldText> and{" "}
                  <BoldText>efficient</BoldText> digital 
                </motion.div>
              </li>
              <li className="masking-container">
                <motion.div
                  key={selectedText}
                  className={styles.descriptionText}
                  initial="hidden"
                  animate="visible"
                  variants={textRiseVariants}
                  transition={{
                    duration: 1.6,
                    ease: [0.1, 0.8, 0.2, 1],
                    delay: 0.7,
                  }}
                >
                  experiences that leave a <BoldText>memorable</BoldText> impact.
                </motion.div>
              </li>
            </ul>
          ) : (
            <ul className={classNames(styles.list, "stacked")}>
              <li className="masking-container">
                <motion.div
                  key={selectedText}
                  className={styles.descriptionText}
                  initial="hidden"
                  animate="visible"
                  variants={textRiseVariants}
                  transition={{
                    duration: 1.6,
                    ease: [0.1, 0.8, 0.2, 1],
                    delay: 0.6,
                  }}
                >
                  Creating <BoldText>visual</BoldText> stories through{" "}
                </motion.div>
              </li>
              <li className="masking-container">
                <motion.div
                  key={selectedText}
                  className={styles.descriptionText}
                  initial="hidden"
                  animate="visible"
                  variants={textRiseVariants}
                  transition={{
                    duration: 1.6,
                    ease: [0.1, 0.8, 0.2, 1],
                    delay: 0.7,
                  }}
                >
                  designs that <BoldText>captivate</BoldText> and <BoldText>communicate</BoldText>.
                </motion.div>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

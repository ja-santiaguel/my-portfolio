import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import classNames from "classnames";
import styles from "./SectionTracker.module.css";
import AnimationRiseUp from "../animations/AnimationRiseUp";

export default function SectionTracker({
  sections,
  currentIndex,
  onSectionClick,
}) {
  const trackerRef = useRef(null);
  const previewRefs = useRef([]);

  // Filter out the last section
  const filteredSections = sections.slice(0, -1);

  useEffect(() => {
    const totalSections = sections.length;
    const isFooter = currentIndex === totalSections - 1;

    if (isFooter) {
      // Handle the case when the current section is the footer
      filteredSections.forEach((_, index) => {
        if (previewRefs.current[index]) {
          gsap.to(previewRefs.current[index], {
            opacity: 0.3,
            duration: 0.4,
            ease: "power2.out",
          });
        }
      });
    } else if (previewRefs.current[currentIndex]) {
      gsap.to(previewRefs.current[currentIndex], {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      });

      filteredSections.forEach((_, index) => {
        if (index !== currentIndex && previewRefs.current[index]) {
          gsap.to(previewRefs.current[index], {
            opacity: 0.3,
            duration: 0.4,
            ease: "power2.out",
          });
        }
      });
    }
  }, [currentIndex, sections, filteredSections]);

  const handleMouseEnter = (index) => {
    if (previewRefs.current[index]) {
      gsap.to(previewRefs.current[index], {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = (index) => {
    if (previewRefs.current[index] && index !== currentIndex) {
      gsap.to(previewRefs.current[index], {
        opacity: 0.3,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  return (
    <div className="absolute top-0 w-full h-full grid-8-column px-16">
      <div
        ref={trackerRef}
        className={classNames(
          "col-start-8 col-span-1",
          styles.previewContainer
        )}
      >
        {filteredSections.map((section, index) => (
          <AnimationRiseUp
            key={index}
            uniqueKey={`preview-${index}`}
            delay={index * 0.1} // Adjust the delay as needed
          >
            <div
              ref={(el) => (previewRefs.current[index] = el)}
              className={classNames(styles.previewItem, {
                [styles.current]: index === currentIndex,
                [styles.nonCurrent]: index !== currentIndex,
              })}
              onClick={() => onSectionClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              {section.src && (
                <Image
                  src={section.src}
                  alt={`Preview ${index + 1}`}
                  width={100}
                  height={100}
                  className={styles.previewImage}
                />
              )}
            </div>
          </AnimationRiseUp>
        ))}
      </div>
    </div>
  );
}
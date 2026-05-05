"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import classNames from "classnames";
import gsap from "gsap";
import LocomotiveScroll from "locomotive-scroll";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { CiLinkedin, CiMail, CiInstagram } from "react-icons/ci";

gsap.registerPlugin(ScrollTrigger);

export default function AetherPage() {
  const router = useRouter();
  const headerRef = useRef(null);
  const scrollRef = useRef(null);

  const headerTexts = [
    "",
    "The Problem",
    "Research",
    "Insights",
    "Ideation",
    "Wireframing",
    "Refinement",
    "Final Product",
    "Key Takeaways",
    "Final Notes",
    "Interested in creating a digital experience?",
  ];

  useLayoutEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
    });

    const sections = document.querySelectorAll(`.${styles.container}`);
    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        end: "bottom 75%",
        onEnter: () => updateHeader(index),
        onLeaveBack: () => updateHeader(index - 1),
        // markers: true,
      });
    });

    function updateHeader(index) {
      const header = headerRef.current;
      if (!header) return;
      if (index < 0) {
        gsap.to(header, { opacity: 0, duration: 0.25 });
      } else {
        gsap.to(header, {
          opacity: 0,
          duration: 0.25,
          onComplete: () => {
            header.textContent = headerTexts[index];
            gsap.to(header, { opacity: 1, duration: 0.5 });
          },
        });
      }
    }

    updateHeader(0);

    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });

    sections.forEach((section) => resizeObserver.observe(section));

    return () => {
      resizeObserver.disconnect();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main className={classNames(styles.main, "relative w-full")}>
      <section
        className={classNames(
          "fixed w-full grid grid-cols-8 px-16",
          styles.sectionHeaderContainer
        )}
      >
        <div
          ref={headerRef}
          className={classNames(
            "w-full bottom-0 mb-7 col-start-2 col-span-6 self-end",
            styles.sectionHeader
          )}
        ></div>
      </section>

      {/* Header */}
      <section
        className={classNames(
          styles.container,
          "w-full grid grid-cols-8 px-16"
        )}
      >
        <div className="col-start-1">
          <button
            onClick={() => router.push("/")}
            className={styles.backButton}
          >
            ← Go Back
          </button>
        </div>
          <h1
            className={classNames(
              "col-start-2 col-span-6",
              styles.projectTitle
            )}
          >
            Aether
          </h1>
        <div
          className={classNames(
            "col-start-2 col-span-6 grid grid-cols-6",
            styles.titleDescContainer
          )}
        >
          <div className="col-start-1 col-span-3 pr-4">
            <h4 className={styles.descriptionHeader}>Involvement (Team)</h4>
            <div className="flex flex-col">
              <p className={styles.descriptionBody}>
                <span className="font-extrabold">Research & Ideation:</span>{" "}
                Conducted user research, interviews, and competitive analysis to
                identify caregiver pain points.
              </p>
              <p className={styles.descriptionBody}>
                <span className="font-extrabold">
                  Wireframing & Prototyping:
                </span>{" "}
                Collaboratively designed user interfaces in Figma, prioritizing
                clarity and ease of use.
              </p>
              <p className={styles.descriptionBody}>
                <span className="font-extrabold">Development:</span> Implemented
                interactive components and smooth workflows using React and
                Next.js, ensuring a responsive and high-performance experience.
              </p>
            </div>
          </div>
          <div className="col-start-4 col-span-3 pr-4">
            <h4 className={styles.descriptionHeader}>Overview</h4>
            <div className="flex flex-col">
              <p className={styles.descriptionBody}>
                AETHER is a mobile application designed to ease the burden of
                form-filling for caregivers by streamlining complex
                documentation into an intuitive and efficient experience.
              </p>
              <p className={styles.descriptionBody}>
                Built with compassion and accessibility in mind, AETHER
                leverages AI-powered assistance to simplify data entry, reducing
                stress for those managing critical paperwork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section
        className={classNames(
          styles.container,
          "w-full grid grid-cols-8 px-16 py-16"
        )}
      >
        <div className="grid grid-cols-6 col-start-2 col-span-6 gap-y-24">
          <h2
            className={classNames("col-start-1 col-span-5", styles.largeText)}
          >
            Caregivers spend up to an average of{" "}
            <span className="font-light italic">15 hours a week</span> managing
            forms and paperwork.
          </h2>
          <h2
            className={classNames(
              "col-start-2 col-span-5 text-right",
              styles.largeText
            )}
          >
            This equates to nearly{" "}
            <span className="font-light italic">30 days a year</span> spent away
            from things that{" "}
            <span className="font-light italic">matter most</span>.
          </h2>
          <div className="col-start-1 col-span-3 pr-4">
            <h4 className={styles.descriptionHeader}>
              Identifying the problem
            </h4>
            <div className="flex flex-col">
              <p className={styles.descriptionBody}>
                Managing paperwork is an unavoidable yet often overlooked part
                of caregiving. Recognizing this, we set out to understand the
                impact of form-filling and how it affects the lives of
                caregivers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Research */}
      <section
        className={classNames(
          styles.container,
          "w-full grid grid-cols-8 px-16 py-16"
        )}
      >
        <div className="col-start-2 col-span-6">
          <div className="w-full grid grid-cols-6 gap-y-16">
            <Image
              src="/images/user_persona.jpg"
              alt="User Persona"
              width={1080}
              height={1080}
              className={classNames("w-full col-span-6", styles.userPersona)}
            />
            <div className="col-start-1 col-span-3 pr-4">
              <h4 className={styles.descriptionHeader}>
                Connecting with our audience
              </h4>
              <div className="flex flex-col">
                <p className={styles.descriptionBody}>
                  To understand <span className="italic">how</span> and{" "}
                  <span className="italic">why</span> this time was spent, we
                  interviewed family caregivers and healthcare aides to capture
                  the daily struggles from both personal and professional caregiving
                  roles. Analyzing the data collected, user personas were then formed
                  with consideration to their unique needs and challenges.
                </p>
              </div>
            </div>
            <div className="col-start-4 col-span-3 pr-4">
              <h4 className={classNames("invisible", styles.descriptionHeader)}>
                Header
              </h4>
              <div className="flex flex-col">
                <p className={styles.descriptionBody}>
                  It was through these interviews that allowed us to explore how
                  caregivers interacted with documents in real scenarios—where
                  they faced delays, confusion, or frustration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights */}
      <section
        className={classNames(
          styles.container,
          "w-full grid grid-cols-8 px-16 py-16"
        )}
      >
        <div className="col-start-2 col-span-6">
          <div className="w-full grid grid-cols-6 gap-y-16">
            <div className="w-full col-span-6 flex flex-col gap-y-12">
              <h3 className={classNames("", styles.largerText)}>
                <span className="text-2xl">[1]</span> Tiring
              </h3>
              <h3 className={classNames("text-center", styles.largerText)}>
                <span className="text-2xl">[2]</span> Overwhelming
              </h3>
              <h3 className={classNames("text-right", styles.largerText)}>
                <span className="text-2xl">[3]</span> Confusing
              </h3>
            </div>
            <div className="col-start-1 col-span-3 pr-4">
              <h4 className={styles.descriptionHeader}>
                Empathizing with our audience
              </h4>
              <div className="flex flex-col">
                <p className={styles.descriptionBody}>
                  Throughout our data collected, three key challenges were
                  identified: the repetitive nature of form-filling was{" "}
                  <span className="italic">
                    <span className="">[1] </span>tiring
                  </span>
                  , understanding and remembering complex jargon was{" "}
                  <span className="italic">
                    <span className="">[2] </span>overwhelming
                  </span>
                  , and managing volumes of information was{" "}
                  <span className="italic">
                    <span className="">[3] </span>confusing
                  </span>
                  .
                </p>
              </div>
            </div>
            <div className="col-start-4 col-span-3 pr-4">
              <h4 className={classNames("invisible", styles.descriptionHeader)}>
                Header
              </h4>
              <div className="flex flex-col">
                <p className={styles.descriptionBody}>
                  These struggles led us to prioritize features like{" "}
                  <span className="italic">
                    <span className="">[1] </span>auto-fill capabilities
                  </span>
                  ,{" "}
                  <span className="italic">
                    <span className="">[2] </span>AI-driven guidances
                  </span>
                  , and{" "}
                  <span className="italic">
                    <span className="">[3] </span>document organization
                  </span>
                  . By focusing on these areas, we aimed to alleviate the stress
                  of managing paperwork and provide caregivers with a more
                  efficient and supportive experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ideation */}
      <section
        className={classNames(
          styles.container,
          "w-full grid grid-cols-8 px-16 py-16"
        )}
      >
        <div className="col-start-2 col-span-6">
          <div className="w-full grid grid-cols-6 gap-y-16">
            <Image
              src="/images/journey_map.jpg"
              alt="User Journey Map"
              width={1080}
              height={1080}
              className={classNames("w-full col-span-6", styles.userPersona)}
            />
            <div className="col-start-1 col-span-3 pr-4">
              <h4 className={styles.descriptionHeader}>Proposed solution</h4>
              <div className="flex flex-col">
                <p className={styles.descriptionBody}>
                  With consideration to the key challenges, caregiver journeys
                  were mapped out by analyzing real workflows, identifying
                  friction points, and prioritizing essential tasks. Using our
                  research insights, we structured AETHER to align with how
                  caregivers naturally manage documents, integrating our
                  proposed features in a way that enhances their existing
                  habits.
                </p>
              </div>
            </div>
            <div className="col-start-4 col-span-3 pr-4">
              <h4 className={classNames("invisible", styles.descriptionHeader)}>
                Header
              </h4>
              <div className="flex flex-col">
                <p className={styles.descriptionBody}>
                  Smooth and simple was AETHER's goal, therefore, by
                  streamlining navigation and automating repetitive tasks, we
                  needed to ensure that caregivers could complete forms
                  efficiently without unnecessary friction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wireframing */}
      <section
        className={classNames(
          styles.container,
          "w-full grid grid-cols-8 px-16 py-16 gap-y-7"
        )}
      >
        <div className="col-start-2 col-span-6 grid grid-cols-6 items-center">
          <div className="col-span-3 flex flex-col pr-4">
            <h4 className={styles.descriptionHeader}>App flow</h4>
            <p className={styles.descriptionBody}>
              Addressing the key challenges, AETHER needed efficiency, clarity,
              and speed. The process should be simple—load in, select a form,
              and complete it with ease.
            </p>
            <p className={styles.descriptionBody}>
              Considering this, AETHER's wireframes were designed with a
              compassionate understanding of caregiver needs, prioritizing quick
              form accessibility, structured layouts, and intuitive
              interactions.{" "}
            </p>
          </div>
          <div className="w-full col-start-4 col-span-1 px-2">
            <Image
              src="/images/screenshots/lofi_screenshot_1.jpg"
              alt="Lofi Home Screen"
              width={430}
              height={932}
              className={classNames(styles.lofiScreenshot)}
            />
          </div>
          <div className="w-full col-start-5 col-span-1 px-2">
            <Image
              src="/images/screenshots/lofi_screenshot_2.jpg"
              alt="Lofi Document Screen"
              width={430}
              height={932}
              className={classNames(styles.lofiScreenshot)}
            />
          </div>
          <div className="w-full col-start-6 col-span-1 px-2">
            <Image
              src="/images/screenshots/lofi_screenshot_3.jpg"
              alt="Lofi Form Filling Screen"
              width={430}
              height={932}
              className={classNames(styles.lofiScreenshot)}
            />
          </div>
        </div>
        <div
          className={classNames(
            "col-start-2 col-span-6 grid grid-cols-6 items-center",
            styles.wireframesContainer
          )}
        >
          <div className="col-span-3 flex flex-col pr-4">
            <h4 className={styles.descriptionHeader}>But why AETHER?</h4>
            <p className={styles.descriptionBody}>
              To stand out in the market, AETHER incorporates AI-powered
              features, enabling caregivers to auto-fill forms using pre-saved
              profiles and simplifying complex jargon for clarity.
            </p>
            <p className={styles.descriptionBody}>
              Integrating these features into the design required a seamless
              approach, ensuring each major function is easily recognizable and
              accessible.
            </p>
          </div>
          <div className="w-full col-start-4 col-span-1 px-2">
            <Image
              src="/images/screenshots/lofi_screenshot_4.jpg"
              alt="Lofi Saved Profiles Screen"
              width={430}
              height={932}
              className={classNames(styles.lofiScreenshot)}
            />
          </div>
          <div className="w-full col-start-5 col-span-1 px-2">
            <Image
              src="/images/screenshots/lofi_screenshot_6.jpg"
              alt="Lofi Recipient Info Screen"
              width={430}
              height={932}
              className={classNames(styles.lofiScreenshot)}
            />
          </div>
          <div className="w-full col-start-6 col-span-1 px-2">
            <Image
              src="/images/screenshots/lofi_screenshot_5.jpg"
              alt="Lofi Simplified Text Screen"
              width={430}
              height={932}
              className={classNames(styles.lofiScreenshot)}
            />
          </div>
        </div>
      </section>

      {/* Refinement */}
      <section
        className={classNames(
          styles.container,
          "w-full grid grid-cols-8 px-16 py-16"
        )}
      >
        <div className="col-start-2 col-span-6 gap-y-16">
          <div className="w-full grid grid-cols-6 gap-y-16">
            <div
              className={classNames(
                "col-start-1 col-span-2 flex flex-col gap-y-4 items-center",
                styles.screenshotsContainer
              )}
            >
              <div className="w-full flex flex-row gap-x-auto">
                <div className="w-full px-2">
                  <Image
                    src="/images/screenshots/midfi_screenshot_1.jpg"
                    alt="Midfi Library Screen"
                    width={430}
                    height={932}
                    className={classNames(styles.midfiScreenshot)}
                  />
                </div>
                <div className="w-full px-2">
                  <Image
                    src="/images/screenshots/midfi_screenshot_2.jpg"
                    alt="Midfi Document Screen"
                    width={430}
                    height={932}
                    className={classNames(styles.midfiScreenshot)}
                  />
                </div>
              </div>
              <h4 className={styles.descriptionHeader}>Mid-fidelity</h4>
            </div>
            <div
              className={classNames(
                "col-start-4 col-span-3 flex flex-col gap-y-4 items-center",
                styles.screenshotsContainer
              )}
            >
              <div className="w-full flex flex-row gap-x-auto">
                <div className="w-full px-2">
                  <Image
                    src="/images/screenshots/hifi_screenshot_2.jpg"
                    alt="Hifi Library Screen"
                    width={430}
                    height={932}
                    className={classNames(styles.hifiScreenshot)}
                  />
                </div>
                <div className="w-full px-2">
                  <Image
                    src="/images/screenshots/hifi_screenshot_3.jpg"
                    alt="Hifi Saved Forms Screen"
                    width={430}
                    height={932}
                    className={classNames(styles.hifiScreenshot)}
                  />
                </div>
                <div className="w-full px-2">
                  <Image
                    src="/images/screenshots/hifi_screenshot_4.jpg"
                    alt="Hifi Saved Profiles Screen"
                    width={430}
                    height={932}
                    className={classNames(styles.hifiScreenshot)}
                  />
                </div>
              </div>
              <h4 className={styles.descriptionHeader}>High-fidelity</h4>
            </div>
            <div className="col-start-1 col-span-3 pr-4">
              <h4 className={styles.descriptionHeader}>User testing results</h4>
              <div className="flex flex-col">
                <p className={styles.descriptionBody}>
                  Usability testing of the low-fidelity designs revealed that
                  while users appreciated AETHER’s straightforward flow, some
                  found the auto-fill feature unclear and needed guidance on
                  pre-saving information. As we refined functionality, the
                  design theme also evolved through iterative changes to achieve
                  a more modern and functional look.
                </p>
              </div>
            </div>
            <div className="col-start-4 col-span-3 pr-4">
              <h4 className={classNames("invisible", styles.descriptionHeader)}>
                Header
              </h4>
              <div className="flex flex-col">
                <p className={styles.descriptionBody}>
                  To address the functionality concerns, AETHER was further
                  refined with clearer instructions and a more intuitive display
                  of saved documents. Furthermore, by enhancing the user interface and
                  providing additional guidance, we ensured that caregivers
                  could navigate the app effortlessly and fully utilize its
                  features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Product */}
      <section
        className={classNames(
          styles.container,
          "w-full grid grid-cols-8 px-16 py-16"
        )}
      >
        <div className="col-start-1 col-span-4 p-4">
          <Image
            src="/images/mockups/aether/mobile_mockup_aether_01.jpg"
            alt="Mockup of Aether Mobile App Home Screen"
            layout="responsive"
            width={1080}
            height={1080}
            className={classNames("w-full", styles.mobileMockup)}
          />
        </div>
        <div className="col-start-5 col-span-4 w-full">
          <div className="w-full p-4">
            <Image
              src="/images/mockups/aether/mobile_mockup_aether_02.jpg"
              alt="Mockup of Aether Mobile App Library Screen"
              layout="responsive"
              width={1080}
              height={1080}
              className={classNames("w-full", styles.mobileMockup)}
            />
          </div>
          <div className="w-full p-4">
            <Image
              src="/images/mockups/aether/mobile_mockup_aether_03.jpg"
              alt="Mockup of Aether Mobile App Form Screen"
              layout="responsive"
              width={1080}
              height={1080}
              className={classNames("w-full", styles.mobileMockup)}
            />
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section
        className={classNames(
          styles.container,
          "w-full grid grid-cols-8 px-16 py-16"
        )}
      >
        <div className="grid grid-cols-6 col-start-2 col-span-6 gap-y-16">
          <div className="grid grid-cols-6 col-start-1 col-span-6">
            <h2
              className={classNames(
                "col-start-1 col-span-3 pr-4",
                styles.keyTakeawayText
              )}
            >
              Clarity is key to an efficient experience
            </h2>
            <div className="col-start-4 col-span-3 flex flex-col">
              <p className={classNames(styles.descriptionBody)}>
                Users need guidance. Early testing revealed confusion around our
                major features, leading us to improve onboarding and the
                inclusion of contextual tool-tips.
              </p>
              <p className={classNames(styles.descriptionBody)}>
                By prioritizing clarity, we ensured a easier
                learning curve for first-time and repeat users.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-6 col-start-1 col-span-6">
            <h2
              className={classNames(
                "col-start-1 col-span-3 pr-4",
                styles.keyTakeawayText
              )}
            >
              User-Centered Design is Essential
            </h2>
            <div className="col-start-4 col-span-3 flex flex-col">
              <p className={classNames(styles.descriptionBody)}>
                Every design decision was driven by real user needs. Continuous
                testing and iteration helped refine AETHER’s features, ensuring
                that the app not only functioned efficiently but also provided a
                stress-free experience tailored to caregivers.
              </p>
              <p className={classNames(styles.descriptionBody)}>
                By actively listening to user feedback, we were able to create
                an intuitive solution that seamlessly integrated into their
                daily routines.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-6 col-start-1 col-span-6">
            <h2
              className={classNames(
                "col-start-1 col-span-3 pr-4",
                styles.keyTakeawayText
              )}
            >
              Collaboration drives impact
            </h2>
            <div className="col-start-4 col-span-3 flex flex-col">
              <p className={classNames(styles.descriptionBody)}>
                AETHER’s success was built on teamwork, problem-solving, and a
                shared vision. Each phase of development—research, design, and
                iteration—was strengthened by open communication and
                adaptability.
              </p>
              <p className={classNames(styles.descriptionBody)}>
                The result was a meaningful solution that truly addressed
                caregivers' challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Notes */}
      <section
        className={classNames(
          styles.container,
          "w-full grid grid-cols-8 px-16 py-16"
        )}
      >
        <div className="col-start-2 col-span-6 grid grid-cols-6 gap-y-16">
          <h3
            className={classNames(
              "col-start-1 col-span-6 text-justify",
              styles.finalNotesText
            )}
          >
            Through research, testing, and iteration, AETHER evolved into an
            intuitive and efficient tool that empowers caregivers thanks to a
            team of hardworking individuals.
          </h3>
          <div className="col-start-1 col-span-3 pr-4">
            <h4 className={styles.descriptionHeader}>The result</h4>
            <div className="flex flex-col">
              <p className={styles.descriptionBody}>
                Over the course of four months, our team came together to
                combine our strengths, overcome challenges, and navigate the
                demands of balancing workloads.
              </p>
            </div>
          </div>
          <div className="col-start-4 col-span-3 pr-4">
            <h4 className={classNames("invisible", styles.descriptionHeader)}>
              Header
            </h4>
            <div className="flex flex-col">
              <p className={styles.descriptionBody}>
                This project was a testament to our dedication, creativity, and
                collaboration. A heartfelt thank you to every team member for
                their hard work, support, and commitment to making AETHER a
                reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Last */}
      <section
        className={classNames(
          styles.container,
          "w-full grid grid-cols-8 px-16 py-16"
        )}
      >
        <div className="col-start-2 col-span-6 grid grid-cols-6 gap-y-16">
          <div className="col-start-1 col-span-2 pr-4">
            <h4 className={classNames("", styles.descriptionHeader)}>
              Jonathan Andrew
            </h4>
            <p className={classNames("", styles.descriptionBody)}>
              Design to express, connect, and inspire.
            </p>
          </div>
          <div className="col-start-3 col-span-2 flex items-center"></div>
          <div className="col-start-5 col-span-2 flex flex-col items-end">
            <h4 className={classNames("text-right", styles.descriptionHeader)}>
              Get in touch
            </h4>
            <div className="flex flex-row gap-x-4">
              <CiMail className="w-6 h-6 opacity-20" />
              <a
                href="https://www.linkedin.com/in/jonathan-andrew-santiaguel/"
                target="_blank"
                rel="noreferrer"
              >
                <CiLinkedin className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/jasantiaguel/"
                target="_blank"
                rel="noreferrer"
              >
                <CiInstagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

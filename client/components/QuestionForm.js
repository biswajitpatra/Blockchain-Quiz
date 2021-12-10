import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const ease = [0.43, 0.13, 0.23, 0.96];

const stepVariants = {
  initial: {
    y: "50%",
    opacity: 0,
    transition: { ease, duration: 0.8 },
  },
  animate: {
    y: "0%",
    opacity: 1,
    transition: { ease, duration: 0.8 },
  },
  exit: {
    y: "50%",
    opacity: 0,
    transition: { ease, duration: 0.8, delay: 0.5 },
  },
};

export default function QuestionForm() {
  const [active, setActive] = useState(false);
  const [height, setHeight] = useState("0px");
  const [rotate, setRotate] = useState("transform duration-700 ease");

  const contentSpace = useRef(null);

  function toggleAccordion() {
    setActive(active === false ? true : false);
    setHeight(active ? "0px" : `${contentSpace.current.scrollHeight}px`);
    setRotate(
      active
        ? "transform duration-700 ease"
        : "transform duration-700 ease rotate-180"
    );
  }

  return (
    <motion.div variants={stepVariants} className="flex flex-col p-8">
      <button
        className="py-6 box-border appearance-none cursor-pointer focus:outline-none flex items-center justify-between"
        onClick={toggleAccordion}
      >
        <p className="inline-block font-bold light">Check this out </p>
        <img
          src="https://img.icons8.com/ios-glyphs/30/000000/chevron-up.png"
          alt="Chevron icon"
          className={`${rotate} inline-block`}
        />
      </button>
      <div
        ref={contentSpace}
        style={{ maxHeight: `${height}` }}
        className="overflow-auto scrollbar-hide transition-max-height duration-700 ease-in-out"
      >
        <div className="pb-10">This is very good and amazing.</div>
      </div>
    </motion.div>
  );
}

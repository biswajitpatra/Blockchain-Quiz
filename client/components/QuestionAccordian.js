import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { NO_OF_OPTIONS } from "../config";

const item = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export default function QuestionAccordian({ questionNo, questionRegister }) {
  const [active, setActive] = useState(false);
  const [height, setHeight] = useState("0px");
  const [rotate, setRotate] = useState("transform duration-700 ease");

  const contentSpace = useRef(null);

  function toggleAccordion() {
    setActive(active === false ? true : false);
    setHeight(active ? "0px" : `${contentSpace.current.scrollHeight}px`);
    setRotate(
      active
        ? "transform duration-500 ease"
        : "transform duration-500 ease rotate-180"
    );
  }

  return (
    <motion.div variants={item} className="flex flex-col p-1">
      <button
        type="button"
        className="py-2 box-border appearance-none cursor-pointer focus:outline-none flex items-center justify-between"
        onClick={toggleAccordion}
      >
        <p className="inline-block font-bold light">
          Question {questionNo + 1}
        </p>
        <img
          src="https://img.icons8.com/ios-glyphs/30/000000/chevron-up.png"
          alt="Chevron icon"
          className={`${rotate} inline-block`}
        />
      </button>
      <div
        ref={contentSpace}
        style={{ maxHeight: `${height}` }}
        className="overflow-auto scrollbar-hide transition-max-height duration-700 ease-in-out bg-blue-100 rounded-md"
      >
        <div className="p-2">
          <input
            {...questionRegister(`questions.${questionNo}.question`)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
            type="text"
            placeholder="Type your question here"
          />
          <div className="grid grid-cols-2 gap-3 p-2">
            {[...Array(NO_OF_OPTIONS)].map((_, index) => (
              <div className="flex" key={index}>
                <input
                  {...questionRegister(
                    `questions.${questionNo}.correctOption`,
                    {
                      required: true,
                    }
                  )}
                  value={index}
                  type="radio"
                  className="place-self-center m-1"
                  name={`questions.${questionNo}.correctOption`}
                  required
                />
                <input
                  {...questionRegister(
                    `questions.${questionNo}.options.${index}`
                  )}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
                  type="text"
                  placeholder="Options"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

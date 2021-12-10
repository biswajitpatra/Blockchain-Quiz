import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import QuizDetailForm from "../components/QuizDetailForm";
import QuestionForm from "../components/QuestionForm";

const ease = [0.43, 0.13, 0.23, 0.96];

const pageVariants = {
  initial: {
    y: "50%",
    opacity: 0,
    transition: { ease, duration: 0.8, delay: 0.5 },
  },
  animate: {
    y: "0%",
    opacity: 1,
    transition: { ease, duration: 0.5 },
  },
  exit: {
    y: "50%",
    opacity: 0,
    transition: { ease, duration: 0.8, delay: 0.5 },
  },
};

export default function Organizer() {
  const [stepNo, setStepNo] = useState(1);
  const [formData, setFormData] = useState({});

  const updateFormData = (data) => {
    console.log(data);
    setFormData({ ...formData, data });
    setStepNo(stepNo + 1);
  };

  return (
    <motion.div
      variants={pageVariants}
      className="flex flex-col items-center justify-center min-h-screen py-2"
    >
      <Head>
        <title> Quiz App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col place-content-center w-full flex-1 px-20 md:w-3/4">
        <h1 className="absolute top-10 inset-x-0 text-3xl md:text-6xl font-bold text-center">
          <div className="text-blue-600"> Create your Quiz </div>
        </h1>
        <div className="w-full m-4">
          <AnimatePresence exitBeforeEnter>
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              key={stepNo}
            >
              {stepNo == 1 && (
                <QuizDetailForm updateFormData={updateFormData} />
              )}
              {stepNo == 2 && <QuestionForm updateFormData={updateFormData} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
}

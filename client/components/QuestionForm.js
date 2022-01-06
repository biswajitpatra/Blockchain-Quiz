import { useForm, useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import QuestionAccordian from "./QuestionAccordian";
import { NO_OF_QUESTIONS, NO_OF_OPTIONS } from "../config";

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
    transition: {
      staggerChildren: 0.5,
    },
  },
  exit: {
    y: "50%",
    opacity: 0,
    transition: { ease, duration: 0.8, delay: 0.2 },
  },
};

export default function QuestionForm({ updateFormData }) {
  const initialQuestions = [];
  const initialOptions = new Array(NO_OF_OPTIONS).fill("");
  for (let i = 0; i < NO_OF_QUESTIONS; i++) {
    initialQuestions.push({
      question: "",
      options: initialOptions,
      correctOption: null,
    });
  }
  const { handleSubmit, control, register } = useForm({
    defaultValues: {
      questions: initialQuestions,
    },
  });
  const { fields } = useFieldArray(
    {
      control,
      name: "questions",
    }
  );


  return (
    <motion.div variants={stepVariants}>
      <form onSubmit={handleSubmit(updateFormData)}>
        {fields.map((q, ind) => (
          <QuestionAccordian
            key={q.id}
            questionRegister={register}
            questionNo={ind}
          />
        ))}
        <div className="flex items-center justify-between">
          <button
            className="transition ease-in-out duration-300 bg-blue-500 hover:bg-indigo-500 hover:scale-105 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Start the Quiz
          </button>
        </div>
      </form>
    </motion.div>
  );
}

import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import QuestionForm from "../components/QuestionForm";

const ease = [0.43, 0.13, 0.23, 0.96];

const pageVariants = {
  initial: {
    y: "50%",
    opacity: 0,
    transition: { ease, duration: 0.8, delay: 0.8 },
  },
  animate: {
    y: "0%",
    opacity: 1,
    transition: { ease, duration: 0.8 },
  },
  exit: {
    y: "50%",
    opacity: 0,
    transition: { ease, duration: 0.8, delay: 0.8 },
  },
};

export default function Organizer() {
  return (
    <motion.div
      variants={pageVariants}
      className="flex flex-col items-center justify-center min-h-screen py-2"
    >
      <Head>
        <title> Quiz App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          <div className="text-blue-600"> Create your Quiz </div>
        </h1>
        <div className="w-full max-w-lg">
          <QuestionForm/>
          <QuestionForm/>
        </div>
      </main>
    </motion.div>
  );
}

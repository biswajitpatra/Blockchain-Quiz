import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Web3 from "web3";
import getQuizContract from "../utils/getQuizContract";
import { useWeb3React } from "@web3-react/core";
import WalletModal from "../components/WalletModal";

const ease = [0.43, 0.13, 0.23, 0.96];

const pageVariants = {
  initial: {
    y: "50%",
    opacity: 0,
    transition: { ease, duration: 0.8, delay: 0.2 },
  },
  animate: {
    y: "0%",
    opacity: 1,
    transition: { ease, duration: 0.5 },
  },
  exit: {
    y: "50%",
    opacity: 0,
    transition: { ease, duration: 0.8, delay: 0.2 },
  },
};

export default function Organizer() {
  const [quizzesByUser, setQuizzes] = useState([]);
  const { account, library } = useWeb3React();

  const getStatus = (quiz) => {
    const now = new Date().getTime() / 1000;
    if (
      quiz.isRunning &&
      parseInt(quiz.startTime) + parseInt(quiz.duration) < now
    ) {
      return (
        <span className="text-sm text-white font-bold p-1 items-center rounded-md bg-blue-500">
          Completed
        </span>
      );
    } else if (quiz.isRunning) {
      return (
        <span className="text-sm text-white font-bold p-1 items-center rounded-md bg-green-500">
          Running
        </span>
      );
    } else {
      return (
        <span className="text-sm text-white font-bold p-1 items-center rounded-md bg-yellow-500">
          Upcoming
        </span>
      );
    }
  };

  useEffect(async () => {
    if (account) {
      const web3 = new Web3(library);
      const QuizContract = await getQuizContract(web3);
      setQuizzes(
        await QuizContract.methods.getQuizzesBy(account).call({ from: account })
      );
    }
  }, [account]);

  return (
    <>
      <WalletModal />
      <motion.div
        variants={pageVariants}
        className="flex flex-col items-center justify-center min-h-screen py-2"
      >
        <Head>
          <title> Quiz App</title>
        </Head>

        <h1 className="sticky top-0 text-3xl md:text-4xl font-bold text-center">
          <div className="text-blue-600"> Your Quizzes </div>
          <Link href="/newquiz">
            <a
              type="button"
              className="bg-blue-500 text-white font-bold p-2 rounded-xl hover:ring mt-3 text-lg"
            >
              + Create quiz
            </a>
          </Link>
        </h1>

        <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-5">
          {quizzesByUser.length ? (
            quizzesByUser.map((q, i) => (
              <Link key={i} href={`/quiz/${q.quizId}`}>
                <div className="w-full lg:max-w-full lg:flex hover:shadow shadow-xl duration-100 border-2 border-gray-400 rounded-xl p-1 cursor-pointer">
                  <div className=" bg-white p-4 flex flex-col justify-between leading-normal">
                    <div className="mb-8">
                      {getStatus(q)}
                      <div className="text-gray-900 font-bold text-xl mb-2">
                        {q.quizName}
                      </div>
                      <p className="text-gray-700 text-base">
                        {q.description || "No description"}
                      </p>
                      <p className="text-base">
                        Prize Money: <b>{q.prizeMoney} Wei</b>
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="text-sm">
                        <p className="text-gray-900 leading-none">
                          {" "}
                          {new Date(q.startTime * 1000).toDateString()}
                        </p>
                        <p className="text-gray-600"> {q.duration / 60} mins</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="place-content-center font-bold">
              No quizzes yet 😢
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

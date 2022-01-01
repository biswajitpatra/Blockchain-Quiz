import Head from "next/head";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import Web3 from "web3";
import quizABI from "../../build/contracts/QuizContract.json";
import { contractAddress } from "../config";
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
  const web3js = new Web3(library);
  const QuizContract = new web3js.eth.Contract(quizABI.abi, contractAddress);

  const getStatus = (quiz) => {
    const now = new Date().getTime() / 1000;
    if (quiz.isRunning && quiz.startTime + quiz.duration > now) {
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
        </h1>
        <Link href="/newquiz">
          <a
            type="button"
            className="sticky top-0 bg-blue-500 text-white font-bold p-2 rounded-xl hover:ring mt-3"
          >
            + Create quiz
          </a>
        </Link>

        <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-5">
          {quizzesByUser.length ? (
            quizzesByUser.map((q, i) => (
              <a
                className="w-full lg:max-w-full lg:flex hover:shadow shadow-xl duration-100 border-2 border-gray-400 rounded-xl p-1"
                key={i}
                href={`/quiz/${q.quizId}`}
              >
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
              </a>
            ))
          ) : (
            <div className="place-content-center font-bold">No quizzes yet 😢</div>
          )}
        </div>
      </motion.div>
    </>
  );
}

import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Web3 from "web3";
import getQuizContract from "../../../utils/getQuizContract";
import { useWeb3React } from "@web3-react/core";
import WalletModal from "../../../components/WalletModal";

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

export default function QuizDetails() {
  const { account, library } = useWeb3React();

  const router = useRouter();
  const { quizId } = router.query;
  const [quizDetails, setQuizDetails] = useState({});

  useEffect(async () => {
    if (account) {
      const web3 = new Web3(library);
      const QuizContract = await getQuizContract(web3);
      setQuizDetails(await QuizContract.methods.quizzes(quizId).call());
    }
  }, [account]);

  const getStatus = (quiz) => {
    const now = new Date().getTime() / 1000;
    if (quiz.isRunning && parseInt(quiz.startTime) + parseInt(quiz.duration) < now) {
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

  const startQuiz = async () => {
    if (!account) {
      return;
    }
    const questions = localStorage.getItem(`${quizId}-questions`);
    const options = localStorage.getItem(`${quizId}-options`);
    const hashSalt = localStorage.getItem(`${quizId}-hashSalt`);
    if (questions === null) {
      // TODO: Show error and re fill the questions
      console.error("No questions found for this quizId");
      return;
    }

    questions = JSON.parse(questions);
    options = JSON.parse(options);
    console.log(quizId, questions, options, hashSalt);

    const web3 = new Web3(library);
    const QuizContract = await getQuizContract(web3);
    const tx = await QuizContract.methods
      .submitQuestions(quizId, questions, options, hashSalt)
      .send({
        from: account,
      });
    console.log(tx);
  };

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

        <h1 className="text-3xl md:text-4xl font-bold text-center m-3">
          <div className="text-blue-600">
            {" "}
            {quizDetails.quizName || "Error"}{" "}
          </div>
        </h1>
        {quizDetails.quizId && (
          <>
            <div className="text-center mb-2">{getStatus(quizDetails)}</div>
            <div className="flex flex-col justify-center m-2">
              <div className="text-left mx-3">
                <p className="font-bold">Description: </p>
                <p className="indent-8">
                  {quizDetails.description || "No description provided"}
                </p>
              </div>
              <div className="text-left mx-3">
                <span className="font-bold">Duration: </span>
                {quizDetails.duration / 60} mins
              </div>
              <div className="text-left mx-3">
                <span className="font-bold">Start Time: </span>
                {new Date(quizDetails.startTime * 1000).toLocaleString()}
              </div>
              <div className="text-left mx-3">
                <span className="font-bold">Total Prize Money: </span>
                <span className="text-red-800 font-bold">
                  {quizDetails.prizeMoney} WEI
                </span>
              </div>
              <div className="text-left mx-3">
                <span className="font-bold">Owner Address: </span>
                {quizDetails.quizOwner}
              </div>
              <div className="flex flex-wrap">
                {quizDetails.quizOwner === account && (
                  <>
                    <button
                      onClick={startQuiz}
                      className="py-2 px-3 m-3 rounded-full bg-white border-blue-600 border-2 hover:bg-blue-600 hover:text-white hover:shadow-2xl transition duration-150 ease-in-out hover:scale-110 grow disabled:opacity-30 disabled:transform-none disabled:transition-none disabled:cursor-not-allowed"
                      disabled={quizDetails.isRunning}
                    >
                      Start Quiz
                    </button>
                    <button
                      className="py-2 px-3 m-3 rounded-full bg-white border-blue-600 border-2 hover:bg-blue-600 hover:text-white hover:shadow-2xl transition duration-150 ease-in-out hover:scale-110 grow disabled:opacity-30 disabled:transform-none disabled:transition-none disabled:cursor-not-allowed"
                      disabled={!quizDetails.isRunning}
                    >
                      Submit Answers
                    </button>
                    <button
                      className="py-2 px-3 m-3 rounded-full bg-white border-blue-600 border-2 hover:bg-blue-600 hover:text-white hover:shadow-2xl transition duration-150 ease-in-out hover:scale-110 grow disabled:opacity-30 disabled:transform-none disabled:transition-none disabled:cursor-not-allowed"
                      disabled={quizDetails.isRunning}
                    >
                      Update Quiz
                    </button>
                  </>
                )}
                <button
                  className="py-2 px-3 m-3 rounded-full bg-white border-blue-600 border-2 hover:bg-blue-600 hover:text-white hover:shadow-2xl transition duration-150 ease-in-out hover:scale-110 basis-full disabled:opacity-30 disabled:transform-none disabled:transition-none disabled:cursor-not-allowed"
                  disabled={!quizDetails.isRunning}
                >
                  Play Quiz
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}

import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { CheckCircleIcon } from "@heroicons/react/solid";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import Web3 from "web3";
import { useState, useEffect } from "react";
import quizABI from "../../build/contracts/QuizContract.json";
import { contractAddress } from "../config";
import { useWeb3React } from "@web3-react/core";
import WalletModal from "./WalletModal";

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

export default function OrganizerUploadForm({ formData }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const { account, library } = useWeb3React();
  const noOfSteps = 3;

  const updateProgress = (value) => {
    setProgress((value * 100) / noOfSteps);
  };

  useEffect(async () => {
    const web3js = new Web3(library);
    const QuizContract = new web3js.eth.Contract(quizABI.abi, contractAddress);
    console.log(formData);
    await QuizContract.methods
      .createQuiz({ ...formData, quizOwner: account })
      .send({ from: account, value: formData.prizeMoney })
      .on("sending", (p) => {
        setMessage("Signing transaction...");
        updateProgress(1);
      })
      .on("transactionHash", (hash) => {
        setMessage("Transaction hash: " + hash);
        updateProgress(2);
      })
      .on("receipt", (receipt) => {
        setMessage("Successfully created quiz");
        updateProgress(3);
      })
      .on("error", (error, receipt) => {
        console.log(error, receipt);
        setMessage(error.message);
      });

    // router.push("/quiz");
  }, []);

  return (
    <>
      <WalletModal />
      <motion.div variants={stepVariants} className="my-16">
        <div className="my-10 font-bold text-xl">{message}</div>
        <ProgressBar
          percent={progress}
          filledBackground="linear-gradient(to right, #71fafc, #0560fa)"
        >
          {[...Array(noOfSteps + 1)].map((_, index) => (
            <Step transition="scale" key={index}>
              {({ accomplished }) => (
                <CheckCircleIcon
                  width="40"
                  className="bg-white text-green-400"
                  style={{ filter: `grayscale(${accomplished ? 0 : 100}%)` }}
                />
              )}
            </Step>
          ))}
        </ProgressBar>
      </motion.div>
    </>
  );
}

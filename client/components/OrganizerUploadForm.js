import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/solid";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import Web3 from "web3";
import { useState, useEffect } from "react";
import quizABI from "../abi/quizContract.json";
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
  const [progress, setProgress] = useState(80);
  const { address, provider } = useWeb3React();

  useEffect(() => {
    const web3js = new Web3(provider);
    const QuizContract = new web3js.eth.Contract(quizABI, contractAddress);
    console.log(formData);
    QuizContract.methods.createQuiz(formData).send({ from: address });
  });

  return (
    <>
      <WalletModal />
      <motion.div variants={stepVariants} className="my-16">
        <ProgressBar
          percent={progress}
          filledBackground="linear-gradient(to right, #71fafc, #0560fa)"
        >
          <Step transition="scale">
            {({ accomplished }) => (
              <CheckCircleIcon
                width="40"
                className="bg-white text-green-400"
                style={{ filter: `grayscale(${accomplished ? 0 : 100}%)` }}
              />
            )}
          </Step>
          <Step transition="scale">
            {({ accomplished }) => (
              <CheckCircleIcon
                width="40"
                className="bg-white text-green-400"
                style={{ filter: `grayscale(${accomplished ? 0 : 100}%)` }}
              />
            )}
          </Step>
          <Step transition="scale">
            {({ accomplished }) => (
              <CheckCircleIcon
                width="40"
                className="bg-white text-green-400"
                style={{ filter: `grayscale(${accomplished ? 0 : 100}%)` }}
              />
            )}
          </Step>
          <Step transition="scale">
            {({ accomplished }) => (
              <CheckCircleIcon
                width="40"
                className="bg-white text-green-400"
                style={{ filter: `grayscale(${accomplished ? 0 : 100}%)` }}
              />
            )}
          </Step>
        </ProgressBar>
      </motion.div>
    </>
  );
}

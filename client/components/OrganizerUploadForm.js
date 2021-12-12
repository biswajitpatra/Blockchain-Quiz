import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/solid";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import Web3 from "web3";
import { useState, useEffect } from "react";
import quizABI from "../abi/quizContract.json";
import { contractAddress } from "../config";

let abi = quizABI;
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

export default function OrganizerUploadForm({ questionData }) {
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);

  const [progress, setProgress] = useState(80);

  // useEffect(() => {
  //   window.ethereum
  //     ? ethereum
  //         .request({ method: "eth_requestAccounts" })
  //         .then((accounts) => {
  //           setAddress(accounts[0]);
  //           let w3 = new Web3(ethereum);
  //           setWeb3(w3);
  //           console.log(accounts[0]);
  //           let c = new w3.eth.Contract(abi, contractAddress);
  //           setContract(c);
  //         })
  //         .catch((err) => alert(err))
  //     : alert("Please install MetaMask");
  // }, []);

  // useEffect(async () => {
  //   if (!web3 || !contract || !address) {
  //     return;
  //   }

  //   const value = await contract.methods.getMessage().call();
  //   console.log(value);
  // }, [contract]);

  return (
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
  );
}

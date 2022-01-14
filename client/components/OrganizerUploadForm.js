import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { CheckCircleIcon } from '@heroicons/react/solid';
import 'react-step-progress-bar/styles.css';
import { ProgressBar, Step } from 'react-step-progress-bar';
import Web3 from 'web3';
import { useState, useEffect } from 'react';
import getQuizContract from '../utils/getQuizContract';
import { useWeb3React } from '@web3-react/core';
import WalletModal from './WalletModal';
import { NO_OF_OPTIONS, NO_OF_QUESTIONS } from '../config.js';

const ease = [0.43, 0.13, 0.23, 0.96];
const stepVariants = {
    initial: {
        y: '50%',
        opacity: 0,
        transition: { ease, duration: 0.8 },
    },
    animate: {
        y: '0%',
        opacity: 1,
        transition: { ease, duration: 0.8 },
    },
    exit: {
        y: '50%',
        opacity: 0,
        transition: { ease, duration: 0.8, delay: 0.2 },
    },
};

export default function OrganizerUploadForm({ formData }) {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const { account, library } = useWeb3React();
    const noOfSteps = 5;

    const updateProgress = (value) => {
        setProgress((value * 100) / noOfSteps);
    };

    const randomString = (length) => {
        let result = '';
        let characters = 'abcdef0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength),
            );
        }
        return result;
    };

    useEffect(() => {
        async function callContract() {
            if (!account) {
                return;
            }

            const web3 = new Web3(library);
            const QuizContract = await getQuizContract(web3);
            let questions = [];
            let options = [];
            let answers = [];

            console.log(formData);
            for (let i = 0; i < formData.questions.length; i++) {
                questions.push(formData.questions[i].question);
                options.push(formData.questions[i].options);
                answers.push(formData.questions[i].correctOption);
            }

            let hashSalt = `0x${randomString(64)}`;
            const encodedQuestions = web3.eth.abi.encodeParameters(
                [
                    `string[${NO_OF_QUESTIONS}]`,
                    `string[${NO_OF_OPTIONS}][${NO_OF_QUESTIONS}]`,
                    `bytes32`,
                ],
                [questions, options, hashSalt],
            );
            const encodedAnswers = web3.eth.abi.encodeParameters(
                [`uint8[${NO_OF_QUESTIONS}]`, 'bytes32'],
                [answers, hashSalt],
            );

            let isSuccess;

            let receipt = await QuizContract.methods
                .createQuiz(
                    formData.quizName,
                    formData.description,
                    formData.prizeMoney,
                    Math.floor(formData.startTime / 1000),
                    formData.duration * 60,
                    web3.utils.keccak256(encodedQuestions),
                    web3.utils.keccak256(encodedAnswers),
                )
                .send({ from: account, value: formData.prizeMoney })
                .on('sending', () => {
                    setMessage('Signing transaction...');
                    updateProgress(1);
                })
                .on('transactionHash', (hash) => {
                    setMessage(`Transaction hash: ${hash}`);
                    updateProgress(2);
                })
                .on('receipt', (receipt) => {
                    isSuccess = true;
                    setMessage('Quiz added to contracts');
                    console.log(receipt);
                    updateProgress(3);
                })
                .on('error', (error, receipt) => {
                    isSuccess = false;
                    console.log(error, receipt);
                    setMessage(error.message);
                });

            if (!isSuccess) {
                return;
            }

            if (formData.automate === true) {
                const signedToken = await web3.eth.personal.sign(
                    receipt.transactionHash,
                    account,
                );

                updateProgress(4);
                setMessage('Setting up quiz...');
                const response = await fetch('/api/quiz', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        transactionHash: receipt.transactionHash,
                        signedToken,
                        questions,
                        options,
                        answers,
                        hashSalt,
                    }),
                });

                if (response.status !== 200) {
                    setMessage(response.error);
                    isSuccess = false;
                    return;
                }
            }
            const quizId = receipt.events.QuizCreated.returnValues.quizId;
            localStorage.setItem(
                `${quizId}-questions`,
                JSON.stringify(questions),
            );
            localStorage.setItem(`${quizId}-options`, JSON.stringify(options));
            localStorage.setItem(`${quizId}-answers`, JSON.stringify(answers));
            localStorage.setItem(`${quizId}-hashSalt`, hashSalt);

            updateProgress(5);
            setMessage('Quiz created successfully');

            router.push('/organizer');
        }
        callContract();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account]);

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
                                    style={{
                                        filter: `grayscale(${
                                            accomplished ? 0 : 100
                                        }%)`,
                                    }}
                                />
                            )}
                        </Step>
                    ))}
                </ProgressBar>
            </motion.div>
        </>
    );
}

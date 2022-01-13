import quizJSON from '../../build/contracts/QuizContract.json';
import Web3 from 'web3';

const web3 = new Web3();
const quizCreatedInputs = quizJSON.abi.find(
    (i) => i.type === 'event' && i.name === 'QuizCreated',
).inputs;

const quizUpdatedEvents = quizJSON.abi.find(
    (i) => i.type === 'event' && i.name === 'QuizUpdated',
).inputs;

export const decodeQuizCreatedEvent = (log) =>
    web3.eth.abi.decodeLog(quizCreatedInputs, log.data);

export const decodeQuizUpdatedEvent = (log) =>
    web3.eth.abi.decodeLog(quizUpdatedEvents, log.data);

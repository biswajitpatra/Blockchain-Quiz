import Web3 from 'web3';
import { addQuizTask } from '../../../utils/cloudTasks';
import authMiddleware from '../../../middlewares/auth';
import { decodeQuizCreatedEvent } from '../../../utils/abiDecoder';

const handler = async (req, res) => {
    if (req.method !== 'POST')
        return res.status(405).json({ error: 'Method not allowed' });

    const {
        transactionHash,
        signedToken,
        questions,
        options,
        answers,
        hashSalt,
    } = req.body;
    const provider = new Web3.providers.HttpProvider(process.env.ETH_NODE_URL);
    const web3 = new Web3(provider);

    const transactionReceipt = await web3.eth.getTransactionReceipt(
        transactionHash,
    );

    const decodedLogs = decodeQuizCreatedEvent(transactionReceipt.logs[0]);

    await addQuizTask(
        transactionHash,
        transactionHash,
        signedToken,
        decodedLogs.quizId,
        decodedLogs.quiz.startTime,
        questions,
        options,
        decodedLogs.quiz.duration,
        answers,
        hashSalt,
    );
    res.json({ success: true, decodedLogs, transactionReceipt });
};

export default authMiddleware(handler);

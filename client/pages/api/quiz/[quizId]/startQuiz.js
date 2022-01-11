import authMiddleware from "../../../../middlewares/auth";
import quizJSON from "../../../../../build/contracts/QuizContract.json";
import Web3 from "web3";
import getQuizContract from "../../../../utils/getQuizContract";

const handler = async (req, res) => {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { quizId } = req.query;
  const { questions, options, hashSalt } = req.body;

  const provider = new Web3.providers.HttpProvider(process.env.ETH_NODE_URL);
  const web3 = new Web3(provider);

  const networkId = await web3.eth.net.getId();
  const contractAddress = quizJSON.networks[networkId].address;

  const quizContract = await getQuizContract(web3);
  const tx = quizContract.methods.submitQuestions(
    quizId,
    questions,
    options,
    hashSalt
  );
  const gas = await tx.estimateGas({ from: process.env.ETH_PUBLIC_KEY });
  const gasPrice = await web3.eth.getGasPrice();
  const data = await tx.encodeABI();
  const nonce = await web3.eth.getTransactionCount(process.env.ETH_PUBLIC_KEY);
  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: contractAddress,
      data,
      gas,
      gasPrice,
      nonce,
      networkId,
    },
    process.env.ETH_PRIVATE_KEY
  );

  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

  return res.status(200).json({
    success: "Quiz started",
    transactionHash: receipt.transactionHash,
  });
};

export default authMiddleware(handler);

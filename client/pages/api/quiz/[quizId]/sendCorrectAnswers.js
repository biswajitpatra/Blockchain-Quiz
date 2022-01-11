import authMiddleware from "../../../../middlewares/auth";
import quizJSON from "../../../../../build/contracts/QuizContract.json";
import getQuizContract from "../../../../utils/getQuizContract";
import Web3 from "web3";

const handler = async (req, res) => {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { quizId } = req.query;
  const { answers, hashSalt } = req.body;

  const provider = new Web3.providers.HttpProvider(process.env.ETH_NODE_URL);
  const web3 = new Web3(provider);

  const networkId = await web3.eth.net.getId();
  const contractAddress = quizJSON.networks[networkId].address;

  const quizContract = await getQuizContract(web3);
  const tx = quizContract.methods.submitCorrectAnswers(
    quizId,
    answers,
    hashSalt
  );
  const gas = await tx.estimateGas({ from: process.env.ETH_PUBLIC_KEY });
  const gasPrice = await web3.eth.getGasPrice();
  const data = tx.encodeABI();
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
  console.log(receipt);

  return res.status(200).json({
    success: "Sent correct answers to contract",
    transactionHash: receipt.transactionHash,
  });
};

export default authMiddleware(handler);

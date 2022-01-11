import quizJSON from "../../build/contracts/QuizContract.json";

const getQuizContract = async (web3) => {
  const networkId = await web3.eth.net.getId();
  if (!quizJSON.networks[networkId])
    throw new Error(
      "Please change the blockchain network to suggested network"
    );
  const contractAddress = quizJSON.networks[networkId].address;
  return new web3.eth.Contract(quizJSON.abi, contractAddress);
};

export default getQuizContract;

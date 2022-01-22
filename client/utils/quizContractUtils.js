import quizJSON from '../../build/contracts/QuizContract.json';

export const getQuizContractAddress = async (web3) => {
    const networkId = await web3.eth.net.getId();
    if (!quizJSON.networks[networkId])
        throw new Error(
            'Please change the blockchain network to suggested network',
        );
    return quizJSON.networks[networkId].address;
}

export const getQuizContract = async (web3) => {
    const contractAddress = await getQuizContractAddress(web3);
    return new web3.eth.Contract(quizJSON.abi, contractAddress);
};

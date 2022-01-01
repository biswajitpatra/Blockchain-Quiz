import { contractAddress } from "../config";
import Web3 from "web3";

const authMiddleware = (handler) => {
  return async (req, res) => {
    try {
      const { transactionHash, signedToken } = req.body;
      const provider = new Web3.providers.HttpProvider(
        process.env.ETH_NODE_URL
      );
      const web3 = new Web3(provider);

      const address = await web3.eth.accounts.recover(
        transactionHash,
        signedToken
      );

      const transactionReceipt = await web3.eth.getTransactionReceipt(
        transactionHash
      );
      if (
        address.toLowerCase() !== transactionReceipt.from ||
        transactionReceipt.to !== contractAddress.toLowerCase()
      )
        return res
          .status(401)
          .json({ error: "Correct transaction hash required" });

      await handler(req, res);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  };
};

export default authMiddleware;

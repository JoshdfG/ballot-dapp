import { useCallback } from "react";
import { isSupportedChain } from "../utils";
import { isAddress } from "ethers";
import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";

// The hook useGiveRightToVote takes 'address' as a parameter
const useGiveRightToVote = (address) => {
  // Use the 'useWeb3ModalAccount' hook to get the 'chainId' (the ID of the current blockchain network)
  const { chainId } = useWeb3ModalAccount();

  // 'useWeb3ModalProvider' hook might provide the current wallet provider connected.
  const { walletProvider } = useWeb3ModalProvider();

  // useCallback is a built-in React hook
  // that returns a memorized version of the callback function passed into it
  return useCallback(async () => {
    // Check for the correct network and valid address, return console error if the check fails
    if (!isSupportedChain(chainId)) return console.error("Wrong network");
    if (!isAddress(address)) return console.error("Invalid address");

    // This might create a provider object that allows interacting with the Ethereum network.
    const readWriteProvider = getProvider(walletProvider);

    // This gets the signer. The signer could be thought of as an identity that can sign transactions
    const signer = await readWriteProvider.getSigner();

    // This is to create or get the contract where the proposals are stored.
    const contract = getProposalsContract(signer);

    try {
      // Estimating the gas price for the transaction
      const estimatedGas = await contract.giveRightToVote.estimateGas(address);

      // This sends the actual transaction, which grants voting rights to the 'address'
      const transaction = await contract.giveRightToVote(address, {
        gasLimit: estimatedGas,
      });

      // Wait for the transaction to be confirmed and get the transaction receipt
      const receipt = await transaction.wait();

      // Check the status of the receipt, if it's true, the transaction was successful
      if (receipt.status) {
        return console.log("giveRightToVote successfully!");
      }

      console.log("giveRightToVote failed!");
    } catch (error) {
      console.error("error: ", error);
    }
  }, [address, chainId, walletProvider]); // These are the dependencies of useCallback,
  // if any of these change, useCallback will return a new function.
};

export default useGiveRightToVote;

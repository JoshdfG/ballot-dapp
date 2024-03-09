// Import the useCallback hook from React. This prevents unnecessary rerendering by keeping a
// function in memory until a necessary state change.
// Import necessary utilities and constants
import { useCallback } from "react";
import { isSupportedChain } from "../utils";
import { isAddress } from "ethers";
import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import the necessary methods to access account and provider details from Web3Modal's ethers adapter
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";

// Define a custom hook `useDelegate` which takes in the decoded user's address as an argument
const useDelegate = (delegateToAddress) => {
  // Use the imported hooks to retrieve the chainId from the user's account and the user's wallet provider
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  // Use useCallback to define a function that will be kept in memory until necessary state changes take place.
  // In this case, it will delegate votes to another address.
  return useCallback(async () => {
    // Make sure the active network is supported by the dApp and the delegation address is valid
    if (!isSupportedChain(chainId)) {
      toast.error("Wrong network");
      return;
    }
    if (!isAddress(delegateToAddress)) {
      toast.error("Invalid address");
      return;
    }

    // Get the current wallet provider and signer
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    // Get the contract with the signer who will make transactions
    const contract = getProposalsContract(signer);

    // Try to delegate the votes to a specific address and print the result of operation
    try {
      const transaction = await contract.delegate(delegateToAddress);
      toast.info("Delegating votes...");

      const receipt = await transaction.wait();

      if (receipt.status) {
        toast.success("Successful delegation!");
      } else {
        toast.error("Failed delegation!");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }, [delegateToAddress, chainId, walletProvider]);
};

// Export the `useDelegate` hook
export default useDelegate;

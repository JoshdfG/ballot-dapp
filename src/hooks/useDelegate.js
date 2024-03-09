import { useCallback } from "react";
import { isSupportedChain } from "../utils";
import { isAddress } from "ethers";
import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";

const useDelegate = (delegateToAddress) => {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  return useCallback(async () => {
    if (!isSupportedChain(chainId)) {
      toast.error("Wrong network");
      return;
    }
    if (!isAddress(delegateToAddress)) {
      toast.error("Invalid address");
      return;
    }

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const contract = getProposalsContract(signer);

    try {
      const transaction = await contract.delegate(delegateToAddress);
      toast.info("Delegating votes...");

      const receipt = await transaction.wait();

      if (receipt.status) {
        toast.success("Delegation completed successfully");
      } else {
        toast.error("OOps! Delegation failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }, [delegateToAddress, chainId, walletProvider]);
};

export default useDelegate;

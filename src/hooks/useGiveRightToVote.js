import { useCallback } from "react";
import { isSupportedChain } from "../utils";
import { isAddress } from "ethers";
import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";

const useGiveRightToVote = (address) => {
  const { chainId } = useWeb3ModalAccount();

  const { walletProvider } = useWeb3ModalProvider();

  return useCallback(async () => {
    if (!isSupportedChain(chainId)) return console.error("Wrong network");
    if (!isAddress(address)) return console.error("Invalid address");

    const readWriteProvider = getProvider(walletProvider);

    const signer = await readWriteProvider.getSigner();

    const contract = getProposalsContract(signer);

    try {
      const estimatedGas = await contract.giveRightToVote.estimateGas(address);

      const transaction = await contract.giveRightToVote(address, {
        gasLimit: estimatedGas,
      });

      const receipt = await transaction.wait();

      if (receipt.status) {
        return console.log("giveRightToVote successfully!");
      }

      console.log("giveRightToVote failed!");
    } catch (error) {
      console.error("error: ", error);
    }
  }, [address, chainId, walletProvider]);
};

export default useGiveRightToVote;

import { Box, Container, Flex, Text } from "@radix-ui/themes";
import { configureWeb3Modal } from "./connection";
import "@radix-ui/themes/styles.css";
import Header from "./component/Header";
import Proposal from "./component/Proposal";
import DelegateVote from "./component/DelegateVote";
import useProposals from "./hooks/useProposals";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { isSupportedChain } from "./utils";
import { getProvider } from "./constants/providers";
import { getProposalsContract } from "./constants/contracts";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

configureWeb3Modal();

function App() {
  const { loading, data: proposals } = useProposals();
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const handleVote = async (id) => {
    if (!isSupportedChain(chainId))
      return toast.error("Wrong Network", {
        position: "top-right",
      });
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const contract = getProposalsContract(signer);

    try {
      const transaction = await contract.vote(id);
      console.log("transaction: ", transaction);
      const receipt = await transaction.wait();

      console.log("receipt: ", receipt);

      if (receipt.status) {
        return console.log("vote successfull!");
      }

      console.log("vote failed!");
    } catch (error) {
      console.log(error);
      let errorText;
      if (error.reason === "Has no right to vote") {
        errorText = "You have not right to vote";
      } else if (error.reason === "Already voted.") {
        errorText = "You have already voted";
      } else {
        errorText = "An unknown error occured";
      }

      toast.error(errorText, {
        position: "top-right",
      });
    }
  };

  return (
    <Container>
      <Header />
      <main className="mt-6">
        <Box mb="4">
          <DelegateVote />
        </Box>

        <Flex wrap={"wrap"} gap={"6"}>
          {loading ? (
            <Text>Loading...</Text>
          ) : proposals.length !== 0 ? (
            proposals.map((item, index) => (
              <Proposal
                key={index}
                name={item.name}
                handleVote={handleVote}
                id={index}
                voteCount={Number(item.voteCount)}
              />
            ))
          ) : (
            <Text>Could not get proposals!!</Text>
          )}
        </Flex>
      </main>
      <ToastContainer />
    </Container>
  );
}

export default App;

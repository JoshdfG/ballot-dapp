// Importing necessary components and hooks
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import useGiveRightToVote from "../hooks/useGiveRightToVote";

const GiveRightToVoteComponent = () => {
  const [address, setAddress] = useState("");

  const handleGiveRightToVote = useGiveRightToVote(address);

  return (
    // Using Dialog component for creating a modal or dialog box
    <Dialog.Root>
      {/*This opens the dialog box when clicked*/}
      <Dialog.Trigger as={Button}>
        <button className="bg-blue-600 px-6 py-1.5 text-white rounded-md">
          Add Voter
        </button>
      </Dialog.Trigger>

      {/*This is the content of the dialog box*/}
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Give right to vote
        </Dialog.Description>

        <Flex direction="column" gap="3">
          {/* The label and input field for capturing voter's address */}
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Voter&apos;s Address
            </Text>
            <TextField.Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Voter's Address"
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          {/* Following two buttons close the dialog and trigger the voting rights action respectively */}
          <Dialog.Close as={Button} variant="soft" color="gray">
            Cancel
          </Dialog.Close>
          <Button className="bg-blue-600" onClick={handleGiveRightToVote}>
            Add voter
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default GiveRightToVoteComponent;

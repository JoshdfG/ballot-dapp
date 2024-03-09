import { useState } from "react";
import { Box, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import useDelegate from "../hooks/useDelegate";

const DelegateVote = () => {
  const [delegateToAddress, setDelegateToAddress] = useState("");
  const delegate = useDelegate(delegateToAddress);

  const handleChange = (e) => {
    setDelegateToAddress(e.target.value);
  };

  const handleDelegateClick = async () => {
    await delegate();
    setDelegateToAddress(""); // Clear the input after delegation
  };

  return (
    <Card size="2" style={{ width: 425 }}>
      <Flex gap="" align="center">
        <Box width={"100%"}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Delegate&apos;s Address
              </Text>
              <TextField.Input
                placeholder="Enter Delegate's Address"
                value={delegateToAddress}
                onChange={handleChange}
              />
            </label>
            <Button onClick={handleDelegateClick}>Delegate vote</Button>
          </Flex>
        </Box>
      </Flex>
    </Card>
  );
};

export default DelegateVote;

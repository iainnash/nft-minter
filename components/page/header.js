import React, { useContext } from "react";
import { Text, Heading, Center, Image, Select } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/button";
import { FiSun, FiMoon } from "react-icons/fi";
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import { Box, Flex, LinkBox, LinkOverlay } from "@chakra-ui/layout";

import { useWeb3 } from "../../contexts/useWeb3";
import { useRouter } from "next/router";
import UserAddress from "./wallet";
import { NetworkContext } from "../../contexts/NetworkContext";

const Header = () => {
  const router = useRouter();
  const { account, balance } = useWeb3();
  const { colorMode, toggleColorMode } = useColorMode();
  const {networkId} = useContext(NetworkContext);

  const isDarkMode = colorMode === "dark";
  const buttonHoverBgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Center>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        py={4}
        w="100%"
        maxW={{ base: "100%", md: 1440 }}
      >
        {/* Hardcoded 283 for now to center user wallet component */}
        <LinkBox width={["auto", "auto", 100]}>
          <LinkOverlay
            sx={{ cursor: "pointer" }}
            onClick={() => router.push(`/?network=${networkId}`)}
          >
            <Flex alignItems="center">
              <Image src="/herb.png" w="30px" mr="1" />
              <Heading size="md">
                <Text
                  color="gray.400"
                  sx={{ display: "inline", fontSize: "0.75em" }}
                >
                  {networkId === 1 && '[mainnet]'}
                  {networkId === 137 && '[polygon]'}
                  {networkId === 80001 && '[mumbai]'}
                  {networkId === 4 && '[rinkeby]'}
                </Text>{" "}
                Minter
              </Heading>
            </Flex>
          </LinkOverlay>
        </LinkBox>
        <Box>
          <IconButton
            mr={2}
            borderRadius="lg"
            variant="ghost"
            onClick={toggleColorMode}
            icon={isDarkMode ? <FiMoon /> : <FiSun />}
            aria-label={isDarkMode ? "Toggle light mode" : "Toggle dark mode"}
            _hover={{ background: buttonHoverBgColor }}
          />
          <UserAddress />
        </Box>
      </Flex>
    </Center>
  );
};

export default Header;

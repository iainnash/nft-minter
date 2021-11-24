import { Link, Flex, Box, Image, Badge } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/color-mode";

import { normalizeIpfsHash } from "../../utils/helpers";
import useWeb3 from "../../contexts/useWeb3";

const Card = (data, account) => {
  const { name, symbol, address, editionSize, owner, URIs, id } = data;

  const content = (
    <Box
      key={address}
      bg={useColorModeValue("white", "gray.800")}
      w="fit-content"
      maxW="sm"
      _hover={{ textDecoration: "none" }}
      borderWidth="1px"
      rounded="lg"
      shadow="lg"
    >
      <Flex w="300px" h="300px" justifyContent="center" alignItems="center">
        <Image
          maxW={300}
          maxH={300}
          src={normalizeIpfsHash(URIs[0])}
          roundedTop="lg"
        />
      </Flex>

      <Box p="6" w="fit-content">
        <Box d="flex" alignItems="baseline">
          <Badge rounded="full" px="2" colorScheme="teal">
            ${symbol}
          </Badge>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            EDITION OF {editionSize}
          </Box>
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {name}
        </Box>

        <Box>
          Owner: {owner.slice(0, 8) + "..." + owner.slice(owner.length - 3, -1)}{" "}
          {owner === account && (
            <Badge rounded="full" px="2" colorScheme="green">
              You
            </Badge>
          )}
        </Box>
      </Box>
    </Box>
  );

  if (!id) {
    return content;
  }

  return (
    <Link sx={{ _hover: { textDecoration: "none" } }} href={`/manage/${id}`}>
      {content}
    </Link>
  );
};

export default Card;

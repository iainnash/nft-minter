import { Flex, Box, chakra, HStack, Button } from "@chakra-ui/react"
import { useColorModeValue } from "@chakra-ui/color-mode"
import { useRouter } from "next/router"
const Hero = ({}) => {
  const router = useRouter()
  return (
    <Box w={{ base: 8 / 12, xl: 5 / 12 }}>
      <chakra.p
        mb={2}
        fontSize="xs"
        fontWeight="semibold"
        letterSpacing="wide"
        color="gray.400"
        textTransform="uppercase"
      >
        Artists welcome
      </chakra.p>
      <chakra.h1
        mb={3}
        fontSize={{ base: "3xl", md: "4xl" }}
        fontWeight="bold"
        lineHeight="shorter"
        color={useColorModeValue("gray.900", "white")}
      >
        Mint your own NFTs
      </chakra.h1>
      <chakra.p mb={5} color="gray.500" fontSize={{ md: "lg" }}>
        {`Create your own standalone 1-of-N NFT projects with this simple NFT
          minter. Built using ZORA Protocol's 'nft-editions' contracts, you'll
          have a flexible, standalone & gas optimized NFT project.`}
      </chakra.p>
      <HStack>
        <Button
          as="a"
          w={{ base: "full", sm: "auto" }}
          variant="solid"
          colorScheme="blue"
          size="lg"
          mb={{ base: 2, sm: 0 }}
          cursor="pointer"
          onClick={() => router.push("/mint")}
        >
          Mint an edition
        </Button>
        <Button
          as="a"
          w={{ base: "full", sm: "auto" }}
          mb={{ base: 2, sm: 0 }}
          size="lg"
          cursor="pointer"
          href="https://github.com/ourzora/nft-editions"
          target="_blank"
        >
          Learn more
        </Button>
      </HStack>
    </Box>
  )
}
export default Hero

import { Flex, Box, chakra, HStack, Button } from "@chakra-ui/react"
import { useColorModeValue } from "@chakra-ui/color-mode"
import { useRouter } from "next/router"
const ManageHero = ({}) => {
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
        Manage your Edition NFTs
      </chakra.h1>
      <chakra.p mb={5} color="gray.500" fontSize={{ md: "lg" }}>
        Sell your own editions for a fixed price of Ether with Zora.
      </chakra.p>
      <chakra.p mb={5} color="gray.500" fontSize={{ md: "lg" }}>
        Mint your edition directly to wallets.
      </chakra.p>
    </Box>
  )
}
export default ManageHero

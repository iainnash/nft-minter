import Card from "../../components/card";
import useWeb3 from "../../contexts/useWeb3";
import {
  Flex,
  Box,
  Heading,
  Stat,
  StatNumber,
  List,
  ListItem,
  Center,
  Button,
  StatGroup,
  StatLabel,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Page from "../../components/page";
import { fetchCollectionAtAddress } from "../../utils/zora";
import { ethers } from "ethers";
import PurchaseHero from "../../components/purchase";
import { useNFTIndexerQuery, NFTFetchConfiguration } from "@zoralabs/nft-hooks";
import { chainID } from "../../utils/ethers";
import { purchaseEdition } from "../../utils/zora";
import { AddressView } from "../../components/address";

const PurchaseList = ({ address }) => {
  const purchaseList = useNFTIndexerQuery({
    collectionAddresses: [address],
  });
  const dateFormatter = new Intl.DateTimeFormat('en-US', {dateStyle: 'medium', timeStyle: 'short'});
  return (
    <Box>
      <List>
        {purchaseList.results?.map((result) => (
          <ListItem>
            Minted by <em><AddressView address={result.minter} /></em> at{" "}
            {dateFormatter.format(new Date(result.mintTransferEvent.blockTimestamp))}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const Purchase = () => {
  const { account, networkId } = useWeb3();
  const router = useRouter();
  const [collection, setCollection] = useState();

  useEffect(async () => {
    if (router.isReady) {
      const data = await fetchCollectionAtAddress(router.query.address);
      setCollection(data);
    }
  }, [router.isReady]);

  const purchase = async () => {
    await purchaseEdition(collection?.address, collection?.salePrice);
  };

  return (
    <Page>
      <Head>
        <title>Manage Edition</title>
        <link rel="icon" href="/herb.png" />
      </Head>
      <PurchaseHero />
      <Center>
        <Flex
          flexDirection="column"
          w="100%"
          maxW={{ base: "100%", md: 1440 }}
          mt={4}
          alignItems="flex-start"
        >
          <Flex flexDirection="column">
            <Heading size="md" mb="4">
              Purchase Edition
            </Heading>

            {collection && Card(collection, account)}

            <Box mt={8} mb={2}>
              <Button onClick={() => purchase()} colorScheme="green">
                Purchase one Edition
              </Button>
            </Box>

            <StatGroup my={6}>
              <Stat>
                <StatLabel>Number minted</StatLabel>
                <StatNumber>{collection?.numberMinted.toString()}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Number of editions</StatLabel>
                <StatNumber>{collection?.editionSize.toString()}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Sale price</StatLabel>
                <StatNumber>
                  {collection?.salePrice &&
                  collection?.salePrice.toString() !== "0"
                    ? ethers.utils.formatEther(collection?.salePrice)
                    : "Not for sale"}{" "}
                  eth
                </StatNumber>
              </Stat>
            </StatGroup>
            <NFTFetchConfiguration networkId={chainID}>
              {collection?.address && (
                <PurchaseList address={collection.address} />
              )}
            </NFTFetchConfiguration>
          </Flex>
        </Flex>
      </Center>
    </Page>
  );
};

export default Purchase;

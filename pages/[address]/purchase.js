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
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Page from "../../components/page";
import { fetchCollectionAtAddress } from "../../utils/zora";
import { ethers } from "ethers";
import useAlerts from "../../contexts/useAlerts";
import PurchaseHero from "../../components/purchase";
import { useNFTIndexerQuery, NFTFetchConfiguration } from "@zoralabs/nft-hooks";
import { chainID } from "../../utils/ethers";
import { purchaseEdition } from "../../utils/zora";
import { AddressView } from "../../components/address";
import { NetworkContext } from "../../contexts/NetworkContext";

const PurchaseList = ({ address }) => {
  const purchaseList = useNFTIndexerQuery({
    collectionAddresses: [address],
  });
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return (
    <Box>
      <List>
        {purchaseList.results?.map((result) => (
          <ListItem key={result.mintTransferEvent.transactionHash}>
            Minted to{" "}
            <em>
              <AddressView address={result.minter} />
            </em>{" "}
            at{" "}
            {dateFormatter.format(
              new Date(result.mintTransferEvent.blockTimestamp)
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const Purchase = () => {
  const { account } = useWeb3();
  const { watchTx } = useAlerts();
  const router = useRouter();
  const [collection, setCollection] = useState();
  const {networkId} = useContext(NetworkContext);
  const fetchData = useCallback(async () => {
    const data = await fetchCollectionAtAddress(router.query.address, networkId);
    setCollection(data);
  }, [fetchCollectionAtAddress, setCollection, router.query.address]);

  useEffect(async () => {
    if (router.isReady) {
      fetchData();
    }
  }, [router]);

  const purchase = async () => {
    const response = await purchaseEdition(
      collection?.address,
      collection?.salePrice
    );
    watchTx(response.hash, "Purchasing Edition").then((data) => fetchData());
  };

  const saleIsActive = collection?.salePrice.toString() !== "0";

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
          // maxW={{ base: "100%", md: 1440 }}
          mt={4}
          alignItems="flex-start"
        >
          <Flex flexDirection="column">
            <Heading size="md" mb="4">
              Purchase Edition
            </Heading>

            {collection && Card(collection, account)}

            <Box mt={8} mb={2}>
              <Button
                disabled={!saleIsActive}
                onClick={() => purchase()}
                colorScheme="green"
              >
                {saleIsActive ? "Purchase one Edition" : "Sale inactive"}
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
            </StatGroup>
            <StatGroup mb={10}>

              <Stat>
                <StatLabel>Sale price</StatLabel>
                <StatNumber>
                  {collection?.salePrice &&
                  collection?.salePrice.toString() !== "0"
                    ? `${ethers.utils.formatEther(collection?.salePrice)} eth`
                    : "Not for sale"}
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


export async function getServerSideProps({ query, req, res }) {
  const network = query.network || '1';

  return {
    props: {network, networkId: parseInt(network, 10)},
  }
}
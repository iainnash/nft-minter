import React, { useEffect, useState } from "react";
import { Grid, Divider, Flex } from "@chakra-ui/react";
import { Box, Heading, Text, Center, Link } from "@chakra-ui/layout";
import { Alert } from "@chakra-ui/alert";
import { Button, IconButton } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { useWeb3 } from "../contexts/useWeb3";
import { fetchCollections } from "../utils/zora";

import { useRouter } from "next/router";

import Head from "next/head";
import Page from "../components/page";
import Card from "../components/card";
import Hero from "../components/hero";

export default function Home({collections}) {
  const router = useRouter();
  const { web3, connectWallet, disconnectWallet, account, balance } = useWeb3();
  // const [collections, setCollections] = useState([]);
  const cardBgColor = useColorModeValue("white", "gray.700");
  const alertBgColor = useColorModeValue("gray.50", "gray.600");

  // useEffect(async () => {
  //   const data = await fetchCollections();
  //   console.log(data);
  //   setCollections(data);
  // }, []);

  return (
    <Page>
      <Head>
        <title>Minter</title>
        <link rel="icon" href="/herb.png" />
      </Head>
      <Center>
        <Flex
          flexDirection="column"
          w="100%"
          maxW={{ base: "100%", md: 1440 }}
          mt={{ base: 10, md: 20 }}
          alignItems="flex-start"
        >
          <Hero />
          <Flex flexDirection="column" mt={{ base: 8, md: 16 }}>
            <Heading size="md" mb="4">
              Minted Editions
            </Heading>
            <Grid templateColumns="repeat(3, max(300px))" gridGap="4">
              {collections[0] && collections.map((item) => Card(item, account))}
            </Grid>
          </Flex>
        </Flex>
      </Center>
    </Page>
  );
}

export async function getServerSideProps({ req, res }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=120, stale-while-revalidate=129'
  )

  return {
    props: {collections: await fetchCollections()},
  }
}
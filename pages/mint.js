import React, { useEffect, useState } from "react";
import {
  Grid,
  Divider,
  Flex,
  Box,
  Heading,
  Text,
  Center,
  Image,
  Input,
  InputRightAddon,
  InputGroup,
  Textarea,
  CloseButton,
  Button,
  FormControl,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  FormLabel,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { useWeb3 } from "../contexts/useWeb3";
import { mintEdition } from "../utils/zora";

import { useAlerts } from "../contexts/useAlerts";
import { useRouter } from "next/router";
import { FileUploader } from "../components/fileuploader";

import Head from "next/head";
import Page from "../components/page";
import { generateSHA256FileHash } from "../utils/hash";

function escapeJsonString(json) {
  return JSON.stringify(json).slice(1, -1);
}

export default function Home({ networkId }) {
  const router = useRouter();
  const { addAlert, watchTx } = useAlerts();
  const { web3Ethers } = useWeb3();

  const cardBgColor = useColorModeValue("white", "gray.700");

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [desc, setDesc] = useState("");
  const [edition, setEdition] = useState("");
  const [royalty, setRoyalty] = useState("");

  const [animationFile, setAnimationFile] = useState(undefined);
  const [imageFile, setImageFile] = useState(undefined);

  const validateInfo = () => {
    if (name === "") return true;
    return false;
  };

  const mint = async () => {
    if (!imageFile) {
      throw new Error("no image");
    }
    console.log({ imageFile, animationFile });
    const animURL = animationFile ? animationFile.url : "";
    const animHash =
      animationFile && animationFile.file
        ? await generateSHA256FileHash(animationFile.file)
        : "0x0000000000000000000000000000000000000000000000000000000000000000";
    const imgURL = imageFile.url;
    const imgHash = imageFile.file
      ? await generateSHA256FileHash(imageFile.file)
      : "0x0000000000000000000000000000000000000000000000000000000000000000";

    console.log({
      animURL,
      animHash,
      imgURL,
      imgHash,
      royalty,
      edition,
    });

    const response = await mintEdition(web3Ethers, {
      name: escapeJsonString(name),
      symbol,
      desc: escapeJsonString(desc),
      animURL,
      animHash,
      imgURL,
      imgHash,
      edition,
      royalty: royalty * 100,
    });
    watchTx(response.hash, "Minting Editions").then((data) =>
      router.push(`/?network=${networkId}`)
    );
  };

  return (
    <Page>
      <Head>
        <title>Mint an Edition - Minter</title>
        <link rel="icon" href="/herb.png" />
      </Head>

      <Flex
        flexDirection="column"
        w="100%"
        maxW={{ base: "100%", md: 800 }}
        mt={{ base: 10, md: 20 }}
        alignItems="flex-start"
      >
        <Heading size="lg" color="gray.700">
          Mint a new edition
        </Heading>
        <Text mt="2" color="gray.600">
          Fill out the details below to configure a new edition. These details
          will then be used to create a new contract specifically for your NFTs.
          These can then be minted directly by you or this app can be used to
          provide a minting interface for your friends!
        </Text>

        <Box
          mt="5"
          w="100%"
          bg={cardBgColor}
          shadow="xl"
          borderRadius="2xl"
          p={8}
        >
          <Heading size="md" mb="2">
            NFT Edition Information
          </Heading>
          <FormControl
            id="name"
            my={2}
            onChange={(e) => setName(e.target.value)}
          >
            <FormLabel>Name:</FormLabel>
            <Input
              placeholder="eg. Tanzanian Turtles"
              isRequired={true}
              value={name}
            />
          </FormControl>
          <FormControl
            onChange={(e) => setSymbol(e.target.value.toString().toUpperCase())}
            my={2}
            id="symbol"
          >
            <FormLabel>Symbol: </FormLabel>
            <Input placeholder="eg. TURTL" isRequired={true} value={symbol} />
          </FormControl>
          <FormControl
            id="description"
            onChange={(e) => setDesc(e.target.value)}
            my={2}
          >
            <FormLabel>Description:</FormLabel>
            <Textarea
              placeholder="eg. Tanzanian Turtles is your ticket to the...."
              value={desc}
            />
          </FormControl>
          <FormControl
            id="edition"
            onChange={(e) => setEdition(e.target.value)}
            my={2}
          >
            <FormLabel>Edition Size:</FormLabel>
            <NumberInput value={edition} min={1}>
              <NumberInputField placeholder="eg. 100" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl
            id="royalty"
            onChange={(e) => setRoyalty(e.target.value)}
            my={2}
          >
            <FormLabel>Sale Royalty Percent:</FormLabel>
            <NumberInput min={1} max={50}>
              <NumberInputField placeholder="eg. 10" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </Box>
        <FileUploader
          description="An image or image preview of the NFT. Needs to be an image file type and should be added to all NFTs."
          title="Image"
          accept="image/*"
          onUpload={setImageFile}
        />
        <FileUploader
          description="Optional: Add your media file here for the NFT: mp3 or wav audio file, mp4 or mov video file, 3d gltf file, and html webpages are supported."
          title="Animation"
          onUpload={setAnimationFile}
        />
        <Flex mt="3" justifyContent="space-between">
          <Button
            isDisabled={validateInfo()}
            onClick={() => mint(networkId)}
            colorScheme="green"
          >
            Mint NFT Edition
          </Button>
        </Flex>
      </Flex>
    </Page>
  );
}

export async function getServerSideProps({ query, req, res }) {
  const network = query.network || "1";

  return {
    props: { network, networkId: parseInt(network, 10) },
  };
}

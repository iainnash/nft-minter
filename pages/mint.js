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
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { useWeb3 } from "../contexts/useWeb3";
import { mintEdition } from "../utils/zora";

import { useAlerts } from "../contexts/useAlerts";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import { bytesToSize } from "../utils/helpers";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEYyODEzMDVkN0YzOTU1ODJkMDNGNGMzOUZhODg5ODZjNzZGMTRDMTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMTgzMzg2Njg4NSwibmFtZSI6Ikxld2lzIn0._s5gV6xaMSinAfqQWfqqkJwX_InW8v_g21ozomLf8D4";

import Head from "next/head";
import Page from "../components/page";
import { generateSHA256FileHash } from "../utils/hash";

export default function Home() {
  const router = useRouter();
  const { addAlert, watchTx } = useAlerts();
  const [files, setFiles] = useState([]);
  const { acceptedFiles, getRootProps, fileRejections, getInputProps } =
    useDropzone({
      accept: "image/*",
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
      },
    });
  const {
    acceptedFiles: acceptedMediaFiles,
    getRootProps: getRootMediaProps,
    fileRejections: fileMediaRejections,
    getInputProps: getInputMediaProps,
  } = useDropzone({
    accept: "*/*",
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });
  const cardBgColor = useColorModeValue("white", "gray.700");

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [desc, setDesc] = useState("");
  const [edition, setEdition] = useState("");
  const [royalty, setRoyalty] = useState("");
  const [uploading, setUploading] = useState(false);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [fileHash, setFileHash] = useState(false);
  const [fileMediaHash, setFileMediaHash] = useState(false);

  useEffect(() => {
    if (fileRejections[0]) {
      addAlert(
        "fail",
        fileRejections[fileRejections.length - 1].errors[0].message
      );
    }
  }, [fileRejections]);

  useEffect(() => {
    if (fileMediaRejections[0]) {
      addAlert(
        "fail",
        fileMediaRejections[fileRejections.length - 1].errors[0].message
      );
    }
  }, [fileMediaRejections]);

  useEffect(async () => {
    if (acceptedFiles[0]) {
      console.log(acceptedFiles[acceptedFiles.length - 1]);
      setUploading(true);

      // var data = new FormData();
      // data.append("file", acceptedFiles[acceptedFiles.length - 1]);

      const image = await fetch("https://api.nft.storage/upload", {
        method: "POST",
        headers: new Headers({ Authorization: `Bearer ${token}` }),
        body: acceptedFiles[acceptedFiles.length - 1],
      }).then((res) => res.json());
      console.log(image);
      setFileHash(image.value.cid);
      setUploading(false);
      console.log(image);
    }
  }, [acceptedFiles]);

  useEffect(async () => {
    if (acceptedMediaFiles[0]) {
      console.log(acceptedMediaFiles[acceptedMediaFiles.length - 1]);
      setUploading(true);

      // var data = new FormData();
      // const lastFile = acceptedMediaFiles[acceptedFiles.length - 1];
      // data.append("file", lastFile);

      const image = await fetch("https://api.nft.storage/upload", {
        method: "POST",
        headers: new Headers({ Authorization: `Bearer ${token}` }),
        body: acceptedMediaFiles[acceptedMediaFiles.length - 1],
      }).then((res) => res.json());
      setFileMediaHash(image.value.cid);
      setMediaUploading(false);
      console.log(image);
    }
  }, [acceptedFiles]);

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const validateInfo = () => {
    if (name === "") return true;
    return false;
  };

  const mint = async () => {
    const animURL = fileMediaHash ? `ipfs://${fileMediaHash}` : "";
    const animHash = acceptedMediaFiles.length
      ? await generateSHA256FileHash(
          acceptedMediaFiles[acceptedMediaFiles.length - 1]
        )
      : "0x0000000000000000000000000000000000000000000000000000000000000000";
    const imgURL = `ipfs://${fileHash}`;
    const imgHash = await generateSHA256FileHash(
      acceptedFiles[acceptedFiles.length - 1]
    );

    console.log({
      animURL,
      animHash,
      imgURL,
      imgHash,
      royalty,
      edition,
    });

    const response = await mintEdition({
      name,
      symbol,
      desc,
      animURL,
      animHash,
      imgURL,
      imgHash,
      edition,
      royalty: royalty * 1000,
    });
    watchTx(response.hash, "Minting Editions").then((data) => router.push("/"));
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
        <Box
          mt="5"
          w="100%"
          bg={cardBgColor}
          shadow="xl"
          borderRadius="2xl"
          p={8}
        >
          <Flex alignItems="center" justifyContent="space-between" mb="2">
            <Heading size="md">Image</Heading>
            {uploading || fileHash ? (
              <CloseButton onClick={() => setFileHash(false)} />
            ) : null}
          </Flex>
          {uploading || fileHash ? (
            <Flex w="full" justifyContent="space-between">
              <Box>
                <Text>
                  <b>File:</b> {files[acceptedFiles.length - 1].path}{" "}
                </Text>
                <Text>
                  <b>Size:</b>{" "}
                  {bytesToSize(files[acceptedFiles.length - 1].size)}
                </Text>
                <Text>
                  <b>Status:</b>{" "}
                  {uploading ? (
                    "Uploading..."
                  ) : (
                    <Link
                      href={`https://${fileHash}.ipfs.dweb.link/`}
                      isExternal
                    >
                      Uploaded <ExternalLinkIcon mx="2px" />
                    </Link>
                  )}{" "}
                </Text>{" "}
              </Box>
              <Image src={files[acceptedFiles.length - 1].preview} maxW={350} />
            </Flex>
          ) : (
            <Box
              as={"div"}
              w="100%"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "60px 20px",
                borderWidth: 2,
                borderRadius: 2,
                borderColor: "#eeeeee",
                borderStyle: "dashed",
                backgroundColor: "#fafafa",
                color: "#bdbdbd",
                outline: "none",
                transition: "border .24s ease-in-out",
              }}
              {...getRootProps({ className: "dropzone" })}
            >
              <input {...getInputProps()} />
              <p>{`Drag 'n' drop a file here, or click to select a file`}</p>
            </Box>
          )}
        </Box>
        <Box
          mt="5"
          w="100%"
          bg={cardBgColor}
          shadow="xl"
          borderRadius="2xl"
          p={8}
        >
          <Flex alignItems="center" justifyContent="space-between" mb="2">
            <Heading size="md">Animation</Heading>
            {mediaUploading || fileMediaHash ? (
              <CloseButton onClick={() => setFileMediaHash(false)} />
            ) : null}
          </Flex>
          {mediaUploading || fileMediaHash ? (
            <Flex w="full" justifyContent="space-between">
              <Box>
                <Text>
                  <b>File:</b>{" "}
                  {acceptedMediaFiles[acceptedMediaFiles.length - 1].path}{" "}
                </Text>
                <Text>
                  <b>Size:</b>{" "}
                  {bytesToSize(
                    acceptedMediaFiles[acceptedMediaFiles.length - 1].size
                  )}
                </Text>
                <Text>
                  <b>Status:</b>{" "}
                  {mediaUploading ? (
                    "Uploading..."
                  ) : (
                    <Link
                      href={`https://${fileMediaHash}.ipfs.dweb.link/`}
                      isExternal
                    >
                      Uploaded <ExternalLinkIcon mx="2px" />
                    </Link>
                  )}{" "}
                </Text>{" "}
              </Box>
              <Image
                src={acceptedMediaFiles[acceptedMediaFiles.length - 1].preview}
                maxW={350}
              />
            </Flex>
          ) : (
            <Box
              as={"div"}
              w="100%"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "60px 20px",
                borderWidth: 2,
                borderRadius: 2,
                borderColor: "#eeeeee",
                borderStyle: "dashed",
                backgroundColor: "#fafafa",
                color: "#bdbdbd",
                outline: "none",
                transition: "border .24s ease-in-out",
              }}
              {...getRootProps({ className: "dropzone" })}
            >
              <input {...getInputProps()} />
              <p>{`Drag 'n' drop a file here, or click to select a file`}</p>
            </Box>
          )}
        </Box>
        <Flex mt="3" justifyContent="space-between">
          <Button
            isDisabled={validateInfo()}
            onClick={() => mint()}
            colorScheme="green"
          >
            Mint NFT Edition
          </Button>
        </Flex>
      </Flex>
    </Page>
  );
}

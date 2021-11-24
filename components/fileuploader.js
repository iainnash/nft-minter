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

import { useAlerts } from "../contexts/useAlerts";
import { useDropzone } from "react-dropzone";
import { bytesToSize } from "../utils/helpers";

export const FileUploader = ({ onUpload, title, accept = undefined }) => {
  const token = process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN;
  const cardBgColor = useColorModeValue("white", "gray.700");

  const { acceptedFiles, getRootProps, fileRejections, getInputProps } =
    useDropzone({
      accept,
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

  const { addAlert, watchTx } = useAlerts();
  const [fileHash, setFileHash] = useState();
  const [uploading, setUploading] = useState();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (files[files.length - 1]) {
      onUpload({ file: files[files.length - 1], hash: fileHash });
    } else {
      onUpload(undefined);
    }
  }, [files, fileHash]);

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  useEffect(() => {
    if (fileRejections[0]) {
      addAlert(
        "fail",
        fileRejections[fileRejections.length - 1].errors[0].message
      );
    }
  }, [fileRejections]);

  useEffect(async () => {
    if (acceptedFiles[0]) {
      setUploading(true);

      // var data = new FormData();
      // data.append("file", acceptedFiles[acceptedFiles.length - 1]);

      const image = await fetch("https://api.nft.storage/upload", {
        method: "POST",
        headers: new Headers({ Authorization: `Bearer ${token}` }),
        body: acceptedFiles[acceptedFiles.length - 1],
      }).then((res) => res.json());
      setFileHash(image.value.cid);
      setUploading(false);
    }
  }, [acceptedFiles]);

  return (
    <Box mt="5" w="100%" bg={cardBgColor} shadow="xl" borderRadius="2xl" p={8}>
      <Flex alignItems="center" justifyContent="space-between" mb="2">
        <Heading size="md">{title}</Heading>
        {uploading || fileHash ? (
          <CloseButton
            onClick={() => {
              setFiles([]);
              setFileHash(undefined);
            }}
          />
        ) : null}
      </Flex>
      {uploading || fileHash ? (
        <Flex w="full" justifyContent="space-between">
          <Box>
            <Text>
              <b>File:</b> {files[acceptedFiles.length - 1].path}{" "}
            </Text>
            <Text>
              <b>Size:</b> {bytesToSize(files[acceptedFiles.length - 1].size)}
            </Text>
            <Text>
              <b>Status:</b>{" "}
              {uploading ? (
                "Uploading..."
              ) : (
                <Link href={`https://${fileHash}.ipfs.dweb.link/`} isExternal>
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
  );
};

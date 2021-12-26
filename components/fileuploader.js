import React, { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Heading,
  Input,
  Text,
  Button,
  Image,
  CloseButton,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useColorModeValue } from "@chakra-ui/color-mode";

import { useAlerts } from "../contexts/useAlerts";
import { useDropzone } from "react-dropzone";
import { bytesToSize } from "../utils/helpers";

export const FileUploader = ({
  onUpload,
  title,
  description,
  accept = undefined,
}) => {
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
  const [fileUrl, setFileUrl] = useState();
  const [uploading, setUploading] = useState();
  const [files, setFiles] = useState([]);

  const lastFile = files[acceptedFiles.length - 1];

  const [urlMode, setUrlMode] = useState(false);

  useEffect(() => {
    if (fileUrl) {
      onUpload({ file: lastFile, url: fileUrl });
    } else {
      onUpload(undefined);
    }
  }, [files, fileUrl]);

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
      console.log(fileUrl);
      setFileUrl(`ipfs://${image.value.cid}`);
      setUploading(false);
    }
  }, [acceptedFiles]);

  return (
    <Box mt="5" w="100%" bg={cardBgColor} shadow="xl" borderRadius="2xl" p={8}>
      <Flex alignItems="center" justifyContent="space-between" mb="2">
        <div>
          <Heading size="md">{title}</Heading>
          {description && <Text>{description}</Text>}
        </div>
        {uploading || fileUrl ? (
          <CloseButton
            onClick={() => {
              setFiles([]);
              setFileUrl(undefined);
            }}
          />
        ) : null}
      </Flex>
      {urlMode && (
        <Box>
          <label style={{ marginBottom: 10 }}>
            <Text>URL to File</Text>
            <Input
              placeholder="URL to file"
              onChange={(e) => setFileUrl(e.target.value)}
              value={fileUrl}
            />
          </label>
          {accept?.startsWith("image") && <Image src={fileUrl} maxW={350} />}
          <div style={{ marginTop: 20 }}>
            <Button
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setUrlMode(false);
              }}
            >
              Upload a file (&lt; 100mb) instead
            </Button>
          </div>
        </Box>
      )}
      {!urlMode && (uploading || fileUrl) ? (
        <Flex w="full" justifyContent="space-between">
          <Box>
            <Text>
              <b>File:</b> {lastFile?.path}{" "}
            </Text>
            <Text>
              <b>Size:</b> {bytesToSize(lastFile?.size)}
            </Text>
            <Text>
              <b>Status:</b>{" "}
              {uploading ? (
                "Uploading..."
              ) : (
                <Link
                  href={fileUrl.replace("ipfs://", "https://ipfs.io/ipfs/")}
                  isExternal
                >
                  Uploaded <ExternalLinkIcon mx="2px" />
                </Link>
              )}{" "}
            </Text>{" "}
          </Box>
          {accept?.startsWith("image") && (
            <Image src={lastFile?.preview} maxW={350} />
          )}
        </Flex>
      ) : (
        !urlMode && (
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
            <br />
            <br />
            <p>
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setUrlMode(true);
                }}
              >
                Use a URL instead
              </Button>
            </p>
          </Box>
        )
      )}
    </Box>
  );
};

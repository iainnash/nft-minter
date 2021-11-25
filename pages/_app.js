import { Web3Provider } from "../contexts/useWeb3";
import { useWallet, UseWalletProvider } from "use-wallet";
import { AlertProvider } from "../contexts/useAlerts";
import { chainID, INFURA_API } from "../utils/ethers";
import { ChakraProvider, CSSReset, extendTheme } from "@chakra-ui/react";

const theme = {
  styles: {
    global: {
      "html, body": {
        minHeight: "100vh",
        fontSize: "sm",
        color: "gray.600",
        lineHeight: "tall",
      },
      a: {
        color: "teal.500",
      },
    },
  },
};

function getUrlFromChainId() {
  if (chainID === 1) {
    return `https://mainnet.infura.io/v3/${INFURA_API}`;
  }
  if (chainID === 4) {
    return `https://rinkeby.infura.io/v3/${INFURA_API}`;
  }
}

export default function App({ Component, pageProps }) {
  const rpcUrl = getUrlFromChainId(chainID);
  console.log(rpcUrl);

  return (
    <ChakraProvider theme={extendTheme({ theme })}>
      <CSSReset />
      <UseWalletProvider
        chainId={chainID}
        connectors={{
          walletconnect: { rpcUrl },
          walletlink: { url: rpcUrl },
        }}
      >
        <AlertProvider>
          <Web3Provider>
            <Component {...pageProps} />
          </Web3Provider>
        </AlertProvider>
      </UseWalletProvider>
    </ChakraProvider>
  );
}

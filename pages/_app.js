import { Web3Provider } from "../contexts/useWeb3";
import { useWallet, UseWalletProvider } from "use-wallet";
import { useState, useContext } from "react";
import { AlertProvider } from "../contexts/useAlerts";
import { chainID, INFURA_API } from "../utils/ethers";
import { ChakraProvider, CSSReset, extendTheme } from "@chakra-ui/react";
import { NetworkContext } from "../contexts/NetworkContext";
import { getUrlFromChainId } from "../utils/getUrlChainId";

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

const AppWallet = ({ Component, pageProps }) => {
  const { networkId } = useContext(NetworkContext);
  const rpcUrl = getUrlFromChainId(networkId);
  return (
    <UseWalletProvider
      chainId={networkId}
      connectors={{
        walletconnect: { rpcUrl },
        walletlink: { url: rpcUrl },
      }}
    >
      <Web3Provider>
        <AlertProvider>
          <Component {...pageProps} />
        </AlertProvider>
      </Web3Provider>
    </UseWalletProvider>
  );
};

export default function App({ Component, pageProps }) {
  const [networkId] = useState(pageProps.networkId || 1);

  const setNetworkId = (newId) => {
    window.location.href = `/?network=${newId}`;
  };

  return (
    <NetworkContext.Provider value={{ networkId, setNetworkId }}>
      <ChakraProvider theme={extendTheme({ theme })}>
        <CSSReset />
        <AppWallet Component={Component} pageProps={pageProps} />
      </ChakraProvider>
    </NetworkContext.Provider>
  );
}

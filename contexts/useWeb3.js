import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { ethers } from "ethers";

import { useWallet } from "use-wallet";
import { web3, registerProvider } from "../utils/ethers";

import useLocalStorage from "../hooks/useLocalStorage";
const atob = (a) => Buffer.from(a, "base64").toString("binary");

// Create Context
export const UseWeb3Context = createContext();

export const Web3Provider = (props) => {
  const { account, connect, status, ethereum, reset, balance } = useWallet();
  // Remember provider preference
  const [provider, setProvider] = useLocalStorage("provider", false);
  const [web3Ethers, setWeb3Ethers] = useState(undefined);

  // Connect/Disconnect Wallet
  const connectWallet = async (key) => {
    await connect(key);
    setProvider(key);
    registerProvider(ethereum);
    if (ethereum) {
      setWeb3Ethers(new ethers.providers.Web3Provider(ethereum));
    }
  };
  const disconnectWallet = () => {
    reset();
    setProvider(false);
  };

  // Check to see if we've set a provider in local Storage and connect
  const initProvider = async () => {
    if (provider) {
      console.log("Provider Found:", provider);
      registerProvider(ethereum);
      if (ethereum) {
        setWeb3Ethers(new ethers.providers.Web3Provider(ethereum));
      }
      await connect(provider);
    }
  };

  // Once we've connected a wallet, switch to wallet provider
  useEffect(async () => {
    if (status === "connected") {
      registerProvider(ethereum);
      if (ethereum) {
        setWeb3Ethers(new ethers.providers.Web3Provider(ethereum));
      }
      console.log("Connected!");
      if (!account) {
        initProvider();
      }
    }
  }, [status]);

  // Once loaded, initalise the provider
  useEffect(() => {
    initProvider();
  }, []);

  const ethBalance = balance ? balance / 1e18 : 0;

  const tools = useMemo(
    () => ({
      provider,
      setProvider,
      connectWallet,
      disconnectWallet,
      account,
      status,
      web3,
      web3Ethers,
      balance: ethBalance,
      ethereum,
    }),
    [web3, provider, account, status, balance]
  );

  // pass the value in provider and return
  return (
    <UseWeb3Context.Provider
      value={{
        tools,
      }}
    >
      {props.children}
    </UseWeb3Context.Provider>
  );
};

export function useWeb3() {
  const web3Context = useContext(UseWeb3Context);
  if (web3Context === null) {
    throw new Error(
      "useWeb3() can only be used inside of <UseToolsProvider />, " +
        "please declare it at a higher level."
    );
  }
  const { tools } = web3Context;

  return useMemo(() => ({ ...tools }), [tools]);
}

export default useWeb3;

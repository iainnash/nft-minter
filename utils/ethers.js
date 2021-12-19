import { ethers } from "ethers";
// Set provider for pre-render operations where no wallet is present.
// let provider = new ethers.providers.JsonRpcProvider(atob(ETH_NODE))

export const INFURA_API = process.env.NEXT_PUBLIC_INFURA;
// let web3 = new ethers.providers.InfuraProvider(
//   chainID === 1 ? "homestead" : "rinkeby",
//   INFURA_API
// );

const MaxUint = ethers.constants.MaxUint256;
export const zeroAddress = ethers.constants.AddressZero;

export const registerProvider = (wallet) => {
  if (wallet) {
    console.log("Using Wallet provider");
    try {
      web3 = new ethers.providers.Web3Provider(wallet);
      wallet.on("chainChanged", (_chainId) => window.location.reload());
    } catch (error) {
      console.log(error);
    }
  } else if (window && window.ethereum) {
    console.log("Using Window provider");
    web3 = new ethers.providers.Web3Provider(window.ethereum);
    window.ethereum.on("chainChanged", (_chainId) => window.location.reload());
  }
};

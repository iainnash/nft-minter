export const INFURA_API = process.env.NEXT_PUBLIC_INFURA;
export function getUrlFromChainId(chainId) {
  if (chainId === 1) {
    return `https://mainnet.infura.io/v3/${INFURA_API}`;
  }
  if (chainId === 4) {
    return `https://rinkeby.infura.io/v3/${INFURA_API}`;
  }
  if (chainId === 80001) {
    return `https://rpc-mumbai.maticvigil.com/v1/f5e47f6b0a608ade77d739e52746cb08d6791305`;
  }
  if (chainId === 137) {
    return `https://polygon-rpc.com/`;
  }
}

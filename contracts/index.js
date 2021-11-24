import zoraMinterDeployment from "@zoralabs/nft-editions-contracts/deployments/rinkeby/SingleEditionMintableCreator.json";
import zoraNFTDeployment from "@zoralabs/nft-editions-contracts/deployments/rinkeby/SingleEditionMintable.json";

export const zoraMinter = {
  abi: zoraMinterDeployment.abi,
  1: "0x91A8713155758d410DFAc33a63E193AE3E89F909",
  4: "0x85FaDB8Debc0CED38d0647329fC09143d01Af660",
};

export const zoraNFT = {
  abi: zoraNFTDeployment.abi,
};

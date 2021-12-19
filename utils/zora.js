import { ethers, utils } from "ethers";
import { Contract, Provider } from "ethers-multicall";
import { zoraMinter, zoraNFT } from "../contracts";
import { getUrlFromChainId } from "./getUrlChainId";
import {web3 as web3Global}  from './ethers';

export const fetchCollections = async (chainId) => {
  const web3 = new ethers.providers.StaticJsonRpcProvider(
    getUrlFromChainId(chainId),
    chainId
  );

  const minter = new ethers.Contract(zoraMinter[chainId], zoraMinter.abi, web3);

  const editions = [];
  for (let i = 0; i < 100; i++) {
    const edition = await minter.getEditionAtId(i);
    console.log('has edition', edition)
    try {

    const editionPart = await fetchCollectionAtAddress(edition, chainId);
    console.log({owner: editionPart.owner, i});
    if (editionPart.owner === ethers.constants.AddressZero) {
      console.log("stopping at ", i);
      break;
    }
    editions.push(editionPart);
    } catch (e) {
      console.error(e);
      break;
    }
  }
  return editions;
};

export const fetchCollection = async (id, chainId, web3) => {
  const minter = new ethers.Contract(zoraMinter[chainId], zoraMinter.abi, web3);
  const address = await minter.getEditionAtId(id);
  return { ...(await fetchCollectionAtAddress(address, chainId)), id };
};

export const fetchCollectionAtAddress = async (address, chainId) => {
  console.log('fetchcollectionataddress', address, chainId);
  const web3 = new ethers.providers.StaticJsonRpcProvider(
    getUrlFromChainId(chainId),
    chainId
  );
  const ethcallProvider = new Provider(web3);
  await ethcallProvider.init();
  const nftContract = new Contract(address, zoraNFT.abi);

  const contractBalance = ethcallProvider.getEthBalance(address);

  const calls = [
    nftContract.name(),
    nftContract.symbol(),
    nftContract.owner(),
    nftContract.salePrice(),
    nftContract.editionSize(),
    nftContract.getURIs(),
    chainId === 137 ? nftContract.editionSize() : nftContract.totalSupply(),
    contractBalance,
  ];
  const [
    name,
    symbol,
    owner,
    salePrice,
    editionSize,
    URIs,
    numberMinted,
    balance,
  ] = await ethcallProvider.all(calls);

  return {
    name,
    symbol,
    owner,
    salePrice: salePrice.toString(),
    editionSize: editionSize.toString(),
    URIs,
    numberMinted: numberMinted.toString(),
    address,
    balance: balance.toString(),
  };
};

export const setEditionSalesPrice = async (address, price) => {
  const media = new ethers.Contract(address, zoraNFT.abi, web3.getSigner());
  return await media.setSalePrice(price);
};

export const purchaseEdition = async (address, price) => {
  const media = new ethers.Contract(address, zoraNFT.abi, web3.getSigner());
  return await media.purchase({ value: price });
};

export const withdrawMintFunds = async (address) => {
  const media = new ethers.Contract(address, zoraNFT.abi, web3.getSigner());
  return await media.withdraw();
};

export const mintBulkEditions = async (address, addresses) => {
  const media = new ethers.Contract(address, zoraNFT.abi, web3.getSigner());
  return await media.mintEditions(addresses);
};

export const mintEdition = async (data) => {
  const signer = web3Global.getSigner();
  const minter = new ethers.Contract(
    zoraMinter[(await web3Global.getNetwork()).chainId],
    zoraMinter.abi,
    signer
  );
  const response = await minter.createEdition(
    data.name,
    data.symbol,
    data.desc,
    data.animURL,
    data.animHash,
    data.imgURL,
    data.imgHash,
    data.edition,
    data.royalty
  );
  return response;
};

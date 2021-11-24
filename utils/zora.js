import { ethers, utils } from "ethers";
import { Contract, Provider } from "ethers-multicall";
import { zoraMinter, zoraNFT } from "../contracts";
import { web3, chainID } from "./ethers";

export const fetchCollections = async () => {
  const minter = new ethers.Contract(zoraMinter[chainID], zoraMinter.abi, web3);
  const filter = minter.filters.CreatedEdition();
  const ids = await minter.queryFilter(filter);
  const collections = await Promise.all(
    ids.map((item) => fetchCollection(item.args.editionId.toString()))
  );
  return collections;
};

export const fetchCollection = async (id) => {
  const minter = new ethers.Contract(zoraMinter[chainID], zoraMinter.abi, web3);
  const address = await minter.getEditionAtId(id);
  return {...(await fetchCollectionAtAddress(address)), id}
}

export const fetchCollectionAtAddress = async (address) => {
  const ethcallProvider = new Provider(web3);
  await ethcallProvider.init();
  const nftContract = new Contract(address, zoraNFT.abi);

  const contractBalance = ethcallProvider.getEthBalance(address)

  const calls = [
    nftContract.name(),
    nftContract.symbol(),
    nftContract.owner(),
    nftContract.salePrice(),
    nftContract.editionSize(),
    nftContract.getURIs(),
    nftContract.totalSupply(),
    contractBalance,
  ];
  const [name, symbol, owner, salePrice, editionSize, URIs, numberMinted, balance] =
    await ethcallProvider.all(calls);

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
}

export const setEditionSalesPrice = async (address, price) => {
  const media = new ethers.Contract(address, zoraNFT.abi, web3.getSigner());
  return await media.setSalePrice(price);
};

export const purchaseEdition = async (address, price) => {
  const media = new ethers.Contract(address, zoraNFT.abi, web3.getSigner());
  return await media.purchase({value: price});
}

export const withdrawMintFunds = async (address) => {
  const media = new ethers.Contract(address, zoraNFT.abi, web3.getSigner());
  return await media.withdraw();
}

export const mintBulkEditions = async (address, addresses) => {
  const media = new ethers.Contract(address, zoraNFT.abi, web3.getSigner());
  return await media.mintEditions(addresses);
}

export const mintEdition = async (data) => {
  const signer = web3.getSigner();
  const minter = new ethers.Contract(
    zoraMinter[chainID],
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

import { useENSAddress } from "@zoralabs/nft-hooks"

export const AddressView = ({address}) => {
  const ensAddress = useENSAddress(address)
  if (ensAddress.data) {
    return ensAddress.data.name;
  }
  return address.substr(0, 8);
}
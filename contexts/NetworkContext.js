import { createContext } from "react";

export const NetworkContext = createContext({
  networkId: 1,
  setNetworkId: () => {},
});

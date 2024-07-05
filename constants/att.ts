import { Address, Chain } from "viem";
import { baseSepolia } from "viem/chains";
import { wagmiConfig } from "~/config/wagmiConfig";

export const ATT_FACTORY_CONTRACT_ADDRESS: Address = process.env
  .EXPO_PUBLIC_ATT_FACTORY_CONTRACT_ADDRESS as Address;
const ATT_CONTRACT_CHAINID: Number =
  Number(process.env.EXPO_PUBLIC_ATT_CONTRACT_CHAINID) ||
  baseSepolia.id;
export const ATT_CONTRACT_CHAIN: Chain = wagmiConfig.chains.find(
  (chain) => chain.id === ATT_CONTRACT_CHAINID,
) as Chain;

import { Address, Chain } from "viem";
import { getChain } from "~/utils/chain/getChain";
import { DEFAULT_CHAINID } from "./chain";

export const ATT_FACTORY_CONTRACT_ADDRESS: Address = process.env
  .EXPO_PUBLIC_ATT_FACTORY_CONTRACT_ADDRESS as Address;
const ATT_CONTRACT_CHAINID: number = Number(
  process.env.EXPO_PUBLIC_ATT_CONTRACT_CHAINID,
) || DEFAULT_CHAINID;
export const ATT_CONTRACT_CHAIN: Chain = getChain(ATT_CONTRACT_CHAINID);

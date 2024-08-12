import { Address, Chain } from "viem";
import { getChain } from "~/utils/chain/getChain";
import { DEFAULT_CHAINID } from "./chain";

export const ATT_FACTORY_CONTRACT_ADDRESS: Address = process.env
  .EXPO_PUBLIC_ATT_FACTORY_CONTRACT_ADDRESS as Address;
const ATT_CONTRACT_CHAINID: number = Number(
  process.env.EXPO_PUBLIC_ATT_CONTRACT_CHAINID,
) || DEFAULT_CHAINID;
export const ATT_CONTRACT_CHAIN: Chain = getChain(ATT_CONTRACT_CHAINID);

export const UNISWAP_V3_POOL_FACTORY_CONTRACT_ADDRESS =
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const UNISWAP_V3_QUOTER_CONTRACT_ADDRESS =
  '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
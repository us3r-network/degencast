import { Address } from "viem";
import { useReadContract, useReadContracts } from "wagmi";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import ATT_CONTRACT_ABI_JSON from "~/services/trade/abi/AttentionToken.json";
import { ReadContractReturnType } from "./types";

const chainId = ATT_CONTRACT_CHAIN.id;
const abi = ATT_CONTRACT_ABI_JSON.abi;

export function useATTContractInfo(tokenAddress: Address, tokenId: number) {
  const contract = {
    abi,
    address: tokenAddress,
    chainId,
  };
  const balanceOf = (owner: Address | undefined) => {
    if (!owner) {
      return { data: 0n, status: "error" };
    }
    const { data, status } = useReadContract({
      ...contract,
      functionName: "balanceOf",
      args: [owner],
    });
    return { data: data as bigint, status };
  };

  const getTotalNFTSupply = () => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "getTotalNFTSupply",
    });
    return { data: data as bigint, status };
  };

  const totalSupply = () => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "totalSupply",
    });
    return { data: data as bigint, status };
  };

  const MAX_SUPPLY = () => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "MAX_SUPPLY",
    });
    return { data: data as bigint, status };
  };

  const UNIT = () => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "UNIT",
    });
    return { data: data as bigint, status };
  };

  const nftBalanceOf = (owner: Address | undefined) => {
    if (!owner) {
      return { data: 0n, status: "error" };
    }
    const { data, status } = useReadContract({
      ...contract,
      functionName: "nftBalanceOf",
      args: [owner, BigInt(tokenId)],
    });
    return { data: data ? (data as bigint) : undefined, status };
  };

  return {
    // balanceOf,
    nftBalanceOf,
    // totalSupply,
    // MAX_SUPPLY,
    // UNIT,
    // getTotalNFTSupply,
  };
}

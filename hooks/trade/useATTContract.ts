import { Address } from "viem";
import { useReadContract, useReadContracts } from "wagmi";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import ATT_CONTRACT_ABI_JSON from "~/services/trade/abi/AttentionToken.json";
import { ReadContractReturnType } from "./types";

const chainId = ATT_CONTRACT_CHAIN.id;
const abi = ATT_CONTRACT_ABI_JSON.abi;

export function useATTContractInfo(tokenAddress: Address) {
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

  const getNFTBalance = (owner: Address | undefined) => {
    if (!owner) {
      return { data: undefined, status: "error" };
    }
    const { data, status } = useReadContracts({
      contracts: [
        {
          ...contract,
          functionName: "balanceOf",
          args: [owner],
        },
        {
          ...contract,
          functionName: "UNIT",
        },
      ],
      // query: { enabled: true },
    });
    // console.log("getBalance", data);
    const rawBalance = (data as ReadContractReturnType[])?.[0].result as bigint;
    const unit = (data as ReadContractReturnType[])?.[1].result as bigint;
    const balance = rawBalance && unit ? Number(rawBalance / unit) : undefined;
    return { data: balance, status };
  };

  return {
    // balanceOf,
    getNFTBalance,
    // totalSupply,
    // MAX_SUPPLY,
    // UNIT,
    // getTotalNFTSupply,
  };
}

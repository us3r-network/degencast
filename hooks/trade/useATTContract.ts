import { Address } from "viem";
import {
  useReadContract
} from "wagmi";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import ATT_CONTRACT_ABI_JSON from "~/services/trade/abi/AttentionToken.json";

const chainId = ATT_CONTRACT_CHAIN.id;
const abi = ATT_CONTRACT_ABI_JSON.abi;

export function useATTContractInfo(tokenAddress: Address) {
  const address = tokenAddress;
  const balanceOf = (owner: `0x${string}` | undefined) => {
    if (!owner) {
      return { data: 0n, status: "error" };
    }
    const { data, status } = useReadContract({
      abi,
      address,
      chainId,
      functionName: "balanceOf",
      args: [owner],
    });
    return { data: data as bigint, status };
  };

  const getTotalNFTSupply = () => {
    const { data, status } = useReadContract({
      abi,
      address,
      chainId,
      functionName: "getTotalNFTSupply",
    });
    return { data: data as bigint, status };
  };

  const totalSupply = () => {
    const { data, status } = useReadContract({
      abi,
      address,
      chainId,
      functionName: "totalSupply",
    });
    return { data: data as bigint, status };
  };

  const MAX_SUPPLY = () => {
    const { data, status } = useReadContract({
      abi,
      address,
      chainId,
      functionName: "MAX_SUPPLY",
    });
    return { data: data as bigint, status };
  };

  const UNIT = () => {
    const { data, status } = useReadContract({
      abi,
      address,
      chainId,
      functionName: "UNIT",
    });
    return { data: data as bigint, status };
  };

  return {
    balanceOf,
    totalSupply,
    MAX_SUPPLY,
    UNIT,
    getTotalNFTSupply,
  };
}

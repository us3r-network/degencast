import { Address } from "viem";
import {
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import ATT_CONTRACT_ABI_JSON from "~/services/trade/abi/AttentionToken.json";
import { ERC42069Token } from "~/services/trade/types";

const chainId = ATT_CONTRACT_CHAIN.id;
const abi = ATT_CONTRACT_ABI_JSON.abi;

export function useATTContractInfo(token: ERC42069Token) {
  const contract = {
    abi,
    address: token.contractAddress,
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

  const totalNFTSupply = () => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "totalNFTSupply",
    });
    return { data: data as number, status };
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

  const tokenUnit = () => {
    const { data, status } = useReadContracts({
      contracts: [
        {
          ...contract,
          functionName: "tokenUnit",
        },
        {
          ...contract,
          functionName: "decimals",
        },
      ],
    });
    if (!data || data.length < 2 || !data[0].result || !data[1].result)
      return { data: undefined, status: "error" };
    const tokenUnit =
      (data[0].result as bigint) * 10n ** BigInt(data[1].result as bigint);
    return { data: tokenUnit, status };
  };

  const UNIT = () => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "UNIT",
    });
    return { data: data as bigint, status };
  };

  const uri = () => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "uri",
      args: [BigInt(token.tokenId)],
    });
    return { data: data as string, status };
  };

  const nftBalanceOf = (owner: Address | undefined) => {
    if (!owner) {
      return { data: 0, status: "error" };
    }
    const { data, status } = useReadContract({
      ...contract,
      functionName: "nftBalanceOf",
      args: [owner, BigInt(token.tokenId)],
    });
    return { data: data ? (data as number) : undefined, status };
  };

  const maxTokensPerIdPerUser = () => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "maxTokensPerIdPerUser",
    });
    return { data: data as number, status };
  };

  return {
    // balanceOf,
    uri,
    nftBalanceOf,
    tokenUnit,
    // totalSupply,
    // MAX_SUPPLY,
    // UNIT,
    totalNFTSupply,
    maxTokensPerIdPerUser,
  };
}

export function useATTContractBurn(token: ERC42069Token) {
  const contract = {
    abi,
    address: token.contractAddress,
    chainId,
  };
  const {
    writeContract,
    data: hash,
    isPending: writing,
    error: writeError,
  } = useWriteContract();
  const burn = async (amount: number) => {
    console.log("burnToBlank", token, amount);
    writeContract({
      ...contract,
      functionName: "burnToBlank",
      args: [BigInt(token.tokenId), BigInt(amount)],
    });
  };

  const {
    data: transactionReceipt,
    error: transationError,
    isLoading: waiting,
    isSuccess,
    status,
  } = useWaitForTransactionReceipt({
    hash,
  });
  return {
    burn,
    transactionReceipt,
    status,
    writeError,
    transationError,
    waiting,
    writing,
    isSuccess,
  };
}

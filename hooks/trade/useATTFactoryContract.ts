import { baseSepolia } from "viem/chains";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import ATT_FACTORY_CONTRACT_ABI_JSON from "~/services/trade/abi/AttentionTokenFactory.json";
import {
  ATT_CONTRACT_CHAIN,
  ATT_FACTORY_CONTRACT_ADDRESS,
} from "~/constants/att";
import { Address } from "viem";

const address = ATT_FACTORY_CONTRACT_ADDRESS;
const chainId = ATT_CONTRACT_CHAIN.id;
const abi = ATT_FACTORY_CONTRACT_ABI_JSON.abi;

export function useATTFactoryContractInfo(tokenAddress: Address) {
  const getMintNFTPriceAfterFee = (amount: number = 1) => {
    const { data, status } = useReadContract({
      abi,
      address,
      chainId,
      functionName: "getMintNFTPriceAfterFee",
      args: [tokenAddress, BigInt(amount)],
    });
    console.log("getMintNFTPriceAfterFee", data, status);
    const nftPrice = data ? (data as bigint[])[0] : undefined;
    const adminFee = data ? (data as bigint[])[1] : undefined;
    return { nftPrice, adminFee, status };
  };
  const getBurnNFTPriceAfterFee = (amount: number = 1) => {
    const { data, status } = useReadContract({
      abi,
      address,
      chainId,
      functionName: "getMintNFTPriceAfterFee",
      args: [tokenAddress, BigInt(amount)],
    });
    const nftPrice = data ? (data as bigint[])[0] : undefined;
    const adminFee = data ? (data as bigint[])[1] : undefined;
    return { nftPrice, adminFee, status };
  };

  return {
    getMintNFTPriceAfterFee,
    getBurnNFTPriceAfterFee,
  };
}

export function useATTFactoryContractBuy(tokenAddress: Address) {
  const {
    writeContract,
    data: hash,
    isPending: writing,
    error: writeError,
  } = useWriteContract();
  const {
    data: transactionReceipt,
    error: transationError,
    isLoading: waiting,
    isSuccess,
    status,
  } = useWaitForTransactionReceipt({
    hash,
  });
  const buy = async (amount: number, maxPayment: bigint) => {
    console.log("buy", tokenAddress, amount, maxPayment);
    writeContract({
      address,
      abi,
      chainId,
      functionName: "mintNFT",
      args: [tokenAddress, BigInt(amount), maxPayment],
    });
  };

  return {
    buy,
    transactionReceipt,
    status,
    writeError,
    transationError,
    waiting,
    writing,
    isSuccess,
  };
}

export function useATTFactoryContractSell(tokenAddress: Address) {
  const {
    writeContract,
    data: hash,
    isPending: writing,
    error: writeError,
  } = useWriteContract();

  const sell = async (amount: number) => {
    console.log("sell", tokenAddress, amount);
    writeContract({
      address,
      abi,
      chainId,
      functionName: "burnNFT",
      args: [tokenAddress, BigInt(amount)],
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
    sell,
    transactionReceipt,
    status,
    writeError,
    transationError,
    waiting,
    writing,
    isSuccess,
  };
}

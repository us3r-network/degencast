import { Address } from "viem";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import {
  ATT_CONTRACT_CHAIN,
  ATT_FACTORY_CONTRACT_ADDRESS,
} from "~/constants/att";
import ATT_FACTORY_CONTRACT_ABI_JSON from "~/services/trade/abi/AttentionTokenFactory.json";

const contract = {
  abi: ATT_FACTORY_CONTRACT_ABI_JSON.abi,
  address: ATT_FACTORY_CONTRACT_ADDRESS,
  chainId: ATT_CONTRACT_CHAIN.id,
};

export function useATTFactoryContractInfo(
  tokenAddress: Address,
  tokenId: number,
) {
  const getMintNFTPriceAfterFee = (amount: number = 1) => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "getMintNFTPriceAfterFee",
      args: [tokenAddress, BigInt(tokenId), BigInt(amount)],
    });
    // console.log("getMintNFTPriceAfterFee", contract, data, status);
    const nftPrice = data ? (data as bigint[])[0] : undefined;
    const adminFee = data ? (data as bigint[])[1] : undefined;
    return { nftPrice, adminFee, status };
  };

  const getBurnNFTPriceAfterFee = (amount: number = 1) => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "getBurnNFTPriceAfterFee",
      args: [tokenAddress, BigInt(tokenId), BigInt(amount)],
    });
    const nftPrice = data ? (data as bigint[])[0] : undefined;
    const adminFee = data ? (data as bigint[])[1] : undefined;
    return { nftPrice, adminFee, status };
  };

  const getPaymentToken = () => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "tokens",
      args: [tokenAddress],
    });
    const paymentToken = data ? ((data as unknown[])[1] as Address) : undefined;

    return { paymentToken, status };
  };

  return {
    getMintNFTPriceAfterFee,
    getBurnNFTPriceAfterFee,
    getPaymentToken,
  };
}

export function useATTFactoryContractBuy(
  tokenAddress: Address,
  tokenId: number,
) {
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
      ...contract,
      functionName: "mintNFT",
      args: [tokenAddress, BigInt(tokenId), BigInt(amount), maxPayment],
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

export function useATTFactoryContractSell(
  tokenAddress: Address,
  tokenId: number,
) {
  const {
    writeContract,
    data: hash,
    isPending: writing,
    error: writeError,
  } = useWriteContract();

  const sell = async (amount: number) => {
    console.log("sell", tokenAddress, amount);
    writeContract({
      ...contract,
      functionName: "burnNFT",
      args: [tokenAddress, BigInt(tokenId), BigInt(amount)],
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

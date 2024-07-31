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
import { ERC42069Token } from "~/services/trade/types";

const contract = {
  abi: ATT_FACTORY_CONTRACT_ABI_JSON.abi,
  address: ATT_FACTORY_CONTRACT_ADDRESS,
  chainId: ATT_CONTRACT_CHAIN.id,
};

export function useATTFactoryContractInfo(tokenAddress: Address) {
  const getMintNFTPriceAfterFee = (amount: number = 1) => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "getMintNFTPriceAfterFee",
      args: [tokenAddress, BigInt(amount)],
    });
    const nftPrice = data ? (data as bigint) : undefined;
    return { nftPrice, status };
  };

  const getBurnNFTPriceAfterFee = (amount: number = 1) => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "getBurnNFTPriceAfterFee",
      args: [tokenAddress, BigInt(amount)],
    });
    const nftPrice = data ? (data as bigint) : undefined;
    return { nftPrice, status };
  };

  const getMintNFTPriceAndFee = (amount: number = 1) => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "getMintNFTPriceAfterFee",
      args: [tokenAddress, BigInt(amount)],
    });
    const nftPrice = data ? (data as bigint[])[0] : undefined;
    const adminFee = 0n;
    const treasuryFee = 0n;
    return { nftPrice, adminFee, treasuryFee, status };
  };

  const getBurnNFTPriceAndFee = (amount: number = 1) => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "getBurnNFTPriceAfterFee",
      args: [tokenAddress, BigInt(amount)],
    });
    const nftPrice = data ? (data as bigint[])[0] : undefined;
    const adminFee = data ? (data as bigint[])[1] : undefined;
    const treasuryFee = data ? (data as bigint[])[2] : undefined;
    return { nftPrice, adminFee, treasuryFee, status };
  };

  const getPaymentToken = () => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "tokens",
      args: [tokenAddress],
    });
    const paymentToken = data ? ((data as unknown[])[2] as Address) : undefined;

    return { paymentToken, status };
  };

  return {
    getMintNFTPriceAfterFee,
    getMintNFTPriceAndFee,
    getBurnNFTPriceAfterFee,
    getBurnNFTPriceAndFee,
    getPaymentToken,
  };
}

export function useATTFactoryContractMint(
  token:ERC42069Token
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
  const mint = async (amount: number, maxPayment: bigint) => {
    console.log("mint", token, amount, maxPayment);
    writeContract({
      ...contract,
      functionName: "mintNFT",
      args: [token.contractAddress, BigInt(token.tokenId), BigInt(amount), maxPayment],
    });
  };

  return {
    mint,
    transactionReceipt,
    status,
    writeError,
    transationError,
    waiting,
    writing,
    isSuccess,
  };
}

export function useATTFactoryContractBurn(
  token:ERC42069Token
) {
  const {
    writeContract,
    data: hash,
    isPending: writing,
    error: writeError,
  } = useWriteContract();

  const burn = async (amount: number) => {
    console.log("burn", token, amount);
    writeContract({
      ...contract,
      functionName: "burnNFT",
      args: [token.contractAddress, BigInt(token.tokenId), BigInt(amount)],
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

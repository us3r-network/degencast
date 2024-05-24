import { baseSepolia } from "viem/chains";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import SHARE_CONTRACT_ABI_JSON from "~/services/trade/abi/DegencastSharesV1.json";
import { TOKENS } from "../user/useUserTokens";

const SHARE_CONTRACT_ADDRESS = "0xd29648c63fe433ac9306d6473f0f13d4340e1440";
const address = SHARE_CONTRACT_ADDRESS;
const abi = SHARE_CONTRACT_ABI_JSON.abi;
export const SHARE_CONTRACT_CHAIN = baseSepolia;
export const SHARE_SUPPORT_TOKENS = [TOKENS.NATIVE];
export enum SHARE_ACTION {
  BUY,
  SELL,
}

export function useShareContractInfo(sharesSubject: `0x${string}`) {
  const chainId = SHARE_CONTRACT_CHAIN.id;
  const getPrice = (
    action: SHARE_ACTION,
    amount: number = 1,
    afterFee: boolean = false,
  ) => {
    const functionName =
      action === SHARE_ACTION.BUY
        ? afterFee
          ? "getBuyPriceAfterFee"
          : "getBuyPrice"
        : action === SHARE_ACTION.SELL
          ? afterFee
            ? "getSellPriceAfterFee"
            : "getSellPrice"
          : "";
    const { data, status } = useReadContract({
      abi,
      address,
      chainId,
      functionName,
      args: [sharesSubject, BigInt(amount)],
    });
    return { data: data as bigint, status };
  };

  const getBalance = (account: `0x${string}` | undefined) => {
    const { data, status } = useReadContract({
      abi,
      address,
      chainId,
      functionName: "sharesBalance",
      args: [sharesSubject, account],
    });
    return { data: data as bigint, status };
  };

  const getSupply = () => {
    const { data, status } = useReadContract({
      abi,
      address,
      chainId,
      functionName: "sharesSupply",
      args: [sharesSubject],
    });
    return { data: data as bigint, status };
  };

  return {
    getPrice,
    getBalance,
    getSupply,
  };
}

export function useShareContractBuy(sharesSubject: `0x${string}`) {
  const chainId = SHARE_CONTRACT_CHAIN.id;
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
  const buy = async (amount: number, value: bigint) => {
    console.log("buy", amount, chainId, sharesSubject);
    writeContract({
      address,
      abi,
      chainId,
      functionName: "buyShares",
      args: [sharesSubject, BigInt(amount)],
      value,
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

export function useShareContractSell(sharesSubject: `0x${string}`) {
  const chainId = SHARE_CONTRACT_CHAIN.id;
  const {
    writeContract,
    data: hash,
    isPending: writing,
    isError: writeError,
  } = useWriteContract();

  const sell = async (amount: number) => {
    writeContract({
      address,
      abi,
      chainId,
      functionName: "sellShares",
      args: [sharesSubject, BigInt(amount)],
    });
  };

  const {
    data: transactionReceipt,
    isError: transationError,
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

import { baseSepolia } from "viem/chains";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useAccount,
  useSwitchChain,
} from "wagmi";

import SHARE_CONTRACT_ABI_JSON from "~/services/trade/abi/DegencastSharesV1.json";

const SHARE_CONTRACT_ADDRESS = "0xd29648c63fe433ac9306d6473f0f13d4340e1440";
const address = SHARE_CONTRACT_ADDRESS;
const abi = SHARE_CONTRACT_ABI_JSON.abi;
const chainId = baseSepolia.id;

export enum SHARE_ACTION {
  BUY,
  SELL,
}

export function useShareContractInfo(sharesSubject: `0x${string}`) {
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
    return { data, status };
  };

  const getBalance = (account: `0x${string}` | undefined) => {
    const { data, status } = useReadContract({
      abi,
      address,
      chainId,
      functionName: "sharesBalance",
      args: [sharesSubject, account],
    });
    return { data, status };
  };

  const getSupply = () => {
    const { data, status } = useReadContract({
      abi,
      address,
      chainId,
      functionName: "sharesSupply",
      args: [sharesSubject],
    });
    return { data, status };
  };

  return {
    getPrice,
    getBalance,
    getSupply,
  };
}

export function useShareContractBuy(sharesSubject: `0x${string}`) {
  const {
    writeContract,
    data: hash,
    isPending: writing,
    isError: writeError,
  } = useWriteContract();
  const { switchChain } = useSwitchChain();

  const buy = async(amount: number = 1) => {
    console.log("buy", amount,chainId,sharesSubject);
    await switchChain({ chainId });
    writeContract({
      address,
      abi,
      chainId,
      functionName: "buyShares",
      args: [sharesSubject, BigInt(amount)],
    });
  };
  const {
    data,
    isError: transationError,
    isLoading: waiting,
    isSuccess,
    status,
  } = useWaitForTransactionReceipt({
    hash,
  });
  return { buy, data, status, writeError, transationError, waiting, writing };
}

export function useShareContractSell(sharesSubject: `0x${string}`) {
  const {
    writeContract,
    data: hash,
    isPending: writing,
    isError: writeError,
  } = useWriteContract();
  const { switchChain } = useSwitchChain();

  const sell = async(amount: number) =>{
    await switchChain({ chainId });
    writeContract({
      address,
      abi,
      chainId,
      functionName: "sellShares",
      args: [sharesSubject, BigInt(amount)],
    });
  }

  const {
    data,
    isError: transationError,
    isLoading: waiting,
    isSuccess,
    status,
  } = useWaitForTransactionReceipt({
    hash,
  });
  return { sell, data, status, writeError, transationError, waiting, writing };
}

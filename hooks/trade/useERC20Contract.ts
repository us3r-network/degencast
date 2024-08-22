import { useEffect } from "react";
import { Address, erc20Abi, formatUnits } from "viem";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { readContracts } from "@wagmi/core";
import { wagmiConfig } from "~/config/wagmiConfig";

const MAX_ALLOWANCE = BigInt(2) ** BigInt(256) - BigInt(1);

export function useERC20Approve({
  owner,
  tokenAddress,
  spender,
}: {
  owner: Address;
  tokenAddress: Address;
  spender: Address;
}) {
  // 1. Read from ERC20 contract. Does spender (0x Exchange Proxy) have an allowance?
  const { data: allowance, refetch } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner, spender],
  });

  // 2. (Only if no allowance): Write to ERC20, approve 0x Exchange Proxy to spend max integer
  const {
    writeContract,
    data: hash,
    isPending: writing,
    error: writeError,
    reset,
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

  const approve = async (value?: bigint) => {
    writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [spender, value || MAX_ALLOWANCE],
    });
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      reset();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (writeError || transationError) {
      reset();
    }
  }, [writeError, transationError]);

  return {
    allowance,
    approve,
    refetch,
    writing,
    waiting,
  };
}

export function useERC20Transfer({
  contractAddress,
}: {
  contractAddress: Address;
}) {
  const {
    writeContract,
    data: hash,
    isPending,
    error,
    reset,
  } = useWriteContract();

  const {
    data: transactionReceipt,
    error: transationError,
    isLoading: transationLoading,
    isSuccess,
    status: transationStatus,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const transfer = async (to: Address, amount: bigint) => {
    console.log("transfer", to, amount, contractAddress);
    writeContract({
      address: contractAddress,
      abi: erc20Abi,
      functionName: "transfer",
      args: [to, amount],
    });
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error || transationError) {
      reset();
    }
  }, [error, transationError]);

  return {
    transfer,
    error,
    isPending,
    isSuccess,
    transactionReceipt,
    transationError,
    transationLoading,
    transationStatus,
  };
}

export async function getTokenInfo({
  address,
  chainId,
  account,
}: {
  address: Address;
  chainId: number;
  account: Address;
}) {
  if (!address || !chainId) return undefined;
  const chain = wagmiConfig.chains.find((chain) => chain.id === chainId);
  if (!chain) return undefined;
  const contract = {
    address,
    abi: erc20Abi,
    chainId: chain.id,
  };
  const data = await readContracts(wagmiConfig, {
    contracts: [
      {
        ...contract,
        functionName: "name",
      },
      {
        ...contract,
        functionName: "symbol",
      },
      {
        ...contract,
        functionName: "decimals",
      },
      {
        ...contract,
        functionName: "balanceOf",
        args: [account],
      },
    ],
  });
  if (!data || data.length < 4) return undefined;
  if (data[0].error || data[1].error || data[2].error || data[3].error) {
    return undefined;
  }
  return {
    address,
    chainId,
    name: data[0].result,
    symbol: data[1].result,
    decimals: data[2].result,
    rawBalance: data[3].result,
    balance: formatUnits(
      data[3].result as bigint,
      data[2].result as unknown as number,
    ),
  };
}

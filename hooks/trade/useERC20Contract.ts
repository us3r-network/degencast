import { useEffect } from "react";
import { Address, erc20Abi } from "viem";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

const MAX_ALLOWANCE = BigInt(2) ** BigInt(256) - BigInt(1);

export function useERC20Approve({
  takerAddress,
  tokenAddress,
  allowanceTarget,
}: {
  takerAddress: Address;
  tokenAddress: Address;
  allowanceTarget: Address;
}) {
  // 1. Read from ERC20 contract. Does spender (0x Exchange Proxy) have an allowance?
  const { data: allowance, refetch } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: [takerAddress, allowanceTarget],
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
      args: [allowanceTarget, value || MAX_ALLOWANCE],
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

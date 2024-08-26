import { FeeAmount } from "@uniswap/v3-sdk";
import { useCallback } from "react";
import { Address, erc20Abi } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useCallsStatus, useWriteContracts } from "wagmi/experimental";
import { NATIVE_TOKEN_ADDRESS, WRAP_NATIVE_TOKEN_ADDRESS } from "~/constants";
import {
  ATT_CONTRACT_CHAIN,
  ATT_FACTORY_CONTRACT_ADDRESS,
} from "~/constants/att";
import ATT_FACTORY_CONTRACT_ABI_JSON from "~/services/trade/abi/AttentionTokenFactory.json";
import WETH_ABI from "~/services/trade/abi/weth.json";
import { ERC42069Token, TokenWithTradeInfo } from "~/services/trade/types";
import { convertToken } from "~/services/uniswapV3";
import { getTradeCallData } from "~/services/uniswapV3/trading";
import { useATTContractBurn } from "./useATTContract";
import useATTNftInfo from "./useATTNftInfo";

const contract = {
  abi: ATT_FACTORY_CONTRACT_ABI_JSON.abi,
  address: ATT_FACTORY_CONTRACT_ADDRESS,
  chainId: ATT_CONTRACT_CHAIN.id,
};

export function useATTFactoryContractInfo(token: ERC42069Token) {
  const getMintNFTPriceAfterFee = (amount: number = 1) => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "getMintNFTPriceAfterFee",
      args: [token.contractAddress, BigInt(amount)],
    });
    const nftPrice = data ? (data as bigint) : undefined;
    return { nftPrice, status };
  };

  const getMintNFTPriceFromUniV3 = (amount: number = 1) => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "getMintNFTPriceFromUniV3",
      args: [token.contractAddress, BigInt(amount)],
    });
    // console.log("getMintNFTPriceFromUniV3", data, status);
    const nftPrice = data
      ? (data as bigint) + (data as bigint) / 5n //todo: should get a more accurate price from contract
      : undefined;
    // return { nftPrice:1000000000000000000000n, status };
    return { nftPrice, status };
  };

  const getBurnNFTPriceAfterFee = (amount: number = 1) => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "getBurnNFTPriceAfterFee",
      args: [token.contractAddress, BigInt(amount)],
    });
    const nftPrice = data ? (data as bigint) : undefined;
    return { nftPrice, status };
  };

  const getMintNFTPriceAndFee = (amount: number = 1) => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "getMintNFTPriceAfterFee",
      args: [token.contractAddress, BigInt(amount)],
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
      args: [token.contractAddress, BigInt(amount)],
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
      args: [token.contractAddress],
    });
    const paymentToken = data ? ((data as unknown[])[2] as Address) : undefined;

    return { paymentToken, status };
  };

  const getGraduated = () => {
    const { data, status } = useReadContract({
      ...contract,
      functionName: "tokens",
      args: [token.contractAddress],
    });
    // console.log("getGraduated", data, status);
    const graduated = data ? ((data as unknown[])[7] as Boolean) : undefined;

    return { graduated, status };
  };

  return {
    getMintNFTPriceAfterFee,
    getMintNFTPriceAndFee,
    getMintNFTPriceFromUniV3,
    getBurnNFTPriceAfterFee,
    getBurnNFTPriceAndFee,
    getPaymentToken,
    getGraduated,
  };
}

export function useATTFactoryContractMint(token: ERC42069Token) {
  const {
    writeContract,
    data: hash,
    isPending: writePending,
    error: writeError,
  } = useWriteContract();
  const {
    data: transactionReceipt,
    error: transationError,
    isLoading: transactionPending,
    isSuccess,
    status,
  } = useWaitForTransactionReceipt({
    hash,
  });
  const { getGraduated } = useATTFactoryContractInfo(token);
  const { graduated } = getGraduated();
  const mint = useCallback(
    async (amount: number, maxPayment: bigint) => {
      console.log("mint", token, amount, maxPayment, graduated);
      writeContract({
        ...contract,
        functionName: graduated ? "mintNFTFromUniV3" : "mintNFT",
        args: [
          token.contractAddress,
          BigInt(token.tokenId),
          BigInt(amount),
          maxPayment,
        ],
      });
    },
    [graduated],
  );

  return {
    mint,
    transactionReceipt,
    status,
    writeError,
    transationError,
    isPending: writePending || transactionPending,
    isSuccess,
  };
}

export function useATTFactoryContractMintAA(token: ERC42069Token) {
  const {
    writeContracts,
    data: id,
    isPending: writePending,
    error: writeError,
  } = useWriteContracts();
  const {
    data: callsStatus,
    error: transationError,
    isSuccess,
  } = useCallsStatus({
    id: id as string,
    query: {
      enabled: !!id,
      // Poll every second until the calls are confirmed
      refetchInterval: (data) =>
        data.state.data?.status === "CONFIRMED" ? false : 1000,
    },
  });
  const account = useAccount();
  const { getGraduated } = useATTFactoryContractInfo(token);
  const { graduated } = getGraduated();
  const mint = useCallback(
    async (
      amount: number,
      maxPayment: bigint,
      paymentToken?: TokenWithTradeInfo,
      userSelectedToken?: TokenWithTradeInfo,
    ) => {
      // console.log(
      //   "mint with AA wallet",
      //   token,
      //   amount,
      //   maxPayment,
      //   paymentToken,
      //   userSelectedToken,
      // );
      const contracts: any[] = [];
      if (
        userSelectedToken &&
        paymentToken &&
        userSelectedToken !== paymentToken &&
        account?.address
      ) {
        const tradeContractMethodData = await getTradeCallData({
          tokenIn: convertToken(userSelectedToken),
          tokenOut: convertToken(paymentToken),
          amountOut: BigInt(maxPayment),
          poolFee: FeeAmount.HIGH,
          walletAddress: account.address,
        });
        // console.log("tradeCallData", tradeContractMethodData);
        if (userSelectedToken.address === NATIVE_TOKEN_ADDRESS) {
          contracts.push({
            address: WRAP_NATIVE_TOKEN_ADDRESS,
            abi: WETH_ABI.abi,
            functionName: "deposit",
            value: tradeContractMethodData.args[0].amountInMaximum,
          });
        }
        contracts.push({
          address: tradeContractMethodData.args[0].tokenIn,
          abi: erc20Abi,
          functionName: "approve",
          args: [
            tradeContractMethodData.address,
            tradeContractMethodData.args[0].amountInMaximum,
          ],
        });
        contracts.push(tradeContractMethodData);
      }
      // console.log("mint with AA wallet", contracts);
      if (paymentToken)
        contracts.push({
          address: paymentToken.address,
          abi: erc20Abi,
          functionName: "approve",
          args: [ATT_FACTORY_CONTRACT_ADDRESS, maxPayment],
        });
      contracts.push({
        address: ATT_FACTORY_CONTRACT_ADDRESS,
        abi: ATT_FACTORY_CONTRACT_ABI_JSON.abi,
        chainId: ATT_CONTRACT_CHAIN.id,
        functionName: graduated ? "mintNFTFromUniV3" : "mintNFT",
        args: [
          token.contractAddress,
          BigInt(token.tokenId),
          BigInt(amount),
          maxPayment,
        ],
      });
      writeContracts({
        contracts,
      });
    },
    [graduated],
  );
  const transactionReceipt =
    callsStatus?.receipts && callsStatus.receipts.length > 0
      ? callsStatus?.receipts[callsStatus.receipts.length - 1]
      : undefined;

  // console.log(
  //   "mintAA status",
  //   writePending,
  //   isSuccess,
  //   callsStatus,
  //   transactionReceipt,
  // );
  return {
    mint,
    transactionReceipt,
    writeError,
    transationError,
    isPending:
      writePending || (id && !callsStatus) || callsStatus?.status === "PENDING",
    isSuccess: callsStatus?.status === "CONFIRMED",
  };
}

export function useATTFactoryContractBurn(token: ERC42069Token) {
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

export function useATTBurnNFT(token: ERC42069Token) {
  const { graduated } = useATTNftInfo({
    tokenContract: token.contractAddress,
  });
  const {
    burn: burnBeforeGraduated,
    transactionReceipt: transactionReceiptBeforeGraduated,
    status: statusBeforeGraduated,
    writeError: writeErrorBeforeGraduated,
    transationError: transationErrorBeforeGraduated,
    waiting: waitingBeforeGraduated,
    writing: writingBeforeGraduated,
    isSuccess: isSuccessBeforeGraduated,
  } = useATTFactoryContractBurn(token);

  const {
    burn: burnAfterGraduated,
    transactionReceipt: transactionReceiptAfterGraduated,
    status: statusAfterGraduated,
    writeError: writeErrorAfterGraduated,
    transationError: transationErrorAfterGraduated,
    waiting: waitingAfterGraduated,
    writing: writingAfterGraduated,
    isSuccess: isSuccessAfterGraduated,
  } = useATTContractBurn(token);
  return {
    burn: graduated ? burnAfterGraduated : burnBeforeGraduated,
    transactionReceipt: graduated
      ? transactionReceiptAfterGraduated
      : transactionReceiptBeforeGraduated,
    status: graduated ? statusAfterGraduated : statusBeforeGraduated,
    writeError: graduated
      ? writeErrorAfterGraduated
      : writeErrorBeforeGraduated,
    transationError: graduated
      ? transationErrorAfterGraduated
      : transationErrorBeforeGraduated,
    waiting: graduated ? waitingAfterGraduated : waitingBeforeGraduated,
    writing: graduated ? writingAfterGraduated : writingBeforeGraduated,
    isSuccess: graduated ? isSuccessAfterGraduated : isSuccessBeforeGraduated,
  };
}

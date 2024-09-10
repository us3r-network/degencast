import { FeeAmount } from "@uniswap/v3-sdk";
import {
  Address,
  erc20Abi,
  PublicClient,
  TransactionReceipt,
  WalletClient,
} from "viem";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import {
  NATIVE_TOKEN_ADDRESS,
  UNISWAP_V3_DEGEN_ETH_POOL_FEES,
  WRAP_NATIVE_TOKEN_ADDRESS,
} from "~/constants/chain";
import DanAbi from "~/services/proposal/abi/DanAbi.json";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { convertToken } from "~/services/uniswapV3";
import {
  getTradeCallData,
  getTradeCallDataWithInput,
} from "~/services/uniswapV3/trading";
import WETH_ABI from "~/services/trade/abi/weth.json";

type WriteContractsCapabilities =
  | {
      paymasterService: {
        url: string | undefined;
      };
    }
  | {
      paymasterService?: undefined;
    };
export enum ProposalState {
  NotProposed = -1,
  Proposed = 0,
  Accepted = 1,
  Disputed = 2,
  ReadyToMint = 3,
  Abandoned = 4,
}
export type ProposalsInfo = {
  currentKey: string;
  uuid: string;
  contentHash: string;
  contentURI: string;
  contentCreator: `0x${string}`;
  proposeWeight: bigint;
  disputeWeight: bigint;
  deadline: bigint;
  roundIndex: bigint;
  state: ProposalState;
};
export const getProposals = async ({
  publicClient,
  contractAddress,
  castHash,
}: {
  publicClient: PublicClient;
  contractAddress: `0x${string}`;
  castHash: string;
}) => {
  if (!publicClient) {
    throw new Error("Client not connected");
  }
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }
  if (!castHash) {
    throw new Error("Cast hash is required");
  }
  const proposals = (await publicClient.readContract({
    abi: DanAbi,
    address: contractAddress,
    functionName: "proposals",
    args: [castHash],
  })) as Array<any>;

  const [
    currentKey,
    uuid,
    contentHash,
    contentURI,
    contentCreator,
    proposeWeight,
    disputeWeight,
    deadline,
    roundIndex,
    state,
  ] = proposals;
  return {
    currentKey,
    uuid,
    contentHash,
    contentURI,
    contentCreator,
    proposeWeight,
    disputeWeight,
    deadline,
    roundIndex,
    state,
  } as ProposalsInfo;
};

export const getRound = async ({
  publicClient,
  contractAddress,
  castHash,
  roundIndex,
  walletAddress,
}: {
  publicClient: PublicClient;
  contractAddress: `0x${string}`;
  castHash: string;
  roundIndex: bigint;
  walletAddress: `0x${string}`;
}) => {
  if (!publicClient) {
    throw new Error("Client not connected");
  }
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }
  if (!castHash) {
    throw new Error("Cast hash is required");
  }
  if (roundIndex === undefined) {
    throw new Error("Round index is required");
  }
  if (!walletAddress) {
    throw new Error("Wallet address is required");
  }
  const round = (await publicClient.readContract({
    abi: DanAbi,
    address: contractAddress,
    functionName: "round",
    args: [castHash, roundIndex, walletAddress],
  })) as boolean;

  return round;
};

export const getProposePrice = async ({
  publicClient,
  contractAddress,
  castHash,
}: {
  publicClient: PublicClient;
  contractAddress: `0x${string}`;
  castHash: string;
}) => {
  if (!publicClient) {
    throw new Error("Client not connected");
  }
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }
  if (!castHash) {
    throw new Error("Cast hash is required");
  }
  const price = await publicClient.readContract({
    abi: DanAbi,
    address: contractAddress,
    functionName: "getProposePrice",
    args: [castHash],
  });
  return price as bigint;
};

export const getDisputePrice = async ({
  publicClient,
  contractAddress,
  castHash,
}: {
  publicClient: PublicClient;
  contractAddress: `0x${string}`;
  castHash: string;
}) => {
  if (!publicClient) {
    throw new Error("Client not connected");
  }
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }
  if (!castHash) {
    throw new Error("Cast hash is required");
  }
  const price = await publicClient.readContract({
    abi: DanAbi,
    address: contractAddress,
    functionName: "getDisputePrice",
    args: [castHash],
  });
  return price as bigint;
};

export const getPaymentToken = async ({
  publicClient,
  contractAddress,
}: {
  publicClient: PublicClient;
  contractAddress: `0x${string}`;
}) => {
  if (!publicClient) {
    throw new Error("Client not connected");
  }
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }
  const paymentToken = await publicClient.readContract({
    abi: DanAbi,
    address: contractAddress,
    functionName: "paymentToken",
  });
  return paymentToken as `0x${string}`;
};

export type PaymentConfig = {
  paymentTokenAddress?: Address;
  paymentAmount?: bigint;
  enableApprovePaymentStep?: boolean; // 开启后，尝试在create前先批准支付
  capabilities?: WriteContractsCapabilities;
  paymentToken?: TokenWithTradeInfo;
  usedPaymentToken?: TokenWithTradeInfo;
};
export type CreateProposalConfig = {
  castHash: string;
  castCreator: `0x${string}`;
  contentURI: string;
};

type WalletClientExperimental = WalletClient & {
  writeContracts?: ({
    chain,
    account,
    contracts,
  }: {
    chain: any;
    account: any;
    contracts: any[];
    capabilities?: WriteContractsCapabilities;
  }) => Promise<any>;
  getCallsStatus?: (opts: any) => Promise<any>;
};
export const createProposal = async ({
  publicClient,
  walletClient,
  contractAddress,
  proposalConfig,
  paymentConfig,
}: {
  publicClient: PublicClient;
  walletClient: WalletClientExperimental;
  contractAddress: `0x${string}`;
  proposalConfig: CreateProposalConfig;
  paymentConfig: PaymentConfig;
}) => {
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }
  if (!proposalConfig) {
    throw new Error("Proposal config is required");
  }
  if (!proposalConfig.castHash) {
    throw new Error("Cast hash is required");
  }
  if (!proposalConfig.castCreator) {
    throw new Error("Cast creator is required");
  }
  if (!proposalConfig.contentURI) {
    throw new Error("Content URI is required");
  }
  if (!publicClient) {
    throw new Error("Client not connected");
  }
  const chain = walletClient.chain;
  const chainId = chain?.id;
  if (!chainId || ATT_CONTRACT_CHAIN.id !== chainId) {
    throw new Error("Invalid chain id");
  }
  const account = walletClient.account;
  if (!account) {
    throw new Error("Wallet is not connected");
  }

  const {
    paymentTokenAddress,
    paymentAmount,
    enableApprovePaymentStep,
    capabilities,
    usedPaymentToken,
    paymentToken,
  } = paymentConfig || {};

  const proposelConfig = {
    contentHash: proposalConfig.castHash,
    contentCreator: proposalConfig.castCreator,
    contentURI: proposalConfig.contentURI,
  };
  const txBaseConfig = {
    abi: DanAbi,
    address: contractAddress,
    chain: ATT_CONTRACT_CHAIN,
    account,
    functionName: "createProposal",
  };

  let receipt: TransactionReceipt;
  if (enableApprovePaymentStep) {
    if (!walletClient.writeContracts) {
      throw new Error("walletClient does not have writeContracts method");
    }
    if (!walletClient.getCallsStatus) {
      throw new Error("walletClient does not have getCallsStatus method");
    }

    if (!paymentToken?.address) {
      throw new Error(
        "Payment token address is required when enable approve payment step",
      );
    }

    const contracts = [];
    let txPaymentAmount = paymentAmount;
    if (
      usedPaymentToken &&
      usedPaymentToken.address !== paymentToken?.address
    ) {
      if (!paymentAmount) {
        throw new Error("Payment amount is required");
      }
      if (!account.address) {
        throw new Error("Account address is required");
      }
      console.log("tradeContractMethodData before", {
        usedPaymentToken,
        paymentToken,
        paymentAmount,
        accountAddress: account.address,
      });
      const tradeContractMethodData = await getTradeCallDataWithInput({
        tokenIn: convertToken(usedPaymentToken),
        tokenOut: convertToken(paymentToken),
        amountIn: paymentAmount,
        poolFee: UNISWAP_V3_DEGEN_ETH_POOL_FEES,
        walletAddress: account.address,
      });
      console.log("tradeContractMethodData", tradeContractMethodData);
      txPaymentAmount = tradeContractMethodData.args[0].amountOutMinimum;
      if (usedPaymentToken.address === NATIVE_TOKEN_ADDRESS) {
        contracts.push({
          address: WRAP_NATIVE_TOKEN_ADDRESS,
          abi: WETH_ABI.abi,
          functionName: "deposit",
          value: paymentAmount,
        });
      }
      contracts.push({
        address: tradeContractMethodData.args[0].tokenIn,
        abi: erc20Abi,
        functionName: "approve",
        args: [tradeContractMethodData.address, paymentAmount],
      });
      contracts.push(tradeContractMethodData);
    }

    const approveConfig = {
      address: paymentToken.address || paymentTokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [contractAddress, txPaymentAmount],
    };
    const txConfig = {
      ...txBaseConfig,
      args: [proposelConfig, txPaymentAmount],
    };
    contracts.push(approveConfig);
    contracts.push(txConfig);
    console.log("contracts", contracts);

    const id = await walletClient.writeContracts({
      chain,
      account,
      contracts,
      capabilities,
    });
    const res: any = await new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        if (!walletClient.getCallsStatus) {
          clearInterval(interval);
          reject("walletClient does not have getCallsStatus method");
          return;
        }
        try {
          const res = await walletClient.getCallsStatus({
            id: id,
          });
          if (res.status === "CONFIRMED") {
            clearInterval(interval);
            resolve(res);
          }
        } catch (error) {}
      }, 1000);
    });

    const { status, receipts } = res;
    receipt = (receipts?.[receipts?.length - 1] ||
      undefined) as TransactionReceipt;
  } else {
    const txConfig = {
      ...txBaseConfig,
      args: [proposalConfig, paymentAmount],
    };
    const { request: simulateRequest } =
      await publicClient.simulateContract(txConfig);
    const hash = await walletClient.writeContract(simulateRequest);
    receipt = await publicClient.waitForTransactionReceipt({ hash });
  }

  return {
    receipt,
    tokenInfo: {
      contractAddress,
      account,
      chainId,
    },
  };
};

type HandleProposalCommonOpts = {
  publicClient: PublicClient;
  walletClient: WalletClient & {
    writeContracts?: ({
      chain,
      account,
      contracts,
    }: {
      chain: any;
      account: any;
      contracts: any[];
      capabilities?: WriteContractsCapabilities;
    }) => Promise<any>;
    getCallsStatus?: (opts: any) => Promise<any>;
  };
  contractAddress: `0x${string}`;
  castHash: string;
  paymentConfig: {
    paymentPrice: bigint;
    enableApprovePaymentStep?: boolean; // 开启后，尝试在create前先批准支付
    paymentTokenAddress?: `0x${string}`;
    capabilities?: WriteContractsCapabilities;
  };
};
const challengeProposal = async ({
  publicClient,
  walletClient,
  contractAddress,
  castHash,
  paymentConfig,
  functionName,
}: HandleProposalCommonOpts & {
  functionName: string;
}) => {
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }
  if (!castHash) {
    throw new Error("Cast hash is required");
  }
  if (!publicClient) {
    throw new Error("Client not connected");
  }
  const chain = walletClient.chain;
  const chainId = chain?.id;
  if (!chainId || ATT_CONTRACT_CHAIN.id !== chainId) {
    throw new Error("Invalid chain id");
  }
  const account = walletClient.account;
  if (!account) {
    throw new Error("Wallet is not connected");
  }

  const {
    paymentPrice: inputPrice,
    enableApprovePaymentStep,
    paymentTokenAddress,
    capabilities,
  } = paymentConfig;
  let paymentPrice = inputPrice;
  if (!inputPrice) {
    if (functionName === "proposeProposal") {
      paymentPrice = await getProposePrice({
        publicClient,
        contractAddress,
        castHash: castHash,
      });
    }
    if (functionName === "disputeProposal") {
      paymentPrice = await getDisputePrice({
        publicClient,
        contractAddress,
        castHash: castHash,
      });
    }
  }

  const challengeProposalStepConfig = {
    abi: DanAbi,
    address: contractAddress,
    chain: ATT_CONTRACT_CHAIN,
    account,
    functionName,
    args: [castHash, paymentPrice],
  };
  let receipt: TransactionReceipt;
  if (enableApprovePaymentStep) {
    if (!walletClient.writeContracts) {
      throw new Error("walletClient does not have writeContracts method");
    }

    if (!paymentTokenAddress) {
      throw new Error(
        "Payment token address is required when enable approve payment step",
      );
    }
    const approvePaymentStepConfig = {
      address: paymentTokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [contractAddress, paymentPrice],
    };

    const contracts = [
      approvePaymentStepConfig,
      challengeProposalStepConfig,
    ] as any[];

    const id = await walletClient.writeContracts({
      chain,
      account,
      contracts,
      capabilities,
    });
    const res: any = await new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        if (!walletClient.getCallsStatus) {
          clearInterval(interval);
          reject("walletClient does not have getCallsStatus method");
          return;
        }
        try {
          const res = await walletClient.getCallsStatus({
            id: id,
          });
          if (res.status === "CONFIRMED") {
            clearInterval(interval);
            resolve(res);
          }
        } catch (error) {}
      }, 1000);
    });

    const { status, receipts } = res;
    receipt = (receipts?.[receipts?.length - 1] ||
      undefined) as TransactionReceipt;
  } else {
    const { request: simulateRequest } = await publicClient.simulateContract(
      challengeProposalStepConfig,
    );
    const hash = await walletClient.writeContract(simulateRequest);
    receipt = await publicClient.waitForTransactionReceipt({ hash });
  }
  return {
    receipt,
    tokenInfo: {
      contractAddress,
      account,
      chainId,
    },
  };
};

export const proposeProposal = async (opts: HandleProposalCommonOpts) => {
  return await challengeProposal({
    ...opts,
    functionName: "proposeProposal",
  });
};

export const disputeProposal = async (opts: HandleProposalCommonOpts) => {
  return await challengeProposal({
    ...opts,
    functionName: "disputeProposal",
  });
};

import { PublicClient, WalletClient } from "viem";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import DanAbi from "~/services/proposal/abi/DanAbi.json";

export enum ProposalState {
  NotProposed = -1,
  Proposed = 0,
  Accepted = 1,
  Disputed = 2,
  ReadyToMint = 3,
  Abandoned = 4,
}
export type ProposalsInfo = {
  castHash: string;
  contentURI: string;
  castCreator: `0x${string}`;
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

  return {
    castHash: proposals[0],
    contentURI: proposals[1],
    castCreator: proposals[2],
    proposeWeight: proposals[3],
    disputeWeight: proposals[4],
    deadline: proposals[5],
    roundIndex: proposals[6],
    state: proposals[7],
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

export const createProposal = async ({
  publicClient,
  walletClient,
  contractAddress,
  proposalConfig,
  paymentPrice,
}: {
  publicClient: PublicClient;
  walletClient: WalletClient;
  contractAddress: `0x${string}`;
  proposalConfig: {
    castHash: string;
    castCreator: `0x${string}`;
    contentURI: string;
  };
  paymentPrice: bigint;
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

  const config = {
    contentHash: proposalConfig.castHash,
    contentCreator: proposalConfig.castCreator,
    contentURI: proposalConfig.contentURI,
  };

  const { request: simulateRequest } = await publicClient.simulateContract({
    abi: DanAbi,
    address: contractAddress,
    chain: ATT_CONTRACT_CHAIN,
    account,
    functionName: "createProposal",
    args: [config, paymentPrice],
  });

  const hash = await walletClient.writeContract(simulateRequest);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
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
  walletClient: WalletClient;
  contractAddress: `0x${string}`;
  castHash: string;
  paymentPrice?: bigint;
};
const challengeProposal = async ({
  publicClient,
  walletClient,
  contractAddress,
  castHash,
  paymentPrice,
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
  let payment = paymentPrice;
  if (!paymentPrice) {
    if (functionName === "proposeProposal") {
      payment = await getProposePrice({
        publicClient,
        contractAddress,
        castHash: castHash,
      });
    }
    if (functionName === "disputeProposal") {
      payment = await getDisputePrice({
        publicClient,
        contractAddress,
        castHash: castHash,
      });
    }
  }
  const { request: simulateRequest } = await publicClient.simulateContract({
    abi: DanAbi,
    address: contractAddress,
    chain: ATT_CONTRACT_CHAIN,
    account,
    functionName,
    args: [castHash, payment],
  });

  const hash = await walletClient.writeContract(simulateRequest);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
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

import { PublicClient, WalletClient } from "viem";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import DanJson from "~/services/proposal/abi/Dan.json";
const DanAbi = DanJson.abi;

export const getProposePrice = async ({
  publicClient,
  contractAddress,
  castHash,
}: {
  publicClient: PublicClient;
  contractAddress: `0x${string}`;
  castHash: string;
}) => {
  if (!contractAddress) {
    throw new Error("Contract address is required");
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
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }
  const price = await publicClient.readContract({
    abi: DanAbi,
    address: contractAddress,
    functionName: "getDisputePrice",
    args: [castHash],
  });
  return price as bigint;
};

export const createProposal = async ({
  publicClient,
  walletClient,
  contractAddress,
  proposalConfig,
  proposePrice,
}: {
  publicClient: PublicClient;
  walletClient: WalletClient;
  contractAddress: `0x${string}`;
  proposalConfig: {
    castHash: string;
    castCreator: string;
    contentURI: string;
  };
  proposePrice?: bigint;
}) => {
  if (!contractAddress) {
    throw new Error("Contract address is required");
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
  let payment = proposePrice;
  if (!proposePrice) {
    payment = await getProposePrice({
      publicClient,
      contractAddress,
      castHash: proposalConfig.castHash,
    });
  }
  const { request: simulateRequest } = await publicClient.simulateContract({
    abi: DanAbi,
    address: contractAddress,
    chain: ATT_CONTRACT_CHAIN,
    account,
    functionName: "createProposal",
    args: [proposalConfig, payment],
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

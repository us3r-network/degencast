import type { PublicClient, WalletClient } from "viem";
import {
  create1155CreatorClient,
  getTokenIdFromCreateReceipt,
} from "@zoralabs/protocol-sdk";
import { usePublicClient, useWalletClient } from "wagmi";
import { FarCast } from "~/services/farcaster/types";
import { getImage, storeNFT } from "~/services/shared/api/nftStorage";
import { useState } from "react";
import { ZORA_CREATE_REFERRAL } from "~/constants/zora";
import useCastCollection from "./useCastCollection";

const CAST_COLLECTION_NAME = "Degencast Cast Collection";
const CAST_COLLECTION_DESCRIPTION = "Degencast Cast Collection";

const getCreateAt = () => {
  return Math.floor(Date.now() / 1000);
};
const getCastCollectionMetadata = async ({ imgUrl }: { imgUrl: string }) => {
  const imageBlob = await getImage(imgUrl);
  return {
    name: CAST_COLLECTION_NAME,
    description: CAST_COLLECTION_DESCRIPTION,
    external_url: "https://degencast.xyz?nft_link=cast",
    image: imageBlob,
    properties: {
      imageOriginUrl: imgUrl,
      createAt: getCreateAt(),
    },
  };
};

const CAST_TOKEN_NAME = "Degencast Cast Collection";
const CAST_TOKEN_DESCRIPTION = "Degencast Cast Collection";
const getCastTokenMetadata = async ({
  imgUrl,
  cast,
  channelId,
}: {
  imgUrl: string;
  cast: FarCast;
  channelId: string;
}) => {
  const imageBlob = await getImage(imgUrl);
  return {
    name: CAST_TOKEN_NAME,
    description: CAST_TOKEN_DESCRIPTION,
    external_url: "https://degencast.xyz?nft_link=cast",
    image: imageBlob,
    properties: {
      imageOriginUrl: imgUrl,
      channelId,
      castJson: JSON.stringify(cast),
      createAt: getCreateAt(),
    },
  };
};

async function createNew1155Token({
  publicClient,
  walletClient,
  contractAddress,
  contractMetadataURI,
  tokenMetadataURI,
}: {
  publicClient: PublicClient;
  walletClient: WalletClient;
  contractAddress?: `0x${string}`;
  contractMetadataURI?: string;
  tokenMetadataURI: string;
}) {
  if (!contractAddress && !contractMetadataURI) {
    throw new Error("Contract address or metadata URI is required");
  }
  const addresses = await walletClient.getAddresses();
  const chainId = await walletClient.getChainId();
  const creatorAccount = addresses[0]!;
  const creatorClient = create1155CreatorClient({ publicClient });
  const { request, contractAddress: collectionContractAddress } =
    await creatorClient.createNew1155Token({
      contract: contractAddress! || {
        name: CAST_COLLECTION_NAME,
        uri: contractMetadataURI,
      },
      tokenMetadataURI: tokenMetadataURI,
      account: creatorAccount,
      mintToCreatorCount: 1,
      createReferral: ZORA_CREATE_REFERRAL,
    });
  const { request: simulateRequest } =
    await publicClient.simulateContract(request);
  const hash = await walletClient.writeContract(simulateRequest);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  return {
    receipt,
    tokenInfo: {
      contractAddress: collectionContractAddress,
      creatorAccount,
      chainId,
    },
  };
}

export default function useCreateNew1155Token({
  cast,
  imgUrl,
  channelId,
  onCreateTokenSuccess,
}: {
  cast: FarCast;
  imgUrl: string;
  channelId: string;
  onCreateTokenSuccess?: (data: {
    tokenId: number;
    contractAddress: string;
    chainId: number;
  }) => void;
}) {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { submitCollection } = useCastCollection();

  const [loading, setLoading] = useState(false);
  const [newTokenId, setNewTokenId] = useState<number | null>(null);

  const createNewToken = async (contractAddress: `0x${string}`) => {
    try {
      setLoading(true);
      if (!contractAddress) {
        throw new Error("Contract address is required");
      }
      if (!publicClient || !walletClient) {
        throw new Error("Wallet not connected");
      }
      const tokenMetadata = await getCastTokenMetadata({
        imgUrl,
        cast,
        channelId,
      });
      const tokenMetadataURI = await storeNFT(tokenMetadata);
      if (!tokenMetadataURI) {
        throw new Error("Failed to store NFT metadata");
      }
      const resp = await createNew1155Token({
        publicClient,
        walletClient,
        contractAddress: contractAddress,
        tokenMetadataURI: tokenMetadataURI,
      });
      const tokenId = getTokenIdFromCreateReceipt(resp.receipt);
      setNewTokenId(Number(tokenId));
      onCreateTokenSuccess?.({
        tokenId: Number(tokenId),
        contractAddress,
        chainId: resp.tokenInfo.chainId,
      });
    } catch (error) {
      console.error("Error creating 1155 contract:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNewCollection = async () => {
    try {
      setLoading(true);
      if (!publicClient || !walletClient) {
        throw new Error("Wallet not connected");
      }

      const contractMetadata = await getCastCollectionMetadata({ imgUrl });
      const tokenMetadata = await getCastTokenMetadata({
        imgUrl,
        cast,
        channelId,
      });

      const contractMetadataURI = await storeNFT(contractMetadata);
      const tokenMetadataURI = await storeNFT(tokenMetadata);
      if (!contractMetadataURI || !tokenMetadataURI) {
        throw new Error("Failed to store NFT metadata");
      }
      const resp = await createNew1155Token({
        publicClient,
        walletClient,
        contractMetadataURI: contractMetadataURI,
        tokenMetadataURI: tokenMetadataURI,
      });
      const tokenInfo = resp.tokenInfo;

      submitCollection({
        chainId: tokenInfo.chainId,
        creatorAddress: tokenInfo.creatorAccount,
        contractAddress: tokenInfo.contractAddress,
      });
      const tokenId = getTokenIdFromCreateReceipt(resp.receipt);
      setNewTokenId(Number(tokenId));
      onCreateTokenSuccess?.({
        tokenId: Number(tokenId),
        contractAddress: tokenInfo.contractAddress,
        chainId: resp.tokenInfo.chainId,
      });
    } catch (error) {
      console.error("Error creating 1155 contract:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    createNewCollection,
    createNewToken,
    loading,
    newTokenId,
  };
}

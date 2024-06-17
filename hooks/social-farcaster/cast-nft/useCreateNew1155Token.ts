import {
  create1155CreatorClient,
  getTokenIdFromCreateReceipt,
} from "@zoralabs/protocol-sdk";
import { cloneDeepWith } from "lodash";
import { useState } from "react";
import type { PublicClient, TransactionReceipt, WalletClient } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import { DEGENCAST_WEB_HOST } from "~/constants";
import { ZORA_CREATE_REFERRAL } from "~/constants/zora";
import { FarCast } from "~/services/farcaster/types";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { storeNFT } from "~/services/shared/api/nftStorage";
import { postZoraToken } from "~/services/zora-collection/api";
import { ZoraCollectionType } from "~/services/zora-collection/types";
import { getCastHex } from "~/utils/farcaster/cast-utils";
import { imgLinkToBlob } from "~/utils/image";
import { getCastDetailWebsiteLink } from "~/utils/platform-sharing/link";
import useCastCollection from "./useCastCollection";

const CAST_COLLECTION_NAME = "Degencast Cast";
const CAST_COLLECTION_DESCRIPTION = "Degencast Cast";
export const CAST_TOKEN_EXTERNAL_URL = DEGENCAST_WEB_HOST + "?nft_link=cast";

const getCreateAt = () => {
  return Math.floor(Date.now() / 1000);
};
const getCastCollectionMetadata = async ({
  imgUrl,
  currUserDisplayName,
}: {
  imgUrl: string;
  currUserDisplayName: string;
}) => {
  const imageBlob = await imgLinkToBlob(imgUrl);
  return {
    name: `${currUserDisplayName}'s Degencast`,
    description: `${currUserDisplayName}'s Zora mint with degencast.wtf`,
    external_url: CAST_TOKEN_EXTERNAL_URL,
    image: imageBlob,
    properties: {
      imageOriginUrl: imgUrl,
      createAt: getCreateAt(),
    },
  };
};

const CAST_TOKEN_NAME = "Degencast Cast";
const CAST_TOKEN_DESCRIPTION = "Degencast Cast";
const getCastTokenMetadata = async ({
  imgUrl,
  cast,
  castUserData,
  channelId,
}: {
  imgUrl: string;
  cast: FarCast | NeynarCast;
  castUserData?: {
    display: string;
  };
  channelId: string;
}) => {
  const imageBlob = await imgLinkToBlob(imgUrl);
  const text = cast.text;
  const textPreview = text.length > 100 ? text.slice(0, 100) + "..." : text;
  const userDisplayName = castUserData?.display || "";
  const castHex = getCastHex(cast);
  return {
    name: `${userDisplayName}: ${textPreview}`,
    description: getCastDetailWebsiteLink(castHex),
    external_url: CAST_TOKEN_EXTERNAL_URL,
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

export type MintInfo = {
  chainId: number;
  contractAddress: string;
  contractMetadataURI?: string;
  tokenId: number;
  tokenMetadataURI: string;
  transactionReceipt: TransactionReceipt;
  creatorAddress: string;
};

function customizer(value: any) {
  if (typeof value === "bigint") {
    return value.toString();
  }
}

export default function useCreateNew1155Token({
  cast,
  castUserData,
  imgUrl,
  channelId,
  currUserDisplayName,
  onCreateTokenSuccess,
}: {
  cast: FarCast | NeynarCast;
  castUserData?: {
    display: string;
  };
  imgUrl: string;
  channelId: string;
  currUserDisplayName: string;
  onCreateTokenSuccess?: (data: MintInfo) => void;
}) {
  // const { submitUserAction } = useUserAction();
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
        castUserData,
      });
      const tokenMetadataURI = await storeNFT(tokenMetadata);
      if (!tokenMetadataURI) {
        throw new Error("Failed to store NFT metadata");
      }
      const { receipt, tokenInfo } = await createNew1155Token({
        publicClient,
        walletClient,
        contractAddress: contractAddress,
        tokenMetadataURI: tokenMetadataURI,
      });
      const tokenId = getTokenIdFromCreateReceipt(receipt);
      setNewTokenId(Number(tokenId));
      onCreateTokenSuccess?.({
        chainId: tokenInfo.chainId,
        tokenId: Number(tokenId),
        contractAddress: tokenInfo.contractAddress,
        creatorAddress: tokenInfo.creatorAccount,
        tokenMetadataURI: tokenMetadataURI,
        transactionReceipt: cloneDeepWith(receipt, customizer),
      });
      postZoraToken({
        chainId: tokenInfo.chainId,
        tokenId: Number(tokenId),
        contractAddress: tokenInfo.contractAddress,
        creatorAddress: tokenInfo.creatorAccount,
        type: ZoraCollectionType.CAST,
        tokenMetadataURI: tokenMetadataURI,
        metadataJson: JSON.stringify(tokenMetadata),
      });
      // const castHex = getCastHex(cast);
      // submitUserAction({
      //   action: UserActionName.MintCast,
      //   castHash: castHex,
      // });
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

      const contractMetadata = await getCastCollectionMetadata({
        imgUrl,
        currUserDisplayName,
      });
      const tokenMetadata = await getCastTokenMetadata({
        imgUrl,
        cast,
        channelId,
        castUserData,
      });

      const contractMetadataURI = await storeNFT(contractMetadata);
      const tokenMetadataURI = await storeNFT(tokenMetadata);
      if (!contractMetadataURI || !tokenMetadataURI) {
        throw new Error("Failed to store NFT metadata");
      }
      const { receipt, tokenInfo } = await createNew1155Token({
        publicClient,
        walletClient,
        contractMetadataURI: contractMetadataURI,
        tokenMetadataURI: tokenMetadataURI,
      });

      submitCollection({
        chainId: tokenInfo.chainId,
        creatorAddress: tokenInfo.creatorAccount,
        contractAddress: tokenInfo.contractAddress,
        contractMetadataURI: contractMetadataURI,
      });
      const tokenId = getTokenIdFromCreateReceipt(receipt);
      setNewTokenId(Number(tokenId));
      onCreateTokenSuccess?.({
        chainId: tokenInfo.chainId,
        tokenId: Number(tokenId),
        contractAddress: tokenInfo.contractAddress,
        creatorAddress: tokenInfo.creatorAccount,
        tokenMetadataURI: tokenMetadataURI,
        contractMetadataURI: contractMetadataURI,
        transactionReceipt: cloneDeepWith(receipt, customizer),
      });
      postZoraToken({
        chainId: tokenInfo.chainId,
        tokenId: Number(tokenId),
        contractAddress: tokenInfo.contractAddress,
        creatorAddress: tokenInfo.creatorAccount,
        type: ZoraCollectionType.CAST,
        tokenMetadataURI: tokenMetadataURI,
        metadataJson: JSON.stringify(tokenMetadata),
      });
      // const castHex = getCastHex(cast);
      // submitUserAction({
      //   action: UserActionName.MintCast,
      //   castHash: castHex,
      // });
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

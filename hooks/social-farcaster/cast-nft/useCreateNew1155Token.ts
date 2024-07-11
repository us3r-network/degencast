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
import { Author, NeynarCast } from "~/services/farcaster/types/neynar";
import { postZoraToken } from "~/services/zora-collection/api";
import { ZoraCollectionType } from "~/services/zora-collection/types";
import { getCastFid, getCastHex } from "~/utils/farcaster/cast-utils";
import { getCastDetailWebsiteLink } from "~/utils/platform-sharing/link";
import useCastCollection from "./useCastCollection";
import {
  arUploadCastImage,
  arUploadMetadata,
  ARUploadResult,
} from "~/services/upload";
import useCurrUserInfo from "~/hooks/user/useCurrUserInfo";

const CAST_COLLECTION_NAME = "Degencast Cast";
const CAST_COLLECTION_DESCRIPTION = "Degencast Cast";
export const CAST_TOKEN_EXTERNAL_URL = DEGENCAST_WEB_HOST + "?nft_link=cast";

const getCreateAt = () => {
  return Math.floor(Date.now() / 1000);
};
const uploadCastImgToArweave = async ({
  cast,
  channelId,
  currUserInfo,
}: {
  cast: FarCast | NeynarCast;
  channelId: string;
  currUserInfo: Author;
}) => {
  const castHex = getCastHex(cast);
  const castFid = getCastFid(cast);
  const res = await arUploadCastImage(castHex, [
    { name: "degencast-tag", value: "cast-nft-image" },
    { name: "fid", value: String(currUserInfo?.fid || "") },
    { name: "channelId", value: channelId },
    { name: "castHash", value: castHex },
    { name: "castFid", value: String(castFid) },
  ]);
  return res.data.data;
};
const uploadCastTokenMetataToArweave = async ({
  metadata,
  cast,
  channelId,
  currUserInfo,
}: {
  metadata: any;
  cast: FarCast | NeynarCast;
  channelId: string;
  currUserInfo: Author;
}) => {
  const castHex = getCastHex(cast);
  const castFid = getCastFid(cast);
  const res = await arUploadMetadata(metadata, [
    { name: "degencast-tag", value: "cast-nft-metadata" },
    { name: "fid", value: String(currUserInfo?.fid || "") },
    { name: "channelId", value: channelId },
    { name: "castHash", value: castHex },
    { name: "castFid", value: String(castFid) },
  ]);
  return res.data.data;
};
const uploadCastCollectionMetataToArweave = async ({
  metadata,
  cast,
  channelId,
  currUserInfo,
}: {
  metadata: any;
  cast: FarCast | NeynarCast;
  channelId: string;
  currUserInfo: Author;
}) => {
  const castHex = getCastHex(cast);
  const castFid = getCastFid(cast);
  const res = await arUploadMetadata(metadata, [
    { name: "degencast-tag", value: "cast-collection-metadata" },
    { name: "fid", value: String(currUserInfo?.fid || "") },
    { name: "channelId", value: channelId },
    { name: "castHash", value: castHex },
    { name: "castFid", value: castFid },
  ]);
  return res.data.data;
};
const getCastCollectionMetadata = async ({
  currUserDisplayName,
  castImageUploadData,
}: {
  currUserDisplayName: string;
  castImageUploadData: ARUploadResult;
}) => {
  const url = castImageUploadData.url;
  return {
    name: `${currUserDisplayName}'s Degencast`,
    description: `${currUserDisplayName}'s Zora mint with degencast.wtf`,
    external_url: CAST_TOKEN_EXTERNAL_URL,
    image: url,
    properties: {
      imageOriginUrl: url,
      createAt: getCreateAt(),
    },
  };
};

const CAST_TOKEN_NAME = "Degencast Cast";
const CAST_TOKEN_DESCRIPTION = "Degencast Cast";
const getCastTokenMetadata = async ({
  cast,
  castUserData,
  channelId,
  castImageUploadData,
}: {
  cast: FarCast | NeynarCast;
  castUserData?: {
    display: string;
  };
  channelId: string;
  castImageUploadData: ARUploadResult;
}) => {
  const castHex = getCastHex(cast);
  const url = castImageUploadData.url;

  const text = cast.text;
  const textPreview = text.length > 100 ? text.slice(0, 100) + "..." : text;
  const userDisplayName = castUserData?.display || "";
  return {
    name: `${userDisplayName}: ${textPreview}`,
    description: getCastDetailWebsiteLink(castHex),
    external_url: CAST_TOKEN_EXTERNAL_URL,
    image: url,
    properties: {
      imageOriginUrl: url,
      channelId,
      castHash: castHex,
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
  onCreateTokenSuccess,
}: {
  cast: FarCast | NeynarCast;
  castUserData?: {
    display: string;
  };
  imgUrl: string;
  channelId: string;
  currUserInfo?: string;
  onCreateTokenSuccess?: (data: MintInfo) => void;
}) {
  const { currUserInfo, loading: currUserDataLoading } = useCurrUserInfo();
  const currUserDisplayName = currUserInfo ? currUserInfo.display_name : "";
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
      const castImgData = await uploadCastImgToArweave({
        cast,
        channelId,
        currUserInfo: currUserInfo!,
      });
      const tokenMetadata = await getCastTokenMetadata({
        cast,
        channelId,
        castUserData,
        castImageUploadData: castImgData,
      });
      const res = await uploadCastTokenMetataToArweave({
        metadata: tokenMetadata,
        cast,
        channelId,
        currUserInfo: currUserInfo!,
      });

      const tokenMetadataURI = res.url;
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

      const castImgData = await uploadCastImgToArweave({
        cast,
        channelId,
        currUserInfo: currUserInfo!,
      });
      const contractMetadata = await getCastCollectionMetadata({
        currUserDisplayName,
        castImageUploadData: castImgData,
      });
      const tokenMetadata = await getCastTokenMetadata({
        cast,
        channelId,
        castUserData,
        castImageUploadData: castImgData,
      });

      const collectionRes = await uploadCastCollectionMetataToArweave({
        metadata: contractMetadata,
        cast,
        channelId,
        currUserInfo: currUserInfo!,
      });
      const contractMetadataURI = collectionRes.url;

      const tokenRes = await uploadCastTokenMetataToArweave({
        metadata: tokenMetadata,
        cast,
        channelId,
        currUserInfo: currUserInfo!,
      });
      const tokenMetadataURI = tokenRes.url;
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

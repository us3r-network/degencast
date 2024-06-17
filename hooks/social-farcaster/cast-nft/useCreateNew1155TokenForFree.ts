import {
  createPremintClient
} from "@zoralabs/protocol-sdk";
import { useState } from "react";
import type { PublicClient, WalletClient } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import { FarCast } from "~/services/farcaster/types";
import { getImage, storeNFT } from "~/services/shared/api/nftStorage";
import { postZoraToken } from "~/services/zora-collection/api";
import { ZoraCollectionType } from "~/services/zora-collection/types";
import useCastCollection from "./useCastCollection";
import { CAST_TOKEN_EXTERNAL_URL } from "./useCreateNew1155Token";

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
    external_url: CAST_TOKEN_EXTERNAL_URL,
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

async function createPremint({
  publicClient,
  walletClient,
  contractMetadataURI,
  tokenMetadataURI,
  checkSignature = false,
}: {
  publicClient: PublicClient;
  walletClient: WalletClient;
  contractMetadataURI: string;
  tokenMetadataURI: string;
  checkSignature?: boolean;
}) {
  if (!contractMetadataURI) {
    throw new Error(" contractMetadataURI is required");
  }

  const addresses = await walletClient.getAddresses();
  const chainId = await walletClient.getChainId();
  const creatorAccount = addresses[0]!;

  const premintClient = createPremintClient({
    chain: walletClient.chain!,
    publicClient,
  });
  console.log("creatorAccount", creatorAccount);
  console.log("contractMetadataURI", contractMetadataURI);
  console.log("tokenMetadataURI", tokenMetadataURI);
  // create and sign a free token creation.
  const createdPremint = await premintClient.createPremint({
    walletClient,
    creatorAccount,
    // if true, will validate that the creator is authorized to create premints on the contract.
    checkSignature,
    // collection info of collection to create
    collection: {
      contractAdmin: creatorAccount,
      contractName: CAST_COLLECTION_NAME,
      contractURI: contractMetadataURI,
      additionalAdmins: [],
    },
    // token info of token to create
    tokenCreationConfig: {
      tokenURI: tokenMetadataURI,
    },
  });

  const premintUid = createdPremint.uid;
  const premintCollectionAddress = createdPremint.verifyingContract;
  console.log("premintUid", premintUid);
  console.log("premintCollectionAddress", premintCollectionAddress);
  return {
    premintUid,
    tokenInfo: {
      contractAddress: premintCollectionAddress,
      creatorAccount,
      chainId,
    },
  };
}

export default function useCreateNew1155TokenForFree({
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

  const createNewToken = async (contractMetadataURI: string) => {
    try {
      setLoading(true);
      if (!contractMetadataURI) {
        throw new Error(" contractMetadataURI is required");
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
      const { tokenInfo, premintUid } = await createPremint({
        publicClient,
        walletClient,
        contractMetadataURI,
        tokenMetadataURI,
        checkSignature: true,
      });
      setNewTokenId(Number(premintUid));
      onCreateTokenSuccess?.({
        tokenId: Number(premintUid),
        contractAddress: tokenInfo.contractAddress,
        chainId: tokenInfo.chainId,
      });
      postZoraToken({
        chainId: tokenInfo.chainId,
        tokenId: Number(premintUid),
        contractAddress: tokenInfo.contractAddress,
        creatorAddress: tokenInfo.creatorAccount,
        type: ZoraCollectionType.PREMINT_CAST,
        tokenMetadataURI: tokenMetadataURI,
        metadataJson: JSON.stringify(tokenMetadata),
      });
    } catch (error) {
      console.error("Error creating 1155 token:", error);
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
      const { tokenInfo, premintUid } = await createPremint({
        publicClient,
        walletClient,
        contractMetadataURI,
        tokenMetadataURI,
      });
      setNewTokenId(Number(premintUid));
      submitCollection({
        chainId: tokenInfo.chainId,
        creatorAddress: tokenInfo.creatorAccount,
        contractAddress: tokenInfo.contractAddress,
        contractMetadataURI: contractMetadataURI,
      });
      postZoraToken({
        chainId: tokenInfo.chainId,
        tokenId: Number(premintUid),
        contractAddress: tokenInfo.contractAddress,
        creatorAddress: tokenInfo.creatorAccount,
        type: ZoraCollectionType.PREMINT_CAST,
        tokenMetadataURI: tokenMetadataURI,
        metadataJson: JSON.stringify(tokenMetadata),
      });
      onCreateTokenSuccess?.({
        tokenId: Number(premintUid),
        contractAddress: tokenInfo.contractAddress,
        chainId: tokenInfo.chainId,
      });
    } catch (error) {
      console.error("Error creating 1155 token:", error);
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

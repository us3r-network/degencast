import { FarCast } from "~/services/farcaster/types";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { ActivityIndicator, View } from "react-native";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { Image } from "expo-image";
import { AspectRatio } from "../ui/aspect-ratio";
import { useEffect, useMemo, useState } from "react";
import { Loading } from "../common/Loading";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { ZORA_CAST_NFT_CHAIN_ID } from "~/constants/zora";
import useCreateNew1155Token, {
  MintInfo,
} from "~/hooks/social-farcaster/cast-nft/useCreateNew1155Token";
import useCastCollection from "~/hooks/social-farcaster/cast-nft/useCastCollection";
import PlatformSharingModal from "../platform-sharing/PlatformSharingModal";
import {
  getMintCastTextWithTwitter,
  getMintCastTextWithWarpcast,
} from "~/utils/platform-sharing/text";
import {
  getMintCastFrameLink,
  getMintCastWebsiteLink,
} from "~/utils/platform-sharing/link";
import { getCastImageUrl } from "~/services/farcaster/api";
import { usePrivy } from "@privy-io/react-auth";
import { UserData } from "~/utils/farcaster/user-data";
import useUserBulk from "~/hooks/user/useUserBulk";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { getCastHex } from "~/utils/farcaster/cast-utils";
import useCurrUserInfo from "~/hooks/user/useCurrUserInfo";
// import useCreateNew1155TokenForFree from "~/hooks/social-farcaster/cast-nft/useCreateNew1155TokenForFree";

export default function FCastMintNftModal({
  cast,
  channelId,
  open,
  onOpenChange,
  castUserData,
}: {
  cast: FarCast | NeynarCast;
  channelId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  castUserData?: {
    display: string;
  };
}) {
  const { connectWallet } = usePrivy();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, status: switchChainStatus } = useSwitchChain();
  const castHex = getCastHex(cast);
  const imgUrl = getCastImageUrl(`0x${castHex}`);
  const [imgLoading, setImgLoading] = useState(true);
  const [openShare, setOpenShare] = useState(false);
  const [createdTokenInfo, setCreatedTokenInfo] = useState<MintInfo | null>(
    null,
  );
  const {
    findCollectionWithCache,
    castCollectionsLoading,
    setSharingCastMint,
  } = useCastCollection();
  const collection = useMemo(() => {
    if (!address || !chainId) return null;
    return findCollectionWithCache(address, chainId);
  }, [address, chainId, findCollectionWithCache]);

  const { currUserInfo, loading: currUserDataLoading } = useCurrUserInfo();

  const currUserDisplayName = currUserInfo ? currUserInfo.display_name : "";
  const {
    createNewToken,
    createNewCollection,
    loading: create1155TokenLoading,
  } = useCreateNew1155Token({
    cast,
    castUserData,
    imgUrl: imgUrl,
    channelId,
    currUserDisplayName,
    onCreateTokenSuccess: (data) => {
      setCreatedTokenInfo(data);
      onOpenChange(false);
      setOpenShare(true);
    },
  });

  // premint
  // const {
  //   createNewCollection,
  //   createNewToken,
  //   loading: create1155TokenLoading,
  // } = useCreateNew1155TokenForFree({
  //   cast,
  //   imgUrl: originImgUrl,
  //   channelId,
  //   onCreateTokenSuccess: (data) => {
  //     setCreatedTokenInfo(data);
  //     onOpenChange(false);
  //     setOpenShare(true);
  //   },
  // });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className=" box-border max-sm:w-screen">
          <DialogHeader>
            <Text>Mint & Share</Text>
          </DialogHeader>
          <View className="flex w-full flex-col gap-5 sm:min-w-[390px] ">
            <View className="">
              <AspectRatio ratio={1}>
                <Image
                  onLoadStart={() => {
                    setImgLoading(true);
                  }}
                  onLoadEnd={() => {
                    setImgLoading(false);
                  }}
                  source={{ uri: imgUrl }}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                  }}
                />
              </AspectRatio>
              {imgLoading ? (
                <View className=" absolute h-full w-full flex-row items-center justify-center">
                  <Loading />
                </View>
              ) : null}
            </View>
            <Button
              className="font-bold text-white"
              variant={"secondary"}
              disabled={
                currUserDataLoading ||
                switchChainStatus === "pending" ||
                create1155TokenLoading ||
                castCollectionsLoading
              }
              onPress={() => {
                if (!isConnected) {
                  connectWallet();
                  return;
                }
                if (chainId !== ZORA_CAST_NFT_CHAIN_ID) {
                  switchChain({ chainId: ZORA_CAST_NFT_CHAIN_ID });
                  return;
                }
                if (collection) {
                  createNewToken(collection.contractAddress);
                  // createNewToken(collection.contractMetadataURI);
                } else {
                  createNewCollection();
                }
              }}
            >
              {(() => {
                if (!isConnected) {
                  return <Text>Please connect your wallet first</Text>;
                }
                if (create1155TokenLoading) {
                  return (
                    <View className=" flex-row items-center gap-2">
                      <Text>
                        {collection
                          ? "Uploading Metadata & Minting"
                          : "Creating Collection & Minting"}
                      </Text>
                      <ActivityIndicator className="text-secondary" />
                    </View>
                  );
                }
                if (chainId !== ZORA_CAST_NFT_CHAIN_ID) {
                  return <Text>Switch Chain</Text>;
                }
                return <Text>Mint Cast & Earn 200 $CAST</Text>;
              })()}
            </Button>
          </View>
        </DialogContent>
      </Dialog>
      {createdTokenInfo && (
        <PlatformSharingModal
          open={openShare}
          hideTwitterPoints={true}
          onOpenChange={(open) => setOpenShare(open)}
          twitterText={getMintCastTextWithTwitter()}
          warpcastText={getMintCastTextWithWarpcast()}
          warpcastChannelId="zora"
          websiteLink={getMintCastWebsiteLink(createdTokenInfo!)}
          warpcastEmbeds={[getMintCastFrameLink(createdTokenInfo!)]}
          navigateToCreatePageAfter={() => {
            setSharingCastMint({
              castHex,
              url: getMintCastWebsiteLink(createdTokenInfo!),
              mintInfo: createdTokenInfo,
            });
            onOpenChange?.(false);
          }}
        />
      )}
    </>
  );
}

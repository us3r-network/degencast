import { FarCast } from "~/services/farcaster/types";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { ActivityIndicator, View } from "react-native";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { Image } from "expo-image";
import { AspectRatio } from "../ui/aspect-ratio";
import getCastHex from "~/utils/farcaster/getCastHex";
import { useEffect, useMemo, useState } from "react";
import { Loading } from "../common/Loading";
import { imgLinkToBase64, imgLinkToBase64WithCors } from "~/utils/image";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { ZORA_CAST_NFT_CHAIN_ID } from "~/constants/zora";
import useCreateNew1155Token from "~/hooks/social-farcaster/cast-nft/useCreateNew1155Token";
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
// import useCreateNew1155TokenForFree from "~/hooks/social-farcaster/cast-nft/useCreateNew1155TokenForFree";

export default function FCastMintNftModal({
  cast,
  channelId,
  open,
  onOpenChange,
}: {
  cast: FarCast;
  channelId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain, status: switchChainStatus } = useSwitchChain();
  const castHex = getCastHex(cast);
  const warpcastImgUrl = `https://client.warpcast.com/v2/cast-image?castHash=0x${castHex}`;
  const [imgLoading, setImgLoading] = useState(true);
  // const [imgBase64, setImgBase64] = useState("");
  const [openShare, setOpenShare] = useState(false);
  const [createdTokenInfo, setCreatedTokenInfo] = useState<{
    chainId: number;
    contractAddress: string;
    tokenId: number;
  } | null>(null);
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const base64 = await imgLinkToBase64(originImgUrl);
  //       setImgBase64(base64);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   })();
  // }, [originImgUrl]);
  const { findCollectionWithCache, castCollectionsLoading } =
    useCastCollection();
  const collection = useMemo(() => {
    if (!address || !chainId) return null;
    return findCollectionWithCache(address, chainId);
  }, [address, chainId, findCollectionWithCache]);
  const {
    createNewToken,
    createNewCollection,
    loading: create1155TokenLoading,
  } = useCreateNew1155Token({
    cast,
    imgUrl: warpcastImgUrl,
    channelId,
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
                  source={{ uri: warpcastImgUrl }}
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
                switchChainStatus === "pending" ||
                create1155TokenLoading ||
                castCollectionsLoading
              }
              onPress={() => {
                if (chainId !== ZORA_CAST_NFT_CHAIN_ID) {
                  console.log("chainId", chainId);
                  console.log("ZORA_CAST_NFT_CHAIN_ID", ZORA_CAST_NFT_CHAIN_ID);

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
              {create1155TokenLoading ? (
                <View className=" flex-row items-center gap-2">
                  <Text>
                    {collection
                      ? "Uploading Metadata & Minting"
                      : "Creating Collection & Minting"}
                  </Text>
                  <ActivityIndicator className="text-secondary" />
                </View>
              ) : chainId !== ZORA_CAST_NFT_CHAIN_ID ? (
                <Text>Switch Chain</Text>
              ) : (
                <Text>Mint Cast & Share</Text>
              )}
            </Button>
          </View>
        </DialogContent>
      </Dialog>
      {createdTokenInfo && (
        <PlatformSharingModal
          open={openShare}
          showPoints={false}
          onOpenChange={(open) => setOpenShare(open)}
          twitterText={getMintCastTextWithTwitter()}
          warpcastText={getMintCastTextWithWarpcast()}
          websiteLink={getMintCastWebsiteLink(createdTokenInfo!)}
          frameLink={getMintCastFrameLink(createdTokenInfo!)}
          navigateToCreatePageAfter={() => {
            onOpenChange?.(false);
          }}
        />
      )}
    </>
  );
}

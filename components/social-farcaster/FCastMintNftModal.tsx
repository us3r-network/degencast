import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { ZORA_CAST_NFT_CHAIN_ID } from "~/constants/zora";
import useCastCollection from "~/hooks/social-farcaster/cast-nft/useCastCollection";
import useCreateNew1155Token, {
  MintInfo,
} from "~/hooks/social-farcaster/cast-nft/useCreateNew1155Token";
import useCurrUserInfo from "~/hooks/user/useCurrUserInfo";
import { getCastImageUrl } from "~/services/farcaster/api";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { getCastHex } from "~/utils/farcaster/cast-utils";
import {
  getMintCastFrameLink,
  getMintCastWebsiteLink,
} from "~/utils/platform-sharing/link";
import {
  getMintCastTextWithTwitter,
  getMintCastTextWithWarpcast,
} from "~/utils/platform-sharing/text";
import { Loading } from "../common/Loading";
import PlatformSharingModal from "../platform-sharing/PlatformSharingModal";
import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Text } from "../ui/text";
import useWalletAccount from "~/hooks/user/useWalletAccount";

export default function FCastMintNftModal({
  cast,
  channelId,
  open,
  onOpenChange,
}: {
  cast: NeynarCast;
  channelId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { connectWallet } = useWalletAccount();
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

  const {
    createNewToken,
    createNewCollection,
    loading: create1155TokenLoading,
  } = useCreateNew1155Token({
    cast,
    channelId,
    onCreateTokenSuccess: (data) => {
      setCreatedTokenInfo(data);
      onOpenChange(false);
      setOpenShare(true);
    },
  });

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
                return <Text>Mint Cast</Text>;
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

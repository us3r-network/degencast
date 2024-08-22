import { forwardRef, LegacyRef, useState } from "react";
import { View, ViewProps } from "react-native";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useFarcasterLikeAction from "~/hooks/social-farcaster/useFarcasterLikeAction";
import useFarcasterRecastAction from "~/hooks/social-farcaster/useFarcasterRecastAction";
import useFarcasterSigner from "~/hooks/social-farcaster/useFarcasterSigner";
import useUserDegenAllowance from "~/hooks/user/useUserDegenAllowance";
import { CommunityInfo } from "~/services/community/types/community";
import { PostMenuButton } from "../post/PostActions";
import FCastGiftModal from "./FCastGiftModal";
import FCastMintNftModal from "./FCastMintNftModal";
import FCastShareModal from "./FCastShareModal";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { getCastHex } from "~/utils/farcaster/cast-utils";
import useAuth from "~/hooks/user/useAuth";
import useCastReply from "~/hooks/social-farcaster/useCastReply";
import useAppModals from "~/hooks/useAppModals";

export const FCastMenuButton = forwardRef(function (
  {
    direction,
    cast,
    communityInfo,
    ...props
  }: ViewProps & {
    direction?: "top" | "left" | "right";
    cast: NeynarCast;
    communityInfo: CommunityInfo;
  },
  ref: LegacyRef<View>,
) {
  const channelId = communityInfo?.channelId || "";
  const { navigateToCastReply } = useCastReply();
  const { login, ready, authenticated } = useAuth();
  const { currFid } = useFarcasterAccount();
  const { requestSigner, hasSigner } = useFarcasterSigner();
  const { likeCast, removeLikeCast, liked, likeCount, likePending } =
    useFarcasterLikeAction({ cast });
  const { recast, removeRecast, recasted, recastCount, recastPending } =
    useFarcasterRecastAction({ cast });
  const [openGiftModal, setOpenGiftModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [openMintNftModal, setOpenMintNftModal] = useState(false);
  const { totalDegenAllowance, remainingDegenAllowance, loadDegenAllowance } =
    useUserDegenAllowance();

  const onLike = () => {
    if (liked) {
      removeLikeCast();
    } else {
      likeCast();
    }
  };

  const onRepost = () => {
    if (recasted) {
      removeRecast();
    } else {
      recast();
    }
  };

  const onComment = () => {
    if (!authenticated) {
      login();
      return;
    }
    if (!currFid || !hasSigner) {
      requestSigner();
      return;
    }
    const castHex = getCastHex(cast);
    navigateToCastReply(castHex, {
      cast,
      community: communityInfo,
    });
  };

  const onGift = () => {
    if (!authenticated) {
      login();
      return;
    }
    loadDegenAllowance();
    setOpenGiftModal(true);
  };

  const { upsetProposalShareModal } = useAppModals();
  const onShare = () => {
    setOpenShareModal(true);
    upsetProposalShareModal({ open: true, cast, channel: communityInfo });
  };
  return (
    <View className="z-20">
      <PostMenuButton
        ref={ref}
        direction={direction}
        channelId={channelId}
        liked={liked}
        likeCount={likeCount}
        liking={likePending}
        reposted={recasted}
        reposting={recastPending}
        onLike={onLike}
        onGift={onGift}
        onShare={onShare}
        onComment={onComment}
        onRepost={onRepost}
        onMint={() => {
          if (!authenticated) {
            login();
            return;
          }
          setOpenMintNftModal(true);
        }}
        {...props}
      />

      <FCastGiftModal
        totalAllowance={totalDegenAllowance}
        remainingAllowance={remainingDegenAllowance}
        cast={cast}
        open={openGiftModal}
        onOpenChange={setOpenGiftModal}
      />
      {/* <FCastShareModal
        cast={cast}
        open={openShareModal}
        onOpenChange={setOpenShareModal}
      /> */}
      <FCastMintNftModal
        cast={cast}
        channelId={channelId}
        open={openMintNftModal}
        onOpenChange={setOpenMintNftModal}
      />
    </View>
  );
});

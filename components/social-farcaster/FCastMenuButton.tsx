import { useState } from "react";
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
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { getCastHex } from "~/utils/farcaster/cast-utils";
import useAuth from "~/hooks/user/useAuth";
import useCastReply from "~/hooks/social-farcaster/useCastReply";
import useAppModals from "~/hooks/useAppModals";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { openWarpcastCast } from "~/utils/platform-sharing/warpcast";

export default function FCastMenuButton({
  direction,
  cast,
  communityInfo,
  proposal,
  ...props
}: ViewProps & {
  direction?: "top" | "left" | "right";
  cast: NeynarCast;
  communityInfo: CommunityInfo;
  proposal?: ProposalEntity;
}) {
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
  const [openMintNftModal, setOpenMintNftModal] = useState(false);
  const { totalDegenAllowance, remainingDegenAllowance, loadDegenAllowance } =
    useUserDegenAllowance();
  const castHash = cast.hash;

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

    navigateToCastReply(castHash, {
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

  const { upsertProposalShareModal } = useAppModals();
  const onShare = () => {
    upsertProposalShareModal({
      open: true,
      cast,
      channel: communityInfo,
      proposal,
    });
  };
  return (
    <View className="z-20">
      <PostMenuButton
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
        onOpenWarpcast={() => {
          openWarpcastCast(castHash);
        }}
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
}

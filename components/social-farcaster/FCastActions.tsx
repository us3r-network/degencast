import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import { ViewProps } from "react-native";
import Toast from "react-native-toast-message";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useFarcasterLikeAction from "~/hooks/social-farcaster/useFarcasterLikeAction";
import useFarcasterRecastAction from "~/hooks/social-farcaster/useFarcasterRecastAction";
import useFarcasterSigner from "~/hooks/social-farcaster/useFarcasterSigner";
import useUserDegenAllowance from "~/hooks/user/useUserDegenAllowance";
import { CommunityInfo } from "~/services/community/types/community";
import { FarCast } from "~/services/farcaster/types";
import { UserData } from "~/utils/farcaster/user-data";
import { ExplorePostActions, PostDetailActions } from "../post/PostActions";
import FCastGiftModal from "./FCastGiftModal";
import FCastMintNftModal from "./FCastMintNftModal";
import FCastShareModal from "./FCastShareModal";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { getCastFid, getCastHex } from "~/utils/farcaster/cast-utils";

export function FCastDetailActions({
  cast,
  farcasterUserDataObj,
  communityInfo,
  ...props
}: ViewProps & {
  cast: FarCast | NeynarCast;
  farcasterUserDataObj: { [key: string]: UserData };
  communityInfo: CommunityInfo;
  isDetail?: boolean;
}) {
  const castFid = getCastFid(cast);
  const castUserData = farcasterUserDataObj[castFid];
  const channelId = communityInfo?.channelId || "";
  const { navigateToCastReply } = useCastPage();
  const { authenticated, login } = usePrivy();
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
      farcasterUserDataObj,
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

  const onShare = () => {
    setOpenShareModal(true);
  };

  return (
    <>
      <PostDetailActions
        liked={liked}
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
      <FCastShareModal
        cast={cast}
        open={openShareModal}
        onOpenChange={setOpenShareModal}
      />
      <FCastMintNftModal
        cast={cast}
        castUserData={castUserData}
        channelId={channelId}
        open={openMintNftModal}
        onOpenChange={setOpenMintNftModal}
      />
    </>
  );
}

export function FCastExploreActions({
  cast,
  farcasterUserDataObj,
  communityInfo,
  showActions,
  showActionsChange,
  ...props
}: ViewProps & {
  cast: FarCast;
  farcasterUserDataObj: { [key: string]: UserData };
  communityInfo: CommunityInfo;
  showActions: boolean;
  showActionsChange: (showActions: boolean) => void;
}) {
  const castUserData = farcasterUserDataObj[cast.fid];
  const channelId = communityInfo?.channelId || "";
  const { navigateToCastReply } = useCastPage();
  const { authenticated, login } = usePrivy();
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
      farcasterUserDataObj,
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

  const onShare = () => {
    setOpenShareModal(true);
  };
  return (
    <>
      <ExplorePostActions
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
        showActions={showActions}
        showActionsChange={showActionsChange}
        {...props}
      />

      <FCastGiftModal
        totalAllowance={totalDegenAllowance}
        remainingAllowance={remainingDegenAllowance}
        cast={cast}
        open={openGiftModal}
        onOpenChange={setOpenGiftModal}
      />
      <FCastShareModal
        cast={cast}
        open={openShareModal}
        onOpenChange={setOpenShareModal}
      />
      <FCastMintNftModal
        cast={cast}
        castUserData={castUserData}
        channelId={channelId}
        open={openMintNftModal}
        onOpenChange={setOpenMintNftModal}
      />
    </>
  );
}

export function CreatedFCastActions({
  cast,
  ...props
}: ViewProps & {
  cast: FarCast;
}) {
  const { authenticated, login } = usePrivy();
  const onShare = () => {};
  return <PostDetailActions onShare={onShare} hideGift hideLike {...props} />;
}

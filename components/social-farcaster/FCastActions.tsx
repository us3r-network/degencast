import { ViewProps } from "react-native";
import { FarCast } from "~/services/farcaster/types";
import { ExplorePostActions, PostDetailActions } from "../post/PostActions";
import { usePrivy } from "@privy-io/react-auth";
import useFarcasterLikeAction from "~/hooks/social-farcaster/useFarcasterLikeAction";
import FCastGiftModal from "./FCastGiftModal";
import { useState } from "react";
import useUserDegenAllowance from "~/hooks/user/useUserDegenAllowance";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import { CommunityInfo } from "~/services/community/types/community";
import { UserData } from "~/utils/farcaster/user-data";
import getCastHex from "~/utils/farcaster/getCastHex";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useFarcasterWrite from "~/hooks/social-farcaster/useFarcasterWrite";
import useFarcasterRecastAction from "~/hooks/social-farcaster/useFarcasterRecastAction";
import FCastShareModal from "./FCastShareModal";
import FCastMintNftModal from "./FCastMintNftModal";
import Toast from "react-native-toast-message";

export function FCastDetailActions({
  cast,
  farcasterUserDataObj,
  communityInfo,
  ...props
}: ViewProps & {
  cast: FarCast;
  farcasterUserDataObj: { [key: string]: UserData };
  communityInfo: CommunityInfo;
  isDetail?: boolean;
}) {
  const castUserData = farcasterUserDataObj[cast.fid];
  const channelId = communityInfo?.channelId || "";
  const { navigateToCastReply } = useCastPage();
  const { authenticated, login } = usePrivy();
  const { currFid } = useFarcasterAccount();
  const { prepareWrite: farcasterPrepareWrite } = useFarcasterWrite();
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
    if (!authenticated) {
      login();
      return;
    }

    if (liked) {
      removeLikeCast();
    } else {
      likeCast();
    }
  };
  const onGift = () => {
    if (!authenticated) {
      login();
      return;
    }
    loadDegenAllowance();
    setOpenGiftModal(true);
  };
  const onComment = () => {
    if (!authenticated) {
      login();
      return;
    }
    if (!currFid) {
      farcasterPrepareWrite();
      return;
    }
    const castHex = getCastHex(cast);
    navigateToCastReply(castHex, {
      cast,
      farcasterUserDataObj,
      community: communityInfo,
    });
  };
  const onShare = () => {
    setOpenShareModal(true);
  };
  const onRepost = () => {
    if (!authenticated) {
      login();
      return;
    }
    if (recasted) {
      // removeRecast();
      Toast.show({
        type: "info",
        text1: "already recasted",
      });
    } else {
      recast();
    }
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
  const channelId = communityInfo.channelId || "";
  const { navigateToCastReply } = useCastPage();
  const { authenticated, login } = usePrivy();
  const { currFid } = useFarcasterAccount();
  const { prepareWrite: farcasterPrepareWrite } = useFarcasterWrite();
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
    if (!authenticated) {
      login();
      return;
    }

    if (liked) {
      removeLikeCast();
    } else {
      likeCast();
    }
  };
  const onGift = () => {
    if (!authenticated) {
      login();
      return;
    }
    loadDegenAllowance();
    setOpenGiftModal(true);
  };
  const onComment = () => {
    if (!authenticated) {
      login();
      return;
    }
    if (!currFid) {
      farcasterPrepareWrite();
      return;
    }
    const castHex = getCastHex(cast);
    navigateToCastReply(castHex, {
      cast,
      farcasterUserDataObj,
      community: communityInfo,
    });
  };
  const onShare = () => {
    setOpenShareModal(true);
  };
  const onRepost = () => {
    if (!authenticated) {
      login();
      return;
    }
    if (recasted) {
      // removeRecast();
      Toast.show({
        type: "info",
        text1: "already recasted",
      });
    } else {
      recast();
    }
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

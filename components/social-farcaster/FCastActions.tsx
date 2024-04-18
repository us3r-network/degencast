import { ViewProps } from "react-native";
import { FarCast } from "~/services/farcaster/types";
import { ExplorePostActions, PostDetailActions } from "../post/PostActions";
import { usePrivy } from "@privy-io/react-auth";
import useFarcasterLikeAction from "~/hooks/social-farcaster/useFarcasterLikeAction";
import FCastGiftModal from "./FCastGiftModal";
import { useState } from "react";
import useUserDegenAllowance from "~/hooks/user/useUserDegenAllowance";

export default function FCastActions({
  cast,
  isDetail,
  ...props
}: ViewProps & {
  cast: FarCast;
  isDetail?: boolean;
}) {
  const { authenticated, login } = usePrivy();
  const { likeCast, removeLikeCast, liked, likeCount } = useFarcasterLikeAction(
    { cast },
  );
  const [openGiftModal, setOpenGiftModal] = useState(false);
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
  const onShare = () => {};
  return (
    <>
      {isDetail ? (
        <PostDetailActions
          liked={liked}
          likeCount={likeCount}
          onLike={onLike}
          onGift={onGift}
          onShare={onShare}
          {...props}
        />
      ) : (
        <ExplorePostActions
          liked={liked}
          likeCount={likeCount}
          onLike={onLike}
          onGift={onGift}
          onShare={onShare}
          {...props}
        />
      )}

      <FCastGiftModal
        totalAllowance={totalDegenAllowance}
        remainingAllowance={remainingDegenAllowance}
        cast={cast}
        open={openGiftModal}
        onOpenChange={setOpenGiftModal}
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

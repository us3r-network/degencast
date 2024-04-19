import { ViewProps } from "react-native";
import { FarCast } from "~/services/farcaster/types";
import { usePrivy } from "@privy-io/react-auth";
import useFarcasterLikeAction from "~/hooks/social-farcaster/useFarcasterLikeAction";
import { PostCommentActions } from "../post/PostCommentActions";
import getCastHex from "~/utils/farcaster/getCastHex";
import { UserData } from "~/utils/farcaster/user-data";
import { CommunityInfo } from "~/services/community/types/community";
import useCastPage from "~/hooks/social-farcaster/useCastPage";

export default function FCastCommentActions({
  cast,
  farcasterUserDataObj,
  communityInfo,
  ...props
}: ViewProps & {
  cast: FarCast;
  farcasterUserDataObj: { [key: string]: UserData };
  communityInfo: CommunityInfo;
}) {
  const { navigateToCastReply } = useCastPage();
  const { authenticated, login } = usePrivy();
  const { likeCast, removeLikeCast, liked, likeCount } = useFarcasterLikeAction(
    { cast },
  );
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
  const onComment = () => {
    if (!authenticated) {
      login();
      return;
    }
    const castHex = getCastHex(cast);
    navigateToCastReply(castHex, {
      cast,
      farcasterUserDataObj,
      community: communityInfo,
    });
  };
  const onRepost = () => {
    if (!authenticated) {
      login();
      return;
    }
    alert("TODO");
  };
  return (
    <>
      <PostCommentActions
        liked={liked}
        likeCount={likeCount}
        commentCount={Number(cast?.comment_count || cast?.repliesCount || 0)}
        repostCount={Number(cast.recast_count || cast.recastsCount || 0)}
        onLike={onLike}
        onComment={onComment}
        onRepost={onRepost}
        {...props}
      />
    </>
  );
}

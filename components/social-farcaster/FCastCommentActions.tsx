import { ViewProps } from "react-native";
import { FarCast } from "~/services/farcaster/types";
import { usePrivy } from "@privy-io/react-auth";
import useFarcasterLikeAction from "~/hooks/social-farcaster/useFarcasterLikeAction";
import { PostCommentActions } from "../post/PostCommentActions";
import getCastHex from "~/utils/farcaster/getCastHex";
import { UserData } from "~/utils/farcaster/user-data";
import { CommunityInfo } from "~/services/community/types/community";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import useFarcasterRecastAction from "~/hooks/social-farcaster/useFarcasterRecastAction";

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
  const { recast, removeRecast, recasted, recastCount } =
    useFarcasterRecastAction({ cast });
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
    if (recasted) {
      // removeRecast();
      alert("already recasted");
    } else {
      recast();
    }
  };
  return (
    <>
      <PostCommentActions
        liked={liked}
        likeCount={likeCount}
        commentCount={Number(cast?.comment_count || cast?.repliesCount || 0)}
        repostCount={recastCount}
        reposted={recasted}
        onLike={onLike}
        onComment={onComment}
        onRepost={onRepost}
        {...props}
      />
    </>
  );
}

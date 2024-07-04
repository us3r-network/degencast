import { ViewProps } from "react-native";
import useFarcasterLikeAction from "~/hooks/social-farcaster/useFarcasterLikeAction";
import { PostCommentActions } from "../post/PostCommentActions";
import { CommunityInfo } from "~/services/community/types/community";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import useFarcasterRecastAction from "~/hooks/social-farcaster/useFarcasterRecastAction";
import { getCastHex, getCastRepliesCount } from "~/utils/farcaster/cast-utils";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useFarcasterSigner from "~/hooks/social-farcaster/useFarcasterSigner";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import useAuth from "~/hooks/user/useAuth";

export default function FCastCommentActions({
  cast,
  communityInfo,
  ...props
}: ViewProps & {
  cast: NeynarCast;
  communityInfo: CommunityInfo;
}) {
  const { navigateToCastReply } = useCastPage();
  const { login, ready, authenticated } = useAuth();
  const { currFid } = useFarcasterAccount();
  const { requestSigner, hasSigner } = useFarcasterSigner();
  const { likeCast, removeLikeCast, liked, likeCount, likePending } =
    useFarcasterLikeAction({ cast });
  const { recast, removeRecast, recasted, recastCount, recastPending } =
    useFarcasterRecastAction({ cast });
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

  return (
    <>
      <PostCommentActions
        liked={liked}
        likeCount={likeCount}
        liking={likePending}
        commentCount={getCastRepliesCount(cast)}
        repostCount={recastCount}
        reposted={recasted}
        reposting={recastPending}
        onLike={onLike}
        onComment={onComment}
        onRepost={onRepost}
        {...props}
      />
    </>
  );
}

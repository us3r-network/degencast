import { ViewProps } from "react-native";
import { FarCast } from "~/services/farcaster/types";
import { usePrivy } from "@privy-io/react-auth";
import useFarcasterLikeAction from "~/hooks/social-farcaster/useFarcasterLikeAction";
import { PostCommentActions } from "../post/PostCommentActions";

export default function FCastCommentActions({
  cast,
  ...props
}: ViewProps & {
  cast: FarCast;
}) {
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
    alert("TODO");
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

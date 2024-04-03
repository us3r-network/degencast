import { ViewProps } from "react-native";
import { FarCast } from "~/services/farcaster/types";
import { ExplorePostActions } from "../post/PostActions";
import { usePrivy } from "@privy-io/react-auth";
import useFarcasterLikeAction from "~/hooks/social-farcaster/useFarcasterLikeAction";

export default function FCastActions({
  cast,
  ...props
}: ViewProps & {
  cast: FarCast;
}) {
  const { authenticated, login } = usePrivy();
  const { likeCast, removeLikeCast, liked, likeCount } = useFarcasterLikeAction(
    { cast },
  );
  return (
    <ExplorePostActions
      liked={liked}
      likeCount={likeCount}
      giftCount={0}
      onLike={() => {
        if (!authenticated) {
          login();
          return;
        }

        if (liked) {
          removeLikeCast();
        } else {
          likeCast();
        }
      }}
      onGift={function (): void {}}
      onShare={function (): void {}}
      {...props}
    />
  );
}

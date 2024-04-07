import { ViewProps } from "react-native";
import { FarCast } from "~/services/farcaster/types";
import { ExplorePostActions } from "../post/PostActions";
import { usePrivy } from "@privy-io/react-auth";
import useFarcasterLikeAction from "~/hooks/social-farcaster/useFarcasterLikeAction";
import FCastGiftModal from "./FCastGiftModal";
import { useState } from "react";
import useUserDegenAllowance from "~/hooks/user/useUserDegenAllowance";

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
  const [openGiftModal, setOpenGiftModal] = useState(false);
  const { totalDegenAllowance, remainingDegenAllowance, loadDegenAllowance } =
    useUserDegenAllowance();
  return (
    <>
      <ExplorePostActions
        liked={liked}
        likeCount={likeCount}
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
        onGift={() => {
          if (!authenticated) {
            login();
            return;
          }
          loadDegenAllowance();
          setOpenGiftModal(true);
        }}
        onShare={function (): void {}}
        {...props}
      />
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

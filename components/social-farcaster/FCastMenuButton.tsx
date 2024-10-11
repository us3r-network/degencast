import { useState } from "react";
import { Pressable, View, ViewProps } from "react-native";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useFarcasterLikeAction from "~/hooks/social-farcaster/useFarcasterLikeAction";
import useFarcasterRecastAction from "~/hooks/social-farcaster/useFarcasterRecastAction";
import useFarcasterSigner from "~/hooks/social-farcaster/useFarcasterSigner";
import useUserDegenAllowance from "~/hooks/user/useUserDegenAllowance";
import { CommunityInfo } from "~/services/community/types/community";
import {
  CommentButton,
  GiftButton,
  LikeButton,
  MintButton,
  PostActionMenu,
  PostActionMenuItem,
  RepostButton,
  ShareButton,
} from "../post/PostActions";
import FCastGiftModal from "./FCastGiftModal";
import FCastMintNftModal from "./FCastMintNftModal";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { getCastHex } from "~/utils/farcaster/cast-utils";
import useAuth from "~/hooks/user/useAuth";
import useCastReply from "~/hooks/social-farcaster/useCastReply";
import useAppModals from "~/hooks/useAppModals";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { openWarpcastCast } from "~/utils/platform-sharing/warpcast";
import { Image } from "react-native";
import React from "react";

function FCastMenuButton({
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

  const castHash = cast.hash;

  return (
    <View className="z-20">
      <PostActionMenu>
        <PostActionMenuItem index={7}>
          <Pressable
            className="h-full w-full"
            onPress={() => {
              openWarpcastCast(castHash);
            }}
          >
            <Image
              source={require("~/assets/images/warpcast-icon.png")}
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </Pressable>
        </PostActionMenuItem>
        <PostActionMenuItem index={6}>
          <ShareAction
            cast={cast}
            community={communityInfo}
            proposal={proposal}
          />
        </PostActionMenuItem>
        <PostActionMenuItem index={5}>
          <TipAction cast={cast} />
        </PostActionMenuItem>
        {/* <PostActionMenuItem index={4}>
          <Link
            href={`/create${channelId ? "?channelId=" + channelId : ""}`}
            asChild
          >
            <PostActionMenuItemButton>
              <SquarePen
                size={16}
                strokeWidth={2}
                className="stroke-primary-foreground"
              />
            </PostActionMenuItemButton>
          </Link>
        </PostActionMenuItem> */}

        <PostActionMenuItem index={4}>
          <ReplyAction cast={cast} community={communityInfo} />
        </PostActionMenuItem>
        <PostActionMenuItem index={3}>
          <MintAction cast={cast} channelId={channelId} />
        </PostActionMenuItem>
        <PostActionMenuItem index={2}>
          <RecastAction cast={cast} />
        </PostActionMenuItem>
        <PostActionMenuItem index={1}>
          <LikeAction cast={cast} />
        </PostActionMenuItem>
      </PostActionMenu>
    </View>
  );
}
export default React.memo(FCastMenuButton);

function LikeAction({ cast }: { cast: NeynarCast }) {
  const { likeCast, removeLikeCast, liked, likeCount, likePending } =
    useFarcasterLikeAction({ cast });
  const onLike = () => {
    if (liked) {
      removeLikeCast();
    } else {
      likeCast();
    }
  };
  return (
    <LikeButton
      disabled={likePending}
      liked={liked}
      liking={likePending}
      likeCount={likeCount}
      onPress={onLike}
    />
  );
}

function RecastAction({ cast }: { cast: NeynarCast }) {
  const { recast, removeRecast, recasted, recastCount, recastPending } =
    useFarcasterRecastAction({ cast });
  const onRepost = () => {
    if (recasted) {
      removeRecast();
    } else {
      recast();
    }
  };
  return (
    <RepostButton
      disabled={recastPending}
      reposted={recasted}
      reposting={recastPending}
      onPress={onRepost}
    />
  );
}

function MintAction({
  cast,
  channelId,
}: {
  cast: NeynarCast;
  channelId: string;
}) {
  const { login, ready, authenticated } = useAuth();
  const [openMintNftModal, setOpenMintNftModal] = useState(false);
  return (
    <>
      {" "}
      <MintButton
        onPress={() => {
          if (!authenticated) {
            login();
            return;
          }
          setOpenMintNftModal(true);
        }}
      />{" "}
      <FCastMintNftModal
        cast={cast}
        channelId={channelId}
        open={openMintNftModal}
        onOpenChange={setOpenMintNftModal}
      />
    </>
  );
}

function ReplyAction({
  cast,
  community,
}: {
  cast: NeynarCast;
  community: CommunityInfo;
}) {
  const { login, authenticated } = useAuth();
  const { currFid } = useFarcasterAccount();
  const { requestSigner, hasSigner } = useFarcasterSigner();
  const { navigateToCastReply } = useCastReply();
  const castHash = getCastHex(cast);
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
      community,
    });
  };
  return <CommentButton onPress={onComment} />;
}

function TipAction({ cast }: { cast: NeynarCast }) {
  const { totalDegenAllowance, remainingDegenAllowance, loadDegenAllowance } =
    useUserDegenAllowance();
  const { login, authenticated } = useAuth();
  const [openGiftModal, setOpenGiftModal] = useState(false);
  const onGift = () => {
    if (!authenticated) {
      login();
      return;
    }
    loadDegenAllowance();
    setOpenGiftModal(true);
  };
  return (
    <>
      <GiftButton onPress={onGift} />{" "}
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

function ShareAction({
  cast,
  community,
  proposal,
}: {
  cast: NeynarCast;
  community: CommunityInfo;
  proposal?: ProposalEntity;
}) {
  const { upsertProposalShareModal } = useAppModals();
  const onShare = () => {
    upsertProposalShareModal({
      open: true,
      cast,
      channel: community,
      proposal,
    });
  };
  return <ShareButton onPress={onShare} />;
}

import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import ChannelMetaInfo, { HomeChannelMetaInfo } from "./ChannelMetaInfo";
import { ExploreCard } from "../ExploreStyled";
import ChannelCardCasts from "./ChannelCardCasts";
import React from "react";
import { ViewRef } from "~/components/primitives/types";
import { SelectionFeedsItem } from "~/hooks/explore/useLoadSelectionFeeds";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { ActionButton } from "~/components/post/PostActions";
import { Link } from "expo-router";

type ChannelCardProps = ViewProps & SelectionFeedsItem;
const ChannelCard = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View> & ChannelCardProps
>(({ channel, casts, tokenInfo, className }, ref) => {
  const { channelId } = channel || {};
  const attentionTokenAddress = channel?.attentionTokenAddress;
  return (
    <ExploreCard
      className={cn(
        "flex flex-col gap-4 px-0",
        casts.length > 0 ? "h-[298px]" : "h-auto",
        className,
      )}
      ref={ref}
    >
      <View className={cn("w-full flex-col gap-4 px-4")}>
        {!channelId || channelId === "hoem" ? (
          <HomeChannelMetaInfo />
        ) : (
          <ChannelMetaInfo channel={channel} tokenInfo={tokenInfo} />
        )}
      </View>
      <Separator className="bg-primary/20" />

      {casts.length > 0 ? (
        <View className="w-full flex-1">
          <ChannelCardCasts
            channel={channel}
            tokenInfo={tokenInfo}
            casts={casts}
          />
        </View>
      ) : (
        <View className="flex w-full flex-row items-center justify-between px-4">
          <Text>No NFT cast now</Text>
          {channelId && (
            <Link href={`/communities/${channelId}`} asChild>
              <ActionButton className="w-auto px-3">
                <Text>Go to propose</Text>
              </ActionButton>
            </Link>
          )}
        </View>
      )}

      {/* {communityToken ? (
        <View className={cn("w-full flex-col gap-4 px-4")}>
          <ExploreTradeButton token2={communityToken} />
        </View>
      ) : (
        !attentionTokenAddress &&
        channelId &&
        isChannelHost && (
          <View className={cn("w-full flex-col gap-4 px-4")}>
            <ExploreApplyLaunchButton channelId={channelId} />
          </View>
        )
      )} */}
    </ExploreCard>
  );
});

export default ChannelCard;

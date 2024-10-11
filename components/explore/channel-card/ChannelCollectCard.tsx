import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import { ExploreCard } from "../ExploreStyled";
import React from "react";
import { ViewRef } from "@rn-primitives/types";
import { SelectionFeedsItem } from "~/hooks/explore/useLoadSelectionFeeds";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { ActionButton } from "~/components/post/PostActions";
import { Link } from "expo-router";
import ChannelMetaInfo, {
  HomeChannelMetaInfo,
} from "~/components/social-farcaster/proposal/channel-card/ChannelMetaInfo";
import ChannelCollectCardCasts from "./ChannelCollectCardCasts";

type ChannelCastCollectCardProps = ViewProps & SelectionFeedsItem;
const ChannelCastCollectCard = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View> & ChannelCastCollectCardProps
>(({ channel, casts, tokenInfo, className }, ref) => {
  const { channelId } = channel || {};
  const attentionTokenAddress = channel?.attentionTokenAddress;
  return (
    <ExploreCard
      className={cn("flex flex-col gap-4 px-0", className)}
      ref={ref}
    >
      <View className={cn("w-full flex-col gap-4 px-4")}>
        {!channelId ? (
          <HomeChannelMetaInfo />
        ) : (
          <ChannelMetaInfo channel={channel} tokenInfo={tokenInfo} />
        )}
      </View>
      {casts.length > 0 ? (
        <View className="w-full">
          <ChannelCollectCardCasts
            channel={channel}
            tokenInfo={tokenInfo}
            casts={casts}
          />
        </View>
      ) : (
        <View className="flex w-full flex-row items-center justify-between px-4">
          <Text>No casts available for minting</Text>
          {channelId ? (
            <Link href={`/communities/${channelId}/casts`} asChild>
              <ActionButton className="w-auto px-3">
                <Text>Like Now</Text>
              </ActionButton>
            </Link>
          ) : null}
        </View>
      )}
    </ExploreCard>
  );
});

export default ChannelCastCollectCard;

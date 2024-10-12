import { forwardRef, LegacyRef, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  View,
  ViewabilityConfigCallbackPairs,
} from "react-native";
import { CommunityEntity } from "~/services/community/types/community";
import {
  FCastHeightWithNftImage,
  FCastWithNftImage,
} from "../../social-farcaster/proposal/FCast";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import ProposalStatusActions, {
  ProposalStatusActionsHeight,
} from "~/components/social-farcaster/proposal/proposal-status-actions/ProposalStatusActions";
import FCastMenuButton from "~/components/social-farcaster/FCastMenuButton";
import { Loading } from "~/components/common/Loading";
import { isMobile } from "react-device-detect";

const pcItemWidth = 640;
const mobileWindowWidth = Dimensions.get("window").width;
const mobileItemWidth = mobileWindowWidth - 15 * 2;
const itemWidth = isMobile ? mobileItemWidth : pcItemWidth;
const itemHeight = FCastHeightWithNftImage + ProposalStatusActionsHeight + 15;
const ChannelCollectCardCasts = forwardRef(function (
  {
    channel,
    tokenInfo,
    casts,
  }: {
    channel?: CommunityEntity;
    tokenInfo?: AttentionTokenEntity;
    casts: Array<{
      cast: NeynarCast;
      proposal: ProposalEntity;
    }>;
  },
  ref: LegacyRef<View>,
) {
  const showCasts = casts.slice(0, 10);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showIdxs, setShowIdxs] = useState<number[]>([0]);
  const flatListRef =
    useRef<FlatList<{ cast: NeynarCast; proposal: ProposalEntity }>>(null);
  const onPressPagination = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
      });
    }
  };
  const viewabilityConfigCallbackPairs = useRef<ViewabilityConfigCallbackPairs>(
    [
      {
        viewabilityConfig: {
          itemVisiblePercentThreshold: 80,
        },
        onViewableItemsChanged: ({ viewableItems }) => {
          if (viewableItems.length > 0) {
            const index = Number(viewableItems[0].index);
            setCurrentIndex(index);
            if (index > 0) {
              setShowIdxs((pre) => {
                let newShowIdxs = [
                  index - 2,
                  index - 1,
                  index,
                  index + 1,
                  index + 2,
                ];
                newShowIdxs = newShowIdxs.filter(
                  (i) => i >= 0 && i < showCasts.length,
                );

                return Array.from(new Set([...pre, ...newShowIdxs]));
              });
            }
          }
        },
      },
    ],
  );
  return (
    <View className="relative flex w-full flex-col gap-4">
      <View
        className="w-full"
        style={{
          height: itemHeight,
        }}
      >
        <FlatList
          horizontal
          disableIntervalMomentum={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          ref={flatListRef}
          data={showCasts}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          getItemLayout={(data, index) => ({
            length: itemWidth,
            offset: itemWidth * index,
            index,
          })}
          keyExtractor={(item, index) => `${item.cast.hash}-${index}`}
          renderItem={({ item, index }) => {
            const { cast, proposal } = item;
            return (
              <View
                style={{
                  width: itemWidth,
                  height: itemHeight,
                }}
                className="flex flex-col gap-4 px-4"
              >
                {showIdxs.includes(index) ? (
                  <FCastWithNftImage
                    className="overflow-hidden"
                    cast={cast}
                    channel={channel!}
                    tokenInfo={tokenInfo}
                    proposal={proposal}
                  />
                ) : (
                  <View
                    style={{ height: FCastHeightWithNftImage }}
                    className="flex w-full flex-row items-center justify-center"
                  >
                    <Loading />
                  </View>
                )}

                <View className="flex flex-row items-center justify-between">
                  <FCastMenuButton
                    cast={cast}
                    communityInfo={channel as any}
                    proposal={proposal}
                  />
                  <ProposalStatusActions
                    cast={cast}
                    channel={channel!}
                    tokenInfo={tokenInfo}
                    proposal={proposal}
                  />
                </View>
              </View>
            );
          }}
        />
      </View>
      {showCasts.length > 1 ? (
        <Pagination
          index={currentIndex}
          data={showCasts}
          onPress={onPressPagination}
        />
      ) : null}
    </View>
  );
});
export default ChannelCollectCardCasts;

function Pagination({
  data,
  index,
  onPress,
}: {
  data: any[];
  index: number;
  onPress: (index: number) => void;
}) {
  const itemGap = 15;
  return (
    <View className="flex w-full flex-row items-center justify-center">
      <View
        className="flex w-fit flex-row items-center justify-center"
        style={{ gap: itemGap }}
      >
        {data.map((_, idx) => {
          return (
            <Pressable
              key={idx.toString()}
              className="overflow-hidden rounded-full bg-secondary/20"
              style={{
                width: 10,
                height: 10,
              }}
              onPress={() => {
                onPress(idx);
              }}
            >
              <View
                className="h-full w-full rounded-full bg-primary transition-all"
                style={{
                  width: 10,
                  height: 10,
                  opacity: index === idx ? 1 : 0,
                }}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

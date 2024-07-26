import { forwardRef, LegacyRef, useRef, useState } from "react";
import { LayoutRectangle, View } from "react-native";
import { CommunityEntity } from "~/services/community/types/community";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import FCast, { FCastHeight } from "../../social-farcaster/proposal/FCast";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import CastStatusActions, {
  CastStatusActionsHeight,
} from "~/components/social-farcaster/proposal/CastStatusActions";

const itemHeight = FCastHeight + CastStatusActionsHeight + 15;
const ChannelCardCasts = forwardRef(function (
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

  const [itemWidth, setItemWidth] = useState<number>(0);

  const carouselRef = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const onPressPagination = (index: number) => {
    carouselRef.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };
  return (
    <View className="relative flex w-full flex-col gap-4">
      <View
        className="w-full"
        style={{
          height: itemHeight,
        }}
        onLayout={(e) => {
          const layout = e.nativeEvent.layout;
          if (layout.width === 0 && layout.height === 0) return;
          setItemWidth(layout.width);
        }}
      >
        {itemWidth && (
          <Carousel
            ref={carouselRef}
            width={itemWidth}
            loop={false}
            data={showCasts}
            onProgressChange={progress}
            renderItem={({ item, index }) => {
              const { cast, proposal } = item;
              return (
                <View
                  key={index.toString()}
                  style={{
                    height: itemHeight,
                  }}
                  className="flex w-full flex-col gap-4 px-4"
                >
                  <FCast
                    className="overflow-hidden"
                    cast={cast}
                    channel={channel}
                  />
                  <CastStatusActions
                    cast={cast}
                    channel={channel!}
                    tokenInfo={tokenInfo}
                    proposal={proposal}
                  />
                </View>
              );
            }}
            style={{ flex: 1 }}
          />
        )}
      </View>
      {showCasts.length > 1 && (
        <Pagination.Basic
          progress={progress}
          data={showCasts}
          dotStyle={{
            width: 10,
            height: 10,
            backgroundColor: "rgba(163, 110, 254, 0.20)",
            borderRadius: 5,
          }}
          activeDotStyle={{
            width: 10,
            height: 10,
            backgroundColor: "#4C2896",
            borderRadius: 5,
          }}
          containerStyle={{ height: "auto", gap: 15 }}
          onPress={onPressPagination}
        />
      )}
    </View>
  );
});
export default ChannelCardCasts;

import { View, ScrollView, Platform, PanResponder } from "react-native";
import { cn } from "~/lib/utils";
import { useRef } from "react";
import { isDesktop } from "react-device-detect";
import { ScreenLoading } from "~/components/common/Loading";
import { cloneDeep } from "lodash";
import {
  SwipeEventData,
  SwipeType,
  defaultSwipeData,
} from "~/utils/userActionEvent";
import ChannelCard from "./channel-card/ChannelCard";
import useLoadTrendingChannels from "~/hooks/explore/useLoadTrendingChannels";
import { ExploreSwipeItem, itemHeight } from "./ExploreStyled";

export default function FollowingChannels() {
  const swipeData = useRef<SwipeEventData>(defaultSwipeData);
  const { items, currentIndex, setCurrentIndex } = useLoadTrendingChannels({
    swipeDataRefValue: swipeData.current,
    onViewCastActionSubmited: () => {
      swipeData.current = { ...defaultSwipeData };
    },
  });
  const indexedItems = items.map((cast, index) => ({
    ...cast,
    index,
  }));
  // 只渲染三个
  const renderItems = indexedItems.slice(
    Math.max(0, currentIndex - 1),
    Math.min(indexedItems.length, currentIndex + 2),
  );

  const offsetRemainderPrev = useRef(-1);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return true;
      },
      onPanResponderGrant(e, gestureState) {
        if (isDesktop) return;
        swipeData.current.start = { ...gestureState, timestamp: Date.now() };
      },
      onPanResponderMove: (evt, gestureState) => {
        // if (isDesktop) return;
        // if (gestureState) {
        //   swipeData.current?.move?.push({
        //     ...gestureState,
        //     timestamp: Date.now(),
        //   });
        // }
      },
      onPanResponderRelease(e, gestureState) {
        if (isDesktop) return;
        swipeData.current.end = { ...gestureState, timestamp: Date.now() };
        swipeData.current.type = SwipeType.gesture;
      },
    }),
  );

  return (
    <View style={{ flex: 1 }} className="relative bg-background">
      <View
        className={cn("w-full")}
        style={{ height: itemHeight }}
        {...panResponder.current.panHandlers}
      >
        <ScrollView
          style={{ flex: 1, height: itemHeight }}
          className="w-full items-center"
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          bounces={false}
          scrollsToTop={false}
          scrollEventThrottle={Platform.OS === "web" ? 16 : 0}
          onScroll={(event) => {
            if (Platform.OS === "web") {
              if (isDesktop && !!event.nativeEvent?.contentOffset) {
                swipeData.current.move = [
                  ...swipeData.current.move,
                  {
                    ...cloneDeep(event.nativeEvent),
                    timestamp: Date.now(),
                  },
                ];
                swipeData.current.type = SwipeType.scroll;
              }

              const offsetY = Math.ceil(event.nativeEvent.contentOffset.y);
              const index = Math.round(offsetY / itemHeight);
              const offsetRemainder = offsetY % itemHeight;
              offsetRemainderPrev.current = offsetRemainder;
              if (timer.current) clearTimeout(timer.current);
              timer.current = setTimeout(() => {
                if (offsetRemainderPrev.current === 0) {
                  const cIndex = renderItems[index].index;
                  setCurrentIndex(cIndex);
                }
              }, 50);
            }
          }}
          onMomentumScrollEnd={(event) => {
            const offsetY = event.nativeEvent.contentOffset.y;
            const index = Math.round(offsetY / itemHeight);
            const cIndex = renderItems[index].index;
            setCurrentIndex(cIndex);
          }}
          onScrollEndDrag={(event) => {
            const offsetY = event.nativeEvent.contentOffset.y;
            const index = Math.round(offsetY / itemHeight);
            const cIndex = renderItems[index].index;
            setCurrentIndex(cIndex);
          }}
        >
          {renderItems.map(({ cast, index, ...community }) => {
            return (
              <ExploreSwipeItem key={index.toString()}>
                <ChannelCard communityInfo={community} cast={cast} />
              </ExploreSwipeItem>
            );
          })}
        </ScrollView>
      </View>
      {items.length === 0 && (
        <ScreenLoading className=" absolute left-1/2 top-1/2 h-fit w-fit -translate-x-1/2 -translate-y-1/2" />
      )}
    </View>
  );
}

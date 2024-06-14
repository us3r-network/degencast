import {
  Dimensions,
  Pressable,
  View,
  ScrollView,
  Platform,
  SafeAreaView,
  PanResponder,
} from "react-native";
import FCast from "~/components/social-farcaster/FCast";
import { FCastExploreActions } from "~/components/social-farcaster/FCastActions";

import { Card } from "~/components/ui/card";
import FCastCommunity, {
  FCastCommunityDefault,
} from "~/components/social-farcaster/FCastCommunity";
import { cn } from "~/lib/utils";
import useChannelExplorePage from "~/hooks/explore/useChannelExplorePage";
import { ChannelExploreDataOrigin } from "~/features/community/channelExplorePageSlice";
import useLoadExploreCastsWithNaynar from "~/hooks/explore/useLoadExploreCastsWithNaynar";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_HEADER_HEIGHT, DEFAULT_TABBAR_HEIGHT } from "~/constants";
import { isDesktop } from "react-device-detect";
import { ScreenLoading } from "~/components/common/Loading";
import { cloneDeep } from "lodash";
import {
  SwipeEventData,
  SwipeType,
  defaultSwipeData,
} from "~/utils/userActionEvent";
import ChannelCard from "./channel-card/ChannelCard";

const headerHeight = DEFAULT_HEADER_HEIGHT;
const footerHeight = DEFAULT_TABBAR_HEIGHT;
const tabsListHeight = 20;
const itemPaddingTop = 15;
const itemHeight =
  Dimensions.get("window").height -
  headerHeight -
  footerHeight -
  tabsListHeight;

export default function TrendingChannels() {
  const { navigateToChannelExplore } = useChannelExplorePage();
  const swipeData = useRef<SwipeEventData>(defaultSwipeData);
  const { casts, currentCastIndex, farcasterUserDataObj, setCurrentCastIndex } =
    useLoadExploreCastsWithNaynar({
      swipeDataRefValue: swipeData.current,
      onViewCastActionSubmited: () => {
        swipeData.current = { ...defaultSwipeData };
      },
    });
  const indexedCasts = casts.map((cast, index) => ({ ...cast, index }));
  // 只渲染三个
  const renderCasts = indexedCasts.slice(
    Math.max(0, currentCastIndex - 1),
    Math.min(indexedCasts.length, currentCastIndex + 2),
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
    <View style={{ flex: 1 }} className="bg-background">
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
                  const castIndex = renderCasts[index].index;
                  setCurrentCastIndex(castIndex);
                }
              }, 50);
            }
          }}
          onMomentumScrollEnd={(event) => {
            const offsetY = event.nativeEvent.contentOffset.y;
            const index = Math.round(offsetY / itemHeight);
            const castIndex = renderCasts[index].index;
            setCurrentCastIndex(castIndex);
          }}
          onScrollEndDrag={(event) => {
            const offsetY = event.nativeEvent.contentOffset.y;
            const index = Math.round(offsetY / itemHeight);
            const castIndex = renderCasts[index].index;
            setCurrentCastIndex(castIndex);
          }}
        >
          {renderCasts.map(({ data, platform, community, index }) => {
            return (
              <View
                key={index.toString()}
                className={cn(
                  "flex w-full px-4 sm:max-w-screen-sm sm:px-0",
                  isDesktop && " w-screen",
                )}
                style={{
                  ...(!isDesktop
                    ? { width: Dimensions.get("window").width }
                    : {}),
                  height: itemHeight,
                  paddingTop: itemPaddingTop,
                }}
              >
                <View
                  style={{
                    height: itemHeight - itemPaddingTop,
                  }}
                >
                  <ChannelCard
                    communityInfo={community}
                    cast={data}
                    farcasterUserDataObj={farcasterUserDataObj}
                  />
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
      {casts.length === 0 && (
        <ScreenLoading className=" fixed left-1/2 top-1/2 h-fit w-fit -translate-x-1/2 -translate-y-1/2" />
      )}
    </View>
  );
}

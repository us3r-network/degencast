import { useRouter } from "expo-router";
import { Dimensions, FlatList, Pressable, View } from "react-native";
import { GestureHandlerRootView, State } from "react-native-gesture-handler";
import Animated, { useSharedValue } from "react-native-reanimated";
import CardSwipe from "~/components/common/CardSwipe";
import FCast from "~/components/social-farcaster/FCast";
import FCastActions from "~/components/social-farcaster/FCastActions";

import { Card } from "~/components/ui/card";
import FCastCommunity, {
  FCastCommunityDefault,
} from "~/components/social-farcaster/FCastCommunity";
import useLoadExploreCasts, {
  MAX_VISIBLE_ITEMS,
} from "~/hooks/explore/useLoadExploreCasts";
import { cn } from "~/lib/utils";
import getCastHex from "~/utils/farcaster/getCastHex";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import { CastDetailDataOrigin } from "~/features/cast/castPageSlice";
import useChannelExplorePage from "~/hooks/explore/useChannelExplorePage";
import { ChannelExploreDataOrigin } from "~/features/community/channelExplorePageSlice";
import useLoadExploreCastsWithNaynar from "~/hooks/explore/useLoadExploreCastsWithNaynar";
// import useLoadScrollingExploreCasts from "~/hooks/explore/useLoadScrollingExploreCasts";
import { useRef, useState } from "react";

export default function ExploreScreenScroll() {
  const { casts, currentCastIndex, farcasterUserDataObj, setCurrentCastIndex } =
    useLoadExploreCastsWithNaynar();
  // const navigation = useNavigation();
  const { navigateToCastDetail } = useCastPage();
  const { navigateToChannelExplore } = useChannelExplorePage();
  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: {
        viewAreaCoveragePercentThreshold: 80,
      },
      onViewableItemsChanged: ({ viewableItems, changed }: any) => {
        if (viewableItems.length === 1) {
          setCurrentCastIndex(viewableItems?.[0]?.index || 0);
        }
      },
    },
  ]);
  const itemHeight = Dimensions.get("window").height - 64 - 98;

  const flatListRef = useRef<FlatList<any>>(null);

  return (
    <View className={cn("flex-1 bg-background pt-16")}>
      <View className={cn("h-full w-full")}>
        <FlatList
          ref={flatListRef}
          style={{ flex: 1 }}
          className="h-full w-full items-center"
          data={casts}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          initialNumToRender={2}
          disableIntervalMomentum={true}
          pagingEnabled={true}
          decelerationRate={0}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          getItemLayout={(item, index) => {
            return {
              length: itemHeight,
              offset: itemHeight * index,
              index,
            };
          }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const { data, platform, community } = item as any;

            return (
              <View
                className={cn("h-full w-fit py-2 ")}
                style={{
                  height: itemHeight,
                }}
              >
                <Card
                  className={cn(
                    "box-border h-full w-[calc(100vw-40px)] rounded-2xl border-none sm:w-[390px]",
                  )}
                  style={{
                    height: itemHeight - 60,
                  }}
                >
                  <Pressable
                    className={cn("h-full w-full overflow-hidden p-5")}
                    onPress={() => {
                      navigateToChannelExplore(community?.channelId || "home", {
                        origin: ChannelExploreDataOrigin.Explore,
                        cast: data,
                        farcasterUserDataObj: farcasterUserDataObj,
                        community,
                      });
                      // if (community?.channelId) {
                      //   navigateToChannelExplore(community.channelId, {
                      //     origin: ChannelExploreDataOrigin.Explore,
                      //     cast: data,
                      //     farcasterUserDataObj: farcasterUserDataObj,
                      //     community,
                      //   });
                      // } else {
                      //   const castHex = getCastHex(data);
                      //   navigateToCastDetail(castHex, {
                      //     origin: CastDetailDataOrigin.Explore,
                      //     cast: data,
                      //     farcasterUserDataObj: farcasterUserDataObj,
                      //     community,
                      //   });
                      // }
                    }}
                  >
                    <FCast
                      cast={data}
                      farcasterUserDataObj={farcasterUserDataObj}
                    />
                  </Pressable>
                  <FCastActions
                    className=" absolute bottom-14 right-3"
                    cast={data}
                    farcasterUserDataObj={farcasterUserDataObj}
                    communityInfo={community}
                  />
                  {community?.channelId ? (
                    <FCastCommunity
                      communityInfo={community}
                      className="absolute -bottom-11 right-1/2 translate-x-1/2"
                    />
                  ) : (
                    <FCastCommunityDefault className="absolute -bottom-11 right-1/2 translate-x-1/2" />
                  )}
                </Card>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

function ExploreScreenDrag() {
  const { casts, currentCastIndex, removeCast, farcasterUserDataObj } =
    useLoadExploreCasts();
  const animatedValue = useSharedValue(0);
  const router = useRouter();
  // const navigation = useNavigation();
  const { navigateToCastDetail } = useCastPage();
  const { navigateToChannelExplore } = useChannelExplorePage();
  return (
    <View className={cn("flex-1 overflow-y-hidden bg-background pb-11 pt-16")}>
      <View className={cn("h-full w-full sm:mx-auto sm:my-0 sm:w-[430px]")}>
        <GestureHandlerRootView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {casts.map(({ data, platform, community }, idx) => {
            if (
              idx > currentCastIndex + MAX_VISIBLE_ITEMS - 1 ||
              idx < currentCastIndex
            ) {
              return null;
            }
            let backgroundColor = "#FFFFFF";
            // if (currentCastIndex + 1 === idx) {
            //   backgroundColor = "rgba(255, 255, 255, 0.80)";
            // }
            if (currentCastIndex + 2 === idx) {
              backgroundColor = "rgba(255, 255, 255, 0.60)";
            }
            return (
              <CardSwipe
                key={data.id}
                animatedValue={animatedValue}
                maxVisibleItems={MAX_VISIBLE_ITEMS}
                index={idx}
                currentIndex={currentCastIndex}
                backgroundColor={backgroundColor}
                onNext={() => {
                  removeCast(idx);
                }}
              >
                <Card
                  className={cn(
                    // 卡片高度 = 100vh - 顶部标题栏(64) - 底部导航栏(98) - 底部空白空间(66) - 顶部空白空间(34) - 后面两个卡片上移空间(20)
                    "h-[calc(100vh-64px-98px-66px-34px-20px)] w-[calc(100vw-40px)] rounded-2xl border-none sm:max-h-[690px] sm:w-[390px]",
                    "bg-transparent",
                  )}
                >
                  <Pressable
                    className={cn("h-full w-full overflow-hidden p-5")}
                    onPress={() => {
                      if (community?.channelId) {
                        navigateToChannelExplore(community.channelId, {
                          origin: ChannelExploreDataOrigin.Explore,
                          cast: data,
                          farcasterUserDataObj: farcasterUserDataObj,
                          community,
                        });
                      } else {
                        const castHex = getCastHex(data);
                        navigateToCastDetail(castHex, {
                          origin: CastDetailDataOrigin.Explore,
                          cast: data,
                          farcasterUserDataObj: farcasterUserDataObj,
                          community,
                        });
                      }
                    }}
                  >
                    <FCast
                      cast={data}
                      farcasterUserDataObj={farcasterUserDataObj}
                    />
                  </Pressable>
                  <FCastActions
                    className=" absolute bottom-14 right-3"
                    cast={data}
                    farcasterUserDataObj={farcasterUserDataObj}
                    communityInfo={community}
                  />
                  {community ? (
                    <FCastCommunity
                      communityInfo={community}
                      className="absolute -bottom-11 right-1/2 translate-x-1/2"
                    />
                  ) : (
                    <FCastCommunityDefault className="absolute -bottom-11 right-1/2 translate-x-1/2" />
                  )}
                </Card>
              </CardSwipe>
            );
          })}
        </GestureHandlerRootView>
      </View>
    </View>
  );
}

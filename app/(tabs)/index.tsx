import { useRouter } from "expo-router";
import {
  Dimensions,
  Pressable,
  View,
  ScrollView,
  Platform,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
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
import { useRef } from "react";

export default function ExploreScreenScroll() {
  const { navigateToChannelExplore } = useChannelExplorePage();
  const { casts, currentCastIndex, farcasterUserDataObj, setCurrentCastIndex } =
    useLoadExploreCastsWithNaynar();
  const indexedCasts = casts.map((cast, index) => ({ ...cast, index }));
  // 只渲染三个
  const renderCasts = indexedCasts.slice(
    Math.max(0, currentCastIndex - 1),
    Math.min(indexedCasts.length, currentCastIndex + 2),
  );

  const itemHeight = Dimensions.get("window").height - 64 - 98;
  const offsetRemainderPrev = useRef(-1);
  const timer = useRef<NodeJS.Timeout | null>(null);
  return (
    <View className={cn("flex-1 bg-background pt-16")}>
      <View className={cn("h-full w-full")} style={{ height: itemHeight }}>
        <ScrollView
          style={{ flex: 1 }}
          className="h-full w-full items-center"
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          bounces={false}
          scrollsToTop={false}
          scrollEventThrottle={Platform.OS === "web" ? 16 : 0}
          onScroll={(event) => {
            if (Platform.OS === "web") {
              const offsetY = event.nativeEvent.contentOffset.y;
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
          })}
        </ScrollView>
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

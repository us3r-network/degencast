import {
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import {
  Dimensions,
  PanResponder,
  Platform,
  Pressable,
  SafeAreaView,
  View,
} from "react-native";
import FCast from "~/components/social-farcaster/FCast";
import FCastCommunity, {
  FCastCommunityDefault,
} from "~/components/social-farcaster/FCastCommunity";
import { cn } from "~/lib/utils";
import getCastHex from "~/utils/farcaster/getCastHex";
import { useNavigation } from "expo-router";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import { CastDetailDataOrigin } from "~/features/cast/castPageSlice";
import useLoadChannelExploreCasts from "~/hooks/explore/useLoadChannelExploreCasts";
import useLoadCommunityDetail from "~/hooks/community/useLoadCommunityDetail";
import { useEffect, useMemo, useRef } from "react";
import { ScrollView } from "react-native-gesture-handler";
import useChannelExplorePage from "~/hooks/explore/useChannelExplorePage";
import { SocialPlatform } from "~/services/farcaster/types";
import { ChannelExploreDataOrigin } from "~/features/community/channelExplorePageSlice";
import GoBackButton from "~/components/common/GoBackButton";
import GoHomeButton from "~/components/common/GoHomeButton";
import { FCastDetailActions } from "~/components/social-farcaster/FCastActions";
import { isDesktop } from "react-device-detect";
import { ScreenLoading } from "~/components/common/Loading";
import {
  SwipeEventData,
  SwipeType,
  defaultSwipeData,
} from "~/utils/userActionEvent";
import { cloneDeep } from "lodash";

const headerHeight = 70;
const footerHeight = 70;
const itemHeight =
  Dimensions.get("window").height - headerHeight - footerHeight;

export default function ChannelExploreScreen() {
  const navigation = useNavigation();
  const { navigateToCastDetail } = useCastPage();
  const params = useLocalSearchParams<{ channelId: string }>();
  const { channelId } = params as { channelId: string };
  const globalParams = useGlobalSearchParams<{ cast?: string }>();
  const { cast: castHex } = globalParams || {};

  const { channelExploreData } = useChannelExplorePage();
  const { communityDetail, communityBasic, loadCommunityDetail } =
    useLoadCommunityDetail(channelId);

  useEffect(() => {
    if (!communityDetail) {
      loadCommunityDetail();
    }
  }, [communityDetail, loadCommunityDetail]);

  const channelPageData = channelExploreData?.[channelId];
  const {
    cast: channelPageCast,
    farcasterUserDataObj: channelPageCastUserDataObj,
  } = channelPageData || {};

  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];
  const showGoHomeBtn = prevRoute?.name !== "(tabs)";

  const cast = useMemo(() => {
    return channelPageCast && castHex && castHex === getCastHex(channelPageCast)
      ? channelPageCast
      : undefined;
  }, [channelPageCast, castHex]);

  const community = useMemo(() => {
    return communityDetail || communityBasic;
  }, [communityDetail, communityBasic]);

  const initCast = useMemo(() => {
    return cast
      ? {
          platform: SocialPlatform.Farcaster,
          data: cast,
        }
      : null;
  }, [cast]);

  const swipeData = useRef<SwipeEventData>(defaultSwipeData);
  const {
    casts,
    farcasterUserDataObj: exploreFarcasterUserDataObj,
    currentCastIndex,
    setCurrentCastIndex,
  } = useLoadChannelExploreCasts({
    channelId: channelId === "home" ? "" : channelId,
    initCast,
    swipeDataRefValue: swipeData.current,
    onViewCastActionSubmited: () => {
      swipeData.current = { ...defaultSwipeData };
    },
  });

  const currItem = casts[currentCastIndex];

  const farcasterUserDataObj = {
    ...(channelPageCastUserDataObj || {}),
    ...exploreFarcasterUserDataObj,
  };

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
        // if (isDesktop) return;
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
        // if (isDesktop) return;
        swipeData.current.end = { ...gestureState, timestamp: Date.now() };
        swipeData.current.type = SwipeType.gesture;
      },
    }),
  );
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      <Stack.Screen
        options={{
          contentStyle: { backgroundColor: "white" },
          header: () => (
            <View
              className="flex w-full flex-row items-center justify-between  bg-white"
              style={{
                height: headerHeight,
                paddingLeft: 15,
                paddingRight: 15,
              }}
            >
              <View className="flex-row items-center gap-3">
                <GoBackButton
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
                {showGoHomeBtn && (
                  <GoHomeButton
                    onPress={() => {
                      navigation.navigate("index" as never);
                    }}
                  />
                )}
              </View>
              <View>
                {currItem?.data && (
                  <FCastDetailActions
                    cast={currItem.data!}
                    farcasterUserDataObj={farcasterUserDataObj}
                    communityInfo={community}
                  />
                )}
              </View>
            </View>
          ),
        }}
      />
      {casts.length === 0 && (
        <ScreenLoading className=" fixed left-1/2 top-1/2 h-fit w-fit -translate-x-1/2 -translate-y-1/2" />
      )}
      <View className={cn("w-full flex-col")}>
        <View
          className="w-full"
          style={{ height: itemHeight }}
          {...panResponder.current.panHandlers}
        >
          <ScrollView
            style={{ flex: 1, height: itemHeight }}
            className="w-full"
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
            {renderCasts.map(({ data, platform, index }) => {
              return (
                <View
                  key={index.toString()}
                  className={cn(
                    "mx-auto h-full sm:max-w-screen-sm",
                    isDesktop && " w-screen",
                  )}
                  style={{
                    ...(!isDesktop
                      ? { width: Dimensions.get("window").width }
                      : {}),
                    height: itemHeight,
                  }}
                >
                  <Pressable
                    className={cn(
                      "box-border h-full w-full overflow-hidden p-4",
                    )}
                    onPress={() => {
                      const castHex = getCastHex(data);
                      // router.push(`/casts/${castHex}`);
                      navigateToCastDetail(castHex, {
                        origin: CastDetailDataOrigin.ChannelCastExplore,
                        cast: data,
                        farcasterUserDataObj: farcasterUserDataObj,
                        community: community,
                      });
                    }}
                  >
                    <FCast
                      className="h-full w-full overflow-hidden"
                      cast={data}
                      farcasterUserDataObj={farcasterUserDataObj}
                      webpageImgIsFixedRatio={true}
                      viewMoreWordLimits={isDesktop ? 200 : 50}
                    />
                  </Pressable>
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View className="mx-auto w-full sm:max-w-screen-sm">
          {community?.channelId ? (
            <FCastCommunity
              className="w-full rounded-b-none"
              communityInfo={community}
            />
          ) : (
            <FCastCommunityDefault className="w-full rounded-b-none" />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

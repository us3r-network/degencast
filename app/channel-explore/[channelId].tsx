import {
  Link,
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import {
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  View,
} from "react-native";
import FCast from "~/components/social-farcaster/FCast";
import FCastActions from "~/components/social-farcaster/FCastActions";
import FCastCommunity, {
  FCastCommunityDefault,
} from "~/components/social-farcaster/FCastCommunity";
import { cn } from "~/lib/utils";
import getCastHex from "~/utils/farcaster/getCastHex";
import { useNavigation } from "expo-router";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import { CastDetailDataOrigin } from "~/features/cast/castPageSlice";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useLoadChannelExploreCasts from "~/hooks/explore/useLoadChannelExploreCasts";
import useLoadCommunityDetail from "~/hooks/community/useLoadCommunityDetail";
import { useEffect, useMemo, useRef } from "react";
import { ScrollView } from "react-native-gesture-handler";
import useChannelExplorePage from "~/hooks/explore/useChannelExplorePage";
import { SocialPlatform } from "~/services/farcaster/types";
import { ChannelExploreDataOrigin } from "~/features/community/channelExplorePageSlice";
import { Home } from "~/components/common/Icons";

export default function ChannelExploreScreen() {
  const navigation = useNavigation();
  const { navigateToCastDetail } = useCastPage();
  const { channelId } = useLocalSearchParams<{ channelId: string }>();
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
    origin: channelPageOrigin,
    cast: channelPageCast,
    farcasterUserDataObj: channelPageCastUserDataObj,
  } = channelPageData || {};

  const showGoHomeBtn = ![ChannelExploreDataOrigin.Explore].includes(
    channelPageOrigin,
  );

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

  const {
    casts,
    farcasterUserDataObj: exploreFarcasterUserDataObj,
    currentCastIndex,
    setCurrentCastIndex,
  } = useLoadChannelExploreCasts({
    channelId: channelId === "home" ? "" : channelId,
    initCast,
  });

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

  const itemHeight = Dimensions.get("window").height - 64 - 90;
  const offsetRemainderPrev = useRef(-1);
  const timer = useRef<NodeJS.Timeout | null>(null);
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      <Stack.Screen
        options={{
          contentStyle: { backgroundColor: "white" },
          header: () => (
            <View className="flex flex-row items-center justify-between  bg-white">
              <View className="flex flex-row items-center">
                <View className="w-fit flex-row items-center gap-3 p-3 ">
                  <Button
                    className="rounded-full bg-[#a36efe1a]"
                    size={"icon"}
                    variant={"ghost"}
                    onPress={() => {
                      navigation.goBack();
                    }}
                  >
                    <BackArrowIcon />
                  </Button>
                  {showGoHomeBtn && (
                    <Button
                      className="rounded-full bg-[#a36efe1a]"
                      size={"icon"}
                      variant={"ghost"}
                      onPress={() => {
                        navigation.navigate("index" as never);
                      }}
                    >
                      <Home
                        className=" stroke-primary"
                        size={16}
                        strokeWidth={3}
                      />
                    </Button>
                  )}
                </View>
              </View>
              <View className="flex flex-row items-center gap-3 pr-3">
                <Link href={`/create?channelId=${channelId}` as any} asChild>
                  <Button variant={"secondary"} size={"sm"}>
                    <Text className=" text-base font-medium">Cast</Text>
                  </Button>
                </Link>
              </View>
            </View>
          ),
        }}
      />
      <View className={cn("h-full w-full flex-col")}>
        <View className="w-full flex-1">
          <ScrollView
            style={{ flex: 1 }}
            className="h-full w-full"
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
            {renderCasts.map(({ data, platform, index }) => {
              return (
                <View
                  key={index.toString()}
                  className={cn(
                    "relative mx-auto h-full w-full border-none sm:max-w-screen-sm",
                  )}
                  style={{ height: itemHeight }}
                >
                  <Pressable
                    className={cn(
                      "box-border h-full w-full overflow-hidden p-5 pb-1",
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
                    />
                  </Pressable>
                  <FCastActions
                    className=" absolute bottom-[10px] right-5"
                    cast={data}
                    farcasterUserDataObj={farcasterUserDataObj}
                    communityInfo={community}
                  />
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

function BackArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M2.10347 8.88054C1.61698 8.39405 1.61698 7.60586 2.10347 7.11937L7.88572 1.33713C8.11914 1.10371 8.43573 0.972572 8.76583 0.972572C9.09594 0.972572 9.41252 1.10371 9.64594 1.33713C9.87936 1.57055 10.0105 1.88713 10.0105 2.21724C10.0105 2.54734 9.87936 2.86393 9.64594 3.09735L4.74334 7.99996L9.64594 12.9026C9.87936 13.136 10.0105 13.4526 10.0105 13.7827C10.0105 14.1128 9.87936 14.4294 9.64594 14.6628C9.41252 14.8962 9.09594 15.0273 8.76583 15.0273C8.43573 15.0273 8.11914 14.8962 7.88572 14.6628L2.10347 8.88054Z"
        fill="#4C2896"
      />
    </svg>
  );
}

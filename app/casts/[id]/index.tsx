import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo } from "react";
import { View, Text, SafeAreaView, FlatList, Pressable } from "react-native";
import GoBackButton from "~/components/common/GoBackButton";
import GoHomeButton from "~/components/common/GoHomeButton";
import { Loading } from "~/components/common/Loading";
import FCast from "~/components/social-farcaster/FCast";
import { FCastDetailActions } from "~/components/social-farcaster/FCastActions";
import FCastComment from "~/components/social-farcaster/FCastComment";
import FCastCommunity, {
  FCastCommunityDefault,
} from "~/components/social-farcaster/FCastCommunity";
import { Separator } from "~/components/ui/separator";
import { CastDetailDataOrigin } from "~/features/cast/castPageSlice";
import useLoadCommunityDetail from "~/hooks/community/useLoadCommunityDetail";
import useWarpcastChannels from "~/hooks/community/useWarpcastChannels";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import useLoadCastComments from "~/hooks/social-farcaster/useLoadCastComments";
import useLoadCastDetail from "~/hooks/social-farcaster/useLoadCastDetail";
import useLoadNeynarCastDetail from "~/hooks/social-farcaster/useLoadNeynarCastDetail";
import { CommunityInfo } from "~/services/community/types/community";

import { FarCast } from "~/services/farcaster/types";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import {
  getCastHex,
  getCastParentUrl,
  getCastRepliesCount,
  isNeynarCast,
} from "~/utils/farcaster/cast-utils";
import { UserData } from "~/utils/farcaster/user-data";

export default function CastDetail() {
  const params = useLocalSearchParams();
  const { id, fid } = params as { id: string; fid?: string };
  const { castDetailData } = useCastPage();
  const data = castDetailData?.[id as string];
  const { cast } = data || {};
  if (cast) {
    const isNeynar = isNeynarCast(cast);
    if (isNeynar) {
      return <CachedNeynarCastDetail />;
    }
    return <CachedCastDetail />;
  }
  return <FetchedCastDetail />;
}

function CachedCastDetail() {
  const params = useLocalSearchParams();
  const { id } = params as { id: string };
  const { castDetailData } = useCastPage();
  const data = castDetailData?.[id as string];
  const {
    cast: cachedCast,
    farcasterUserDataObj: cachedFarcasterUserDataObj,
    community: cachedCommunity,
  } = data;

  // get cast info
  const {
    cast: fetchedCast,
    farcasterUserDataObj: fetchedFarcasterUserDataObj,
    loading: castLoading,
    loadCastDetail,
  } = useLoadCastDetail();
  useEffect(() => {
    if (id) {
      loadCastDetail(id as string);
    }
  }, [id, loadCastDetail]);

  // get community info
  const parentUrl = getCastParentUrl(cachedCast);
  const { warpcastChannels } = useWarpcastChannels();
  const channel = useMemo(() => {
    return warpcastChannels.find((item) => item.url === parentUrl);
  }, [warpcastChannels, parentUrl]);
  const channelId = channel?.id;

  const {
    communityDetail,
    communityBasic,
    loading: communityLoading,
    loadCommunityDetail,
  } = useLoadCommunityDetail(channelId!);

  const cast = { ...cachedCast, repliesCount: fetchedCast?.repliesCount || "" };
  const farcasterUserDataObj =
    fetchedFarcasterUserDataObj || cachedFarcasterUserDataObj;
  const community = communityDetail || communityBasic || cachedCommunity;

  useEffect(() => {
    if (!communityDetail) {
      loadCommunityDetail();
    }
  }, [communityDetail, loadCommunityDetail]);
  return (
    <CastDetailWithData
      castLoading={false}
      cast={cast}
      farcasterUserDataObj={farcasterUserDataObj}
      community={community}
    />
  );
}

function CachedNeynarCastDetail() {
  const params = useLocalSearchParams();
  const { id } = params as { id: string };
  const { castDetailData } = useCastPage();
  const data = castDetailData?.[id as string];
  const { community: cachedCommunity } = data;
  const cachedCast = data.cast as NeynarCast;

  const {
    cast: fetchedNeynarCast,
    loading: neynarCastLoading,
    loadNeynarCastDetail,
  } = useLoadNeynarCastDetail();
  useEffect(() => {
    if (id) {
      loadNeynarCastDetail(id as string);
    }
  }, [id, loadNeynarCastDetail]);

  // get community info
  const parentUrl = getCastParentUrl(cachedCast);
  const { warpcastChannels } = useWarpcastChannels();
  const channel = useMemo(() => {
    return warpcastChannels.find((item) => item.url === parentUrl);
  }, [warpcastChannels, parentUrl]);
  const channelId = channel?.id;

  const {
    communityDetail,
    communityBasic,
    loading: communityLoading,
    loadCommunityDetail,
  } = useLoadCommunityDetail(channelId!);

  const cast = { ...cachedCast, ...fetchedNeynarCast };
  const community = communityDetail || communityBasic || cachedCommunity;

  useEffect(() => {
    if (!communityDetail) {
      loadCommunityDetail();
    }
  }, [communityDetail, loadCommunityDetail]);
  return (
    <CastDetailWithData castLoading={false} cast={cast} community={community} />
  );
}

function FetchedCastDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const { id } = params as { id: string };

  // get cast info
  const {
    cast: fetchedNeynarCast,
    loading: neynarCastLoading,
    loadNeynarCastDetail,
  } = useLoadNeynarCastDetail();
  useEffect(() => {
    if (id) {
      loadNeynarCastDetail(id as string);
    }
  }, [id, loadNeynarCastDetail]);

  // get community info
  const parentUrl = getCastParentUrl(fetchedNeynarCast!);
  const { warpcastChannels } = useWarpcastChannels();
  const channel = useMemo(() => {
    return warpcastChannels.find((item) => item.url === parentUrl);
  }, [warpcastChannels, parentUrl]);
  const channelId = channel?.id;

  const {
    communityDetail,
    communityBasic,
    loading: communityLoading,
    loadCommunityDetail,
  } = useLoadCommunityDetail(channelId!);
  const community = communityDetail || communityBasic;

  useEffect(() => {
    if (!communityDetail) {
      loadCommunityDetail();
    }
  }, [communityDetail, loadCommunityDetail]);

  return (
    <CastDetailWithData
      castLoading={neynarCastLoading}
      cast={fetchedNeynarCast!}
      community={community!}
    />
  );
}

function CastDetailWithData({
  castLoading,
  cast,
  farcasterUserDataObj,
  community,
}: {
  castLoading: boolean;
  cast: FarCast | NeynarCast;
  farcasterUserDataObj?: {
    [key: string]: UserData;
  };
  community: CommunityInfo;
}) {
  const { navigateToCastDetail } = useCastPage();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ id: string }>();
  const { id } = params as { id: string };

  const {
    comments,
    farcasterUserDataObj: commentsFarcasterUserDataObj,
    loading: commentsLoading,
    firstLoaded: commentsFirstLoaded,
    loadCastComments,
  } = useLoadCastComments(id);

  useEffect(() => {
    loadCastComments();
  }, [loadCastComments]);

  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];
  const showGoHomeBtn = prevRoute?.name !== "(tabs)";

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          contentStyle: { backgroundColor: "white" },
          header: () => (
            <View
              className="flex flex-row items-center justify-between bg-white"
              style={{
                height: 70,
                paddingLeft: 15,
                paddingRight: 15,
              }}
            >
              <View className="flex flex-row items-center gap-3">
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
                {cast && (
                  <FCastDetailActions
                    cast={cast!}
                    farcasterUserDataObj={farcasterUserDataObj}
                    communityInfo={community}
                  />
                )}
              </View>
            </View>
          ),
        }}
      />
      <View className=" mx-auto h-full w-full flex-col sm:w-full sm:max-w-screen-sm">
        <View className="w-full flex-1 px-4">
          <FlatList
            style={{
              flex: 1,
            }}
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={() => {
              if (castLoading) {
                return (
                  <View className="flex h-full w-full items-center justify-center">
                    <Loading />
                  </View>
                );
              }
              if (!cast) {
                return null;
              }
              return (
                <View className="mt-5">
                  <FCast
                    cast={cast}
                    farcasterUserDataObj={farcasterUserDataObj}
                    hidePoints
                  />
                  <Separator className=" my-5 bg-primary/10" />
                  <View className="mb-5 w-full">
                    <Text className=" text-base font-medium">
                      Comments ({getCastRepliesCount(cast)})
                    </Text>
                  </View>
                </View>
              );
            }}
            data={comments}
            ItemSeparatorComponent={() => (
              <Separator className=" my-3 bg-primary/10" />
            )}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onPress={() => {
                    const castHex = getCastHex(cast);
                    navigateToCastDetail(castHex, {
                      origin: CastDetailDataOrigin.Comments,
                      cast: item.data,
                      farcasterUserDataObj: commentsFarcasterUserDataObj,
                      community: community,
                    });
                    // router.push(`/casts/${castHex}`);
                  }}
                >
                  <FCastComment
                    className="flex-1"
                    cast={item.data}
                    farcasterUserDataObj={commentsFarcasterUserDataObj}
                    communityInfo={community}
                  />
                </Pressable>
              );
            }}
            keyExtractor={({ data }) => data.id}
            onEndReached={() => {
              if (
                !cast ||
                commentsLoading ||
                (commentsFirstLoaded && comments?.length === 0)
              )
                return;
              loadCastComments();
            }}
            onEndReachedThreshold={0.1}
            ListFooterComponent={() => {
              return <View className="mb-10" />;
            }}
          />
        </View>

        {community?.channelId ? (
          <FCastCommunity
            className="w-full rounded-b-none"
            communityInfo={community}
          />
        ) : (
          <FCastCommunityDefault className="w-full rounded-b-none" />
        )}
      </View>
    </SafeAreaView>
  );
}

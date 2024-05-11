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
import FCastUserInfo from "~/components/social-farcaster/FCastUserInfo";
import NeynarEmbeds from "~/components/social-farcaster/NeynarEmbeds";
import NeynarText from "~/components/social-farcaster/NeynarText";
import { Separator } from "~/components/ui/separator";
import { CastDetailDataOrigin } from "~/features/cast/castPageSlice";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import useLoadCastComments from "~/hooks/social-farcaster/useLoadCastComments";
import useLoadCastDetail from "~/hooks/social-farcaster/useLoadCastDetail";
import useLoadNeynarCastDetail from "~/hooks/social-farcaster/useLoadNeynarCastDetail";
import { CommunityInfo } from "~/services/community/types/community";

import { FarCast } from "~/services/farcaster/types";
import getCastHex from "~/utils/farcaster/getCastHex";
import { UserData } from "~/utils/farcaster/user-data";

export default function CastDetail() {
  const params = useLocalSearchParams<{ id: string; fid?: string }>();
  const { id, fid } = params;
  const { castDetailData } = useCastPage();
  const data = castDetailData?.[id as string];
  const { cast } = data || {};
  if (cast) {
    return <CachedCastDetail />;
  }
  if (fid) {
    return <FetchedNeynarCastDetail hash={id} fid={fid} />;
  }
  return <FetchedCastDetail />;
}

function CachedCastDetail() {
  const params = useLocalSearchParams();
  const { id } = params;
  const { castDetailData } = useCastPage();
  const data = castDetailData?.[id as string];
  const { origin, cast, farcasterUserDataObj, community } = data;
  return (
    <CastDetailWithData
      castLoading={false}
      cast={cast!}
      farcasterUserDataObj={farcasterUserDataObj}
      community={community!}
    />
  );
}

function FetchedNeynarCastDetail({ hash, fid }: { hash: string; fid: string }) {
  const navigation = useNavigation();
  const { cast, loading, loadNeynarCastDetail } = useLoadNeynarCastDetail();
  useEffect(() => {
    loadNeynarCastDetail(hash);
  }, [hash]);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      <Stack.Screen
        options={{
          header: () => (
            <View className="flex flex-row items-center justify-between bg-white">
              <View className="flex flex-row items-center">
                <View className="w-fit flex-row items-center gap-3 p-3 ">
                  <GoBackButton
                    onPress={() => {
                      navigation.goBack();
                    }}
                  />
                  <GoHomeButton
                    onPress={() => {
                      navigation.navigate("index" as never);
                    }}
                  />
                </View>
              </View>
            </View>
          ),
        }}
      />
      <View className=" mx-auto h-full w-full flex-col sm:w-full sm:max-w-screen-sm">
        <View className="w-full flex-1 flex-col gap-7 px-5">
          <FlatList
            ListHeaderComponent={() => {
              if (loading) {
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
                <View className="mt-5 gap-6">
                  <FCastUserInfo
                    userData={{
                      fid: cast.author.fid + "",
                      pfp: cast.author.pfp_url,
                      display: cast.author.display_name,
                      userName: cast.author.username,
                      bio: "",
                      url: "",
                    }}
                  />
                  <NeynarText text={cast.text} />
                  <NeynarEmbeds embeds={cast.embeds} />
                </View>
              );
            }}
            data={[]}
            ItemSeparatorComponent={() => <Separator className=" my-3" />}
            renderItem={({ item }) => {
              return null;
            }}
            onEndReached={() => {
              return;
            }}
            onEndReachedThreshold={1}
            ListFooterComponent={() => {
              return <View className="mb-10" />;
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function FetchedCastDetail() {
  const params = useLocalSearchParams();
  const { id } = params;
  const { cast, farcasterUserDataObj, loading, loadCastDetail } =
    useLoadCastDetail();
  useEffect(() => {
    loadCastDetail(id as string);
  }, [id]);
  // TODO - community info
  const community = null;

  return (
    <CastDetailWithData
      castLoading={loading}
      cast={cast!}
      farcasterUserDataObj={farcasterUserDataObj}
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
  cast: FarCast;
  farcasterUserDataObj: {
    [key: string]: UserData;
  };
  community: CommunityInfo;
}) {
  const { navigateToCastDetail, castDetailData } = useCastPage();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ id: string }>();
  const { id } = params;

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

  const channelPageData = castDetailData?.[id];
  const { origin: castPageOrigin } = channelPageData || {};

  const showGoHomeBtn = ![CastDetailDataOrigin.Explore].includes(
    castPageOrigin,
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          contentStyle: { backgroundColor: "white" },
          header: () => (
            <View
              className="flex flex-row items-center justify-between bg-white"
              style={{
                height: 54,
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
        <View className="w-full flex-1 px-3">
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
                  <Separator className=" my-5" />
                  <View className="mb-5 w-full">
                    <Text className=" text-base font-medium">
                      Comments (
                      {Number(cast?.comment_count || cast?.repliesCount || 0)})
                    </Text>
                  </View>
                </View>
              );
            }}
            data={comments}
            ItemSeparatorComponent={() => <Separator className=" my-3" />}
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

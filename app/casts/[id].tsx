import {
  Stack,
  useRouter,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useEffect, useMemo } from "react";
import { View, Text, SafeAreaView, FlatList, Pressable } from "react-native";
import { Loading } from "~/components/common/Loading";
import FCast from "~/components/social-farcaster/FCast";
import FCastActions, {
  CreatedFCastActions,
} from "~/components/social-farcaster/FCastActions";
import FCastComment from "~/components/social-farcaster/FCastComment";
import FCastCommunity, {
  FCastCommunityDefault,
} from "~/components/social-farcaster/FCastCommunity";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { CastDetailDataOrigin } from "~/features/cast/castPageSlice";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import useLoadCastComments from "~/hooks/social-farcaster/useLoadCastComments";
import useLoadCastDetail from "~/hooks/social-farcaster/useLoadCastDetail";
import { CommunityInfo } from "~/services/community/types/community";
import { FarCast } from "~/services/farcaster/types";
import getCastHex from "~/utils/farcaster/getCastHex";
import { UserData } from "~/utils/farcaster/user-data";

export default function CastDetail() {
  const params = useLocalSearchParams();
  const { id } = params;
  const { getCastDetailData } = useCastPage();
  const data = useMemo(
    () => getCastDetailData(id as string),
    [id, getCastDetailData],
  );
  const { cast } = data;
  if (cast) {
    return <CachedCastDetail />;
  }
  return <FetchedCastDetail />;
}

function CachedCastDetail() {
  const params = useLocalSearchParams();
  const { id } = params;
  const { getCastDetailData } = useCastPage();
  const data = useMemo(
    () => getCastDetailData(id as string),
    [id, getCastDetailData],
  );
  const { origin, cast, farcasterUserDataObj, community } = data;
  if (origin === CastDetailDataOrigin.Created) {
    return (
      <CastDetailWithCreatedData
        cast={cast!}
        farcasterUserDataObj={farcasterUserDataObj}
        community={community!}
      />
    );
  }
  return (
    <CastDetailWithData
      castLoading={false}
      cast={cast!}
      farcasterUserDataObj={farcasterUserDataObj}
      community={community!}
    />
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

function CastDetailWithCreatedData({
  cast,
  farcasterUserDataObj,
  community,
}: {
  cast: FarCast;
  farcasterUserDataObj: {
    [key: string]: UserData;
  };
  community: CommunityInfo;
}) {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          header: () => (
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center">
                <View className="w-fit p-3 ">
                  <Button
                    className="rounded-full bg-[#a36efe1a]"
                    size={"icon"}
                    variant={"ghost"}
                    onPress={() => {
                      router.push("/");
                    }}
                  >
                    <BackArrowIcon />
                  </Button>
                </View>
                <Text className=" ml-2 text-xl font-bold  leading-none ">
                  Cast
                </Text>
              </View>
              <View className="flex flex-row items-center gap-3">
                {cast && <CreatedFCastActions cast={cast!} />}
              </View>
            </View>
          ),
        }}
      />
      <View className=" mx-auto h-full w-full flex-col sm:w-full sm:max-w-screen-sm">
        <View className="w-full flex-1 flex-col gap-7 px-5">
          <FCast
            cast={cast}
            farcasterUserDataObj={farcasterUserDataObj}
            hidePoints
          />
        </View>

        {community ? (
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
  const { navigateToCastDetail } = useCastPage();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { id } = params;

  const {
    comments,
    farcasterUserDataObj: commentsFarcasterUserDataObj,
    loading: commentsLoading,
    firstLoaded: commentsFirstLoaded,
    loadCastComments,
  } = useLoadCastComments();

  useEffect(() => {
    loadCastComments(id as string);
  }, [id]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          header: () => (
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center">
                <View className="w-fit p-3 ">
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
                </View>
                <Text className=" ml-2 text-xl font-bold  leading-none ">
                  Cast
                </Text>
              </View>
              <View className="flex flex-row items-center gap-3">
                {cast && <FCastActions cast={cast!} isDetail={true} />}
              </View>
            </View>
          ),
        }}
      />
      <View className=" mx-auto h-full w-full flex-col sm:w-full sm:max-w-screen-sm">
        <View className="w-full flex-1 flex-col gap-7 px-5">
          <FlatList
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
                  />
                </Pressable>
              );
            }}
            keyExtractor={({ data }) => data.id}
            onEndReached={() => {
              // TODO 没有分页，暂时不用加载更多
              // if (
              //   !cast ||
              //   commentsLoading ||
              //   (commentsFirstLoaded && comments?.length === 0)
              // )
              //   return;
              // loadCastComments(id as string);
            }}
            onEndReachedThreshold={1}
            ListFooterComponent={() => {
              return <View className="mb-10" />;
            }}
          />
        </View>

        {community ? (
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

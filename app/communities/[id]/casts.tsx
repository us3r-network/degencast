import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, Pressable, View } from "react-native";
import FcastMiniCard from "~/components/social-farcaster/mini/FcastMiniCard";
import useLoadCommunityCasts from "~/hooks/community/useLoadCommunityCasts";
import { Text } from "~/components/ui/text";
import { useNavigation } from "expo-router";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import getCastHex from "~/utils/farcaster/getCastHex";
import { CastDetailDataOrigin } from "~/features/cast/castPageSlice";
import { useCommunityCtx } from "./_layout";
import useChannelExplorePage from "~/hooks/explore/useChannelExplorePage";
import { ChannelExploreDataOrigin } from "~/features/community/channelExplorePageSlice";

export default function CastsScreen() {
  const { community } = useCommunityCtx();
  const { navigateToCastDetail } = useCastPage();
  const { navigateToChannelExplore } = useChannelExplorePage();
  const params = useLocalSearchParams();
  const { id } = params;
  const { casts, farcasterUserDataObj, loading, loadCasts } =
    useLoadCommunityCasts();
  useEffect(() => {
    loadCasts(id as string);
  }, [id]);

  return (
    <View className="flex-1">
      {casts.length > 0 && (
        <FlatList
          data={casts}
          numColumns={2}
          columnWrapperStyle={{ gap: 5 }}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
          renderItem={({ item }) => {
            const { data, platform } = item;
            return (
              <Pressable
                className="flex-1"
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
                      origin: CastDetailDataOrigin.Community,
                      cast: data,
                      farcasterUserDataObj: farcasterUserDataObj,
                      community,
                    });
                  }
                }}
              >
                <FcastMiniCard
                  className="flex-1"
                  cast={data}
                  farcasterUserDataObj={farcasterUserDataObj}
                />
              </Pressable>
            );
          }}
          keyExtractor={({ data, platform }) => data.id}
          onEndReached={() => {
            if (loading) return;
            loadCasts(id as string);
          }}
          onEndReachedThreshold={1}
          ListFooterComponent={() => {
            return loading ? (
              <View className="flex items-center justify-center p-5">
                <Text>Loading ...</Text>
              </View>
            ) : null;
          }}
        />
      )}
    </View>
  );
}

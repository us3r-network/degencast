import { useEffect } from "react";
import { FlatList, Pressable, View } from "react-native";
import { Loading } from "~/components/common/Loading";
import FcastMiniCard from "~/components/social-farcaster/mini/FcastMiniCard";
import { ChannelExploreDataOrigin } from "~/features/community/channelExplorePageSlice";
import useChannelExplorePage from "~/hooks/explore/useChannelExplorePage";
import useUserCasts from "~/hooks/user/useUserCasts";
import { ProfileFeedsGroups } from "~/services/farcaster/types";
import { getCastHex } from "~/utils/farcaster/cast-utils";

export function CastList({ fid }: { fid: number }) {
  const { casts, farcasterUserDataObj, loading, loadCasts } = useUserCasts();
  const { navigateToChannelExplore } = useChannelExplorePage();
  useEffect(() => {
    if (fid) loadCasts({ fid: String(fid), group: ProfileFeedsGroups.POSTS });
  }, [fid]);
  return (
    <View className="container h-full">
      {loading && casts.length === 0 ? (
        <Loading />
      ) : (
        <View className="flex-1">
          {casts.length > 0 && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={casts}
              numColumns={2}
              columnWrapperStyle={{ gap: 5 }}
              ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
              renderItem={({ item }) => {
                const { data, platform } = item;
                return (
                  <Pressable
                    className="flex-1"
                    onPress={() => {
                      const castHex = getCastHex(data);
                      navigateToChannelExplore(data.rootParentUrl || "home", {
                        origin: ChannelExploreDataOrigin.Protfolio,
                        cast: data,
                        farcasterUserDataObj: farcasterUserDataObj,
                      });
                    }}
                  >
                    <FcastMiniCard
                      cast={data}
                      farcasterUserDataObj={farcasterUserDataObj}
                    />
                  </Pressable>
                );
              }}
              keyExtractor={({ data, platform }) => data.id}
              onEndReached={() => {
                if (loading) return;
                loadCasts({
                  fid: String(fid),
                  group: ProfileFeedsGroups.POSTS,
                });
              }}
              onEndReachedThreshold={1}
              ListFooterComponent={() => {
                return loading ? <Loading /> : null;
              }}
            />
          )}
        </View>
      )}
    </View>
  );
}

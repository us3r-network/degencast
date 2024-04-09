import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, View } from "react-native";
import FcastMiniCard from "~/components/social-farcaster/mini/FcastMiniCard";
import useLoadCommunityCasts from "~/hooks/community/useLoadCommunityCasts";

export default function CastsScreen() {
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
          ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
          renderItem={({ item }) => {
            const { data, platform, community } = item;
            return (
              <FcastMiniCard
                className="flex-1"
                cast={data}
                farcasterUserDataObj={farcasterUserDataObj}
              />
            );
          }}
          keyExtractor={({ data, platform, community }) => data.id}
          onEndReached={() => {
            if (loading) return;
            loadCasts(id as string);
          }}
          onEndReachedThreshold={1}
          ListFooterComponent={() => {
            return loading ? (
              <View className="flex items-center justify-center p-5">
                Loading ...
              </View>
            ) : null;
          }}
        />
      )}
    </View>
  );
}

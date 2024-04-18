import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, Pressable, View } from "react-native";
import FcastMiniCard from "~/components/social-farcaster/mini/FcastMiniCard";
import useLoadCommunityCasts from "~/hooks/community/useLoadCommunityCasts";
import { Text } from "~/components/ui/text";
import { useNavigation } from "expo-router";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import getCastHex from "~/utils/farcaster/getCastHex";

export default function CastsScreen() {
  const navigation = useNavigation();

  const { navigateToCastDetail } = useCastPage();
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
              <Pressable
                onPress={() => {
                  const castHex = getCastHex(data);
                  navigateToCastDetail(castHex, {
                    cast: data,
                    farcasterUserDataObj: farcasterUserDataObj,
                    community,
                  });
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
          keyExtractor={({ data, platform, community }) => data.id}
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

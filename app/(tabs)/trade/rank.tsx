import { FlatList, Pressable, ScrollView, View } from "react-native";
import { CommunityInfo as CommunityInfoType } from "~/services/community/types/community";
import { CommunityInfo } from "~/components/common/CommunityInfo";
import CommunityJoinButton from "~/components/community/CommunityJoinButton";
import { Loading } from "~/components/common/Loading";
import { Text } from "~/components/ui/text";
import { Link } from "expo-router";
import useCommunityRank from "~/hooks/trade/useCommunityRank";

export default function CommunityRank() {
  const { loading, items, loadMore } = useCommunityRank();

  return (
    <View className="container h-full">
      {loading ? (
        <Loading />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} className="w-full">
          <FlatList
            data={items}
            numColumns={1}
            ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
            renderItem={({ item, index }: { item: CommunityInfoType, index:number }) => {
              return (
                <Item key={item.channelId} item={item} index={index + 1} />
              );
            }}
            onEndReached={() => {
              if (loading) return;
              loadMore();
            }}
            onEndReachedThreshold={1}
            ListFooterComponent={() => {
              return loading ? <Loading /> : null;
            }}
          />
        </ScrollView>
      )}
    </View>
  );
}

function Item({ item, index }: { item: CommunityInfoType; index: number }) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center gap-4">
        <Text className="text-md w-4 text-right font-bold">{index}</Text>{" "}
        <Link href={`/communities/${item.channelId}/casts`} asChild>
          <Pressable>
            <CommunityInfo name={item.name} logo={item.logo} />
          </Pressable>
        </Link>
      </View>
      <View className="flex-row items-center gap-2">
        <Text>{item.memberInfo.newPostNumber}</Text>
        <CommunityJoinButton communityInfo={item} />
      </View>
    </View>
  );
}

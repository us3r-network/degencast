import { Link } from "expo-router";
import { User } from "lucide-react-native";
import { useEffect } from "react";
import { FlatList, Pressable, View } from "react-native";
import { Loading } from "~/components/common/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import useCuratorRank from "~/hooks/rank/useCuratorRank";
import { Author } from "~/services/farcaster/types/neynar";
import { CuratorEntity } from "~/services/rank/types";

export default function Curators({ channel }: { channel?: string }) {
  const { loading, items, load, hasMore } = useCuratorRank(channel);
  useEffect(() => {
    load();
  }, []);
  return (
    <View className="flex h-full gap-4">
      {loading && items.length === 0 ? (
        <Loading />
      ) : (
        <View className="flex-1">
          <FlatList
            showsVerticalScrollIndicator={false}
            data={items}
            numColumns={1}
            ItemSeparatorComponent={() => <View className="h-4" />}
            renderItem={({
              item,
              index,
            }: {
              item: CuratorEntity;
              index: number;
            }) => {
              if (!item.user?.fid) return null;
              return (
                <Item key={item.user?.fid} item={item} index={index + 1} />
              );
            }}
            onEndReached={() => {
              if (loading || !hasMore) return;
              load();
            }}
            onEndReachedThreshold={1}
            ListFooterComponent={() => {
              return loading ? <Loading /> : null;
            }}
          />
        </View>
      )}
    </View>
  );
}
function Item({ item, index }: { item: CuratorEntity; index: number }) {
  return (
    <View className="flex-row items-center justify-between gap-2">
      <View className="flex-1 flex-row items-center gap-2">
        <Text className="w-6 text-center text-xs font-medium">{index}</Text>
        <Link className="flex-1" href={`/u/${item.user.fid}/wallets`} asChild>
          <Pressable>
            <UserInfo userInfo={item.user} />
          </Pressable>
        </Link>
      </View>
      <View className="flex-row items-center gap-2">
        <Text className="text-sm">{item.count} NFT</Text>
      </View>
    </View>
  );
}

function UserInfo({ userInfo }: { userInfo: Author }) {
  return (
    <View className="flex-1 flex-row items-center gap-2">
      <Avatar
        alt={userInfo.username}
        className="size-10 border-2 border-secondary bg-secondary/10"
      >
        <AvatarImage source={{ uri: userInfo.pfp_url }} />
        <AvatarFallback className="bg-white">
          <User className="text- size-16 fill-primary/80 font-medium " />
        </AvatarFallback>
      </Avatar>
      <Text className="text-base">
        {userInfo.display_name || userInfo.username}
      </Text>
    </View>
  );
}

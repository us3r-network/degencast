import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import useLoadTrendingCommunities from "~/hooks/community/useLoadTrendingCommunities";
import { CommunityInfo as CommunityInfoType } from "~/services/community/types/community";
import { CommunityInfo } from "../common/CommunityInfo";
import CommunityJoinButton from "../community/CommunityJoinButton";
import { Loading } from "../common/Loading";

export default function CommunityRank() {
  const { loading, trendingCommunities: items, loadTrendingCommunities } =
    useLoadTrendingCommunities();
  useEffect(() => {
    loadTrendingCommunities();
  }, [loadTrendingCommunities]);
  return (    <View className="container h-full">
  {loading ? (
    <Loading />
  ) : (
    <ScrollView showsVerticalScrollIndicator={false} className="w-full">
      <View className="flex w-full gap-4">
        {items?.length > 0 &&
          items.map((item, index) => (
            <Item key={item.channelId} item={item} index={index + 1} />
          ))}
      </View>
    </ScrollView>
      )}
    </View>
  );
}

function Item({ item, index }: { item: CommunityInfoType; index: number }) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center gap-4">
        <Text className="text-md w-4 text-right font-bold">{index}</Text>
        <CommunityInfo name={item.name} logo={item.logo} />
      </View>
      <View className="flex-row items-center gap-2">
        <Text>{item.memberInfo.newPostNumber}</Text>
        <CommunityJoinButton communityInfo={item} />
      </View>
    </View>
  );
}

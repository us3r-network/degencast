import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import useLoadOnchainActivities from "~/hooks/activity/useLoadOnchainActivities";
import {
  ActivityFilterType,
  ActivityOperationCatagery,
} from "~/services/community/types/activity";
import { Loading } from "../common/Loading";
import ActivityItem from "./ActivityItem";
import { SceneMap, TabView } from "react-native-tab-view";
import { OutlineTabBar } from "../layout/tab-view/TabBar";
import { ERC42069Token } from "~/services/trade/types";
import useLoadTokenOnchainActivities from "~/hooks/activity/useLoadTokenOnchainActivities";

export default function Activities({
  fid,
  type,
}: {
  fid?: number;
  type: ActivityFilterType;
}) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "proposal", title: "Proposal" },
    { key: "nfts", title: "NFTs" },
    { key: "rewards", title: "Rewards" },
  ]);
  const renderScene = SceneMap({
    proposal: () => (
      <ActivitieList
        fid={fid}
        type={type}
        operationCatagery={ActivityOperationCatagery.PROPOSAL}
      />
    ),
    nfts: () => (
      <ActivitieList
        fid={fid}
        type={type}
        operationCatagery={ActivityOperationCatagery.NFT}
      />
    ),
    rewards: () => (
      <ActivitieList
        fid={fid}
        type={type}
        operationCatagery={ActivityOperationCatagery.PROPOSAL}
      />
    ),
  });
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={OutlineTabBar}
    />
  );
}

export function ActivitieList({
  fid,
  type,
  operationCatagery,
}: {
  fid?: number;
  type: ActivityFilterType;
  operationCatagery?: ActivityOperationCatagery;
}) {
  const { items, loading, loadItems } = useLoadOnchainActivities({
    type,
    operationCatagery,
  });
  useEffect(() => {
    loadItems();
  }, []);
  return (
    <FlatList
      className="h-full flex-1 gap-4"
      contentContainerClassName="flex gap-4"
      showsHorizontalScrollIndicator={false}
      data={items}
      renderItem={({ item }) => {
        return <ActivityItem data={item} />;
      }}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={() => {
        if (loading || (!loading && items?.length === 0)) return;
        loadItems();
        return;
      }}
      onEndReachedThreshold={0.1}
      ListFooterComponent={() => {
        if (loading) {
          return <Loading />;
        }
        return <View className="mb-10" />;
      }}
    />
  );
}

export function TokenActivitieList({ token }: { token: ERC42069Token }) {
  const { items, loading, loadItems } = useLoadTokenOnchainActivities(token);
  useEffect(() => {
    loadItems();
  }, []);
  return (
    <FlatList
      className="h-full flex-1 gap-4"
      contentContainerClassName="flex gap-4"
      showsHorizontalScrollIndicator={false}
      data={items}
      renderItem={({ item }) => {
        return <ActivityItem data={item} />;
      }}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={() => {
        if (loading || (!loading && items?.length === 0)) return;
        loadItems();
        return;
      }}
      onEndReachedThreshold={0.1}
      ListFooterComponent={() => {
        if (loading) {
          return <Loading />;
        }
        return <View className="mb-10" />;
      }}
    />
  );
}

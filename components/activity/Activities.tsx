import { useEffect, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import useLoadCastOnchainActivities from "~/hooks/activity/useLoadCastOnchainActivities";
import useLoadOnchainActivities from "~/hooks/activity/useLoadOnchainActivities";
import useLoadTokenOnchainActivities from "~/hooks/activity/useLoadTokenOnchainActivities";
import {
  ActivityFilterType,
  ActivityOperationCatagery,
} from "~/services/community/types/activity";
import { ERC42069Token } from "~/services/trade/types";
import { Loading } from "../common/Loading";
import { OutlineTabBar } from "../layout/tab-view/TabBar";
import ActivityItem from "./ActivityItem";

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
        operationCatagery={ActivityOperationCatagery.REWARD}
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

export function CastActivitiesList({ castHash }: { castHash: string }) {
  const { items, loading, loadItems } = useLoadCastOnchainActivities({
    castHash,
  });
  useEffect(() => {
    loadItems();
  }, [castHash]);
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

export function DialogCastActivitiesList({ castHash }: { castHash: string }) {
  const { items, loading, loadItems } = useLoadCastOnchainActivities({
    castHash,
  });
  useEffect(() => {
    loadItems();
  }, [castHash]);

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      showsVerticalScrollIndicator={false}
      onScroll={(event) => {
        const { layoutMeasurement, contentOffset, contentSize } =
          event.nativeEvent;
        // 检查用户是否滚动到了底部
        if (
          layoutMeasurement.height + contentOffset.y >=
          contentSize.height - 40
        ) {
          if (loading || (!loading && items?.length === 0)) return;
          loadItems();
        }
      }}
      scrollEventThrottle={16}
    >
      <FlatList
        className="gap-4"
        showsHorizontalScrollIndicator={false}
        data={items}
        renderItem={({ item }) => {
          return <ActivityItem data={item} />;
        }}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => {
          // console.log("onEndReached");

          // if (loading || (!loading && items?.length === 0)) return;
          // loadItems();
          return;
        }}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => {
          if (loading) {
            return <Loading />;
          }
          return <View style={{ height: 40 }} />;
        }}
      />
    </ScrollView>
  );
}

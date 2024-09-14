import { useEffect } from "react";
// import ChannelListWithCasts from "./ChannelListWithCasts";
import useLoadProposalFeeds from "~/hooks/explore/useLoadProposalFeeds";
import ChannelListWithCollectCasts from "./ChannelListWithCollectCasts";
import { View } from "react-native";
import { Text } from "../ui/text";
import { Button } from "../ui/button";

export default function ProposalFeeds({
  navigateToCasts,
}: {
  navigateToCasts?: () => void;
}) {
  const { loadItems, loading, items, idle } = useLoadProposalFeeds();
  useEffect(() => {
    loadItems();
  }, []);
  if (!!navigateToCasts && !idle && !loading && items?.length === 0) {
    return (
      <View className="flex h-full w-full flex-col items-center justify-center gap-8">
        <Text className="text-xs text-secondary">
          No casts are currently being curated. 
        </Text>
        <Button
          variant={"secondary"}
          className="h-8 w-32 bg-[#9151C3]"
          onPress={navigateToCasts}
        >
          <Text>Curate</Text>
        </Button>
      </View>
    );
  }
  return (
    <ChannelListWithCollectCasts
      items={items}
      loading={loading}
      onEndReached={() => {
        if (loading || (!loading && items?.length === 0)) return;
        loadItems();
        return;
      }}
    />
  );
}

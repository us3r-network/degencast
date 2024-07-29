import { FlatList, View } from "react-native";
import useLoadOnchainActivities from "~/hooks/activity/useLoadOnchainActivities";
import { useEffect } from "react";
// import { Separator } from "~/components/ui/separator";
// import ActivityItem from "~/components/activity/ActivityItem";
// import { Loading } from "~/components/common/Loading";
import { useGlobalSearchParams } from "expo-router";
import AllActivities from "~/components/activity/Activities";
export default function OnchainScreen() {
  const globalParams = useGlobalSearchParams();
  const { id: channelId } = globalParams as { id: string };
  return (
    <View className="h-full w-full">
      {/* <AllActivities channelId={channelId}/> */}
    </View>
  );
}

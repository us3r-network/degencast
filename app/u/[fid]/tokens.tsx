import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";
import CommunityTokens from "~/components/portfolio/tokens/UserCommunityTokens";
import UserToekns from "~/components/portfolio/tokens/UserTokens";
import useUserBulk from "~/hooks/user/useUserBulk";

export default function UserTokensScreen() {
  const { items: userItems, load } = useUserBulk();

  const { fid } = useLocalSearchParams<{ fid: string }>();
  useEffect(() => {
    if (Number(fid)) load(Number(fid));
  }, [fid]);

  const address = useMemo(() => {
    if (!userItems || userItems.length === 0) return undefined;
    const user = userItems[0];
    if (user?.verified_addresses?.eth_addresses?.length > 0)
      return user.verified_addresses.eth_addresses[0];
  }, [userItems]);

  return (
    <ScrollView className="h-full w-full" showsVerticalScrollIndicator={false}>
      <View className="flex w-full gap-6">
        {address && <UserToekns address={address as `0x${string}`} />}
        {address && <CommunityTokens address={address as `0x${string}`} />}
      </View>
    </ScrollView>
  );
}

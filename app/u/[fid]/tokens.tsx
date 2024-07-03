import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";
import CommunityTokens from "~/components/portfolio/tokens/UserCommunityTokens";
import UserTokens from "~/components/portfolio/tokens/UserTokens";
import useUserBulk from "~/hooks/user/useUserBulk";
import { Text } from "~/components/ui/text";

export default function UserTokensScreen({ fid }: { fid: string }) {
  const { userInfo, load } = useUserBulk();

  // const { fid } = useLocalSearchParams<{ fid: string }>();
  useEffect(() => {
    if (Number(fid)) load(Number(fid));
  }, [fid]);

  const address = useMemo(() => {
    if (!userInfo) return undefined;
    if (userInfo?.verified_addresses?.eth_addresses?.length > 0)
      return userInfo.verified_addresses.eth_addresses[0];
  }, [userInfo]);

  return (
    <ScrollView className="h-full w-full" showsVerticalScrollIndicator={false}>
      {address ? (
        <View className="flex w-full gap-6">
          <UserTokens address={address as `0x${string}`} />
          <CommunityTokens address={address as `0x${string}`} />
        </View>
      ) : (
        <View>
          <Text>No Verified Address</Text>
        </View>
      )}
    </ScrollView>
  );
}

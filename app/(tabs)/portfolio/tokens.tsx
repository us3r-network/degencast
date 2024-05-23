import { ScrollView, View } from "react-native";
import { useAccount } from "wagmi";
import UserWallet from "~/components/portfolio/tokens/UserWallet";
import CommunityTokens from "~/components/portfolio/tokens/UserCommunityTokens";
import UserToekns from "~/components/portfolio/tokens/UserTokens";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useMemo } from "react";
import useUserBulk from "~/hooks/user/useUserBulk";
import { getUserFarcasterAccount } from "~/utils/privy";
import { useLocalSearchParams } from "expo-router";

export default function UserTokensScreen() {
  const account = useAccount();
  const { user } = usePrivy();
  const farcasterAccount = getUserFarcasterAccount(user);

  const { items: userItems, load } = useUserBulk(
    farcasterAccount?.fid || undefined,
  );

  const params = useLocalSearchParams();
  const fid = Number(params.fid);
  useEffect(() => {
    if (fid) load(fid);
  }, [fid]);

  const farcasterUserInfo = userItems.length > 0 ? userItems[0] : undefined;
  const verified_addresses = useMemo(
    () =>
      farcasterUserInfo?.verified_addresses?.eth_addresses
        ? farcasterUserInfo.verified_addresses.eth_addresses
        : undefined,
    [farcasterUserInfo],
  );
  const address = verified_addresses?.[0] || account?.address || undefined;
  return (
    <ScrollView className="h-full w-full" showsVerticalScrollIndicator={false}>
      <View className="flex w-full gap-6">
        {!fid && account && <UserWallet />}
        {address && <UserToekns address={address as `0x${string}`} />}
        {address && <CommunityTokens address={address as `0x${string}`} />}
      </View>
    </ScrollView>
  );
}

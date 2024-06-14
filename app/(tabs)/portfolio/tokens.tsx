import { ScrollView, View } from "react-native";
import { useAccount } from "wagmi";
import CommunityTokens from "~/components/portfolio/tokens/UserCommunityTokens";
import UserToekns from "~/components/portfolio/tokens/UserTokens";
import UserWallet from "~/components/portfolio/tokens/UserWallet";

export default function UserTokensScreen() {
  const account = useAccount();
  // const { user } = usePrivy();
  // const farcasterAccount = getUserFarcasterAccount(user);
  // const { items: userItems, load } = useUserBulk(
  //   farcasterAccount?.fid || undefined,
  // );
  // useEffect(() => {
  //   if (farcasterAccount?.fid) load(farcasterAccount?.fid);
  // }, [farcasterAccount]);

  // const farcasterUserInfo = userItems.length > 0 ? userItems[0] : undefined;
  // const verified_addresses = useMemo(
  //   () =>
  //     farcasterUserInfo?.verified_addresses?.eth_addresses
  //       ? farcasterUserInfo.verified_addresses.eth_addresses
  //       : undefined,
  //   [farcasterUserInfo],
  // );
  // const address = verified_addresses?.[0] || account?.address || undefined;
  return (
    <ScrollView className="h-full w-full" showsVerticalScrollIndicator={false}>
      <View className="flex w-full gap-6">
        {account && <UserWallet />}
        {account?.address && <UserToekns address={account?.address} />}
        {account?.address && <CommunityTokens address={account?.address} />}
      </View>
    </ScrollView>
  );
}

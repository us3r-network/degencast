import { ScrollView, View } from "react-native";
import { useAccount } from "wagmi";
import CommunityTokens from "~/components/portfolio/tokens/UserCommunityTokens";
import UserToekns from "~/components/portfolio/tokens/UserTokens";
import UserWallet from "~/components/portfolio/tokens/UserWallet";

export default function MyTokensScreen() {
  const account = useAccount();
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

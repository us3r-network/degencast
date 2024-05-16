import { ScrollView, View } from "react-native";
import { useAccount } from "wagmi";
import UserWallet from "~/components/portfolio/tokens/UserWallet";
import CommunityTokens from "~/components/portfolio/tokens/UserCommunityTokens";
import UserToekns from "~/components/portfolio/tokens/UserToekns";

export default function UserTokens() {
  const { address } = useAccount();
  return (
    <ScrollView className="h-full w-full" showsVerticalScrollIndicator={false}>
      <View className="flex w-full gap-6">
        <UserWallet />
        {address && <UserToekns address={address as `0x${string}`} />}
        {address && <CommunityTokens address={address as `0x${string}`} />}
      </View>
    </ScrollView>
  );
}

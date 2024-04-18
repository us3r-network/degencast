import { ScrollView, View } from "react-native";
import { useAccount } from "wagmi";
import Balance from "~/components/portfolio/tokens/UserBalance";
import CommunityTokens from "~/components/portfolio/tokens/UserCommunityTokens";
import Share from "~/components/portfolio/tokens/UserShare";
import Tips from "~/components/portfolio/tokens/UserTips";

export default function UserTokens() {
  const { address } = useAccount();
  return (
    <ScrollView className="h-full w-full" showsVerticalScrollIndicator={false}>
      <View className="flex w-full gap-6">
        {address && <Balance address={address as `0x${string}`} />}
        {address && <CommunityTokens address={address as `0x${string}`} />}
        {address && <Share address={address as `0x${string}`} />}
        <Tips />
      </View>
    </ScrollView>
  );
}

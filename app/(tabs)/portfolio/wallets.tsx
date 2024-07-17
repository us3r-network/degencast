import { ScrollView, View } from "react-native";
import { useAccount } from "wagmi";
import { CardWarper, PageContent } from "~/components/layout/content/Content";
import CommunityTokens from "~/components/portfolio/tokens/UserCommunityTokens";
import UserTokens from "~/components/portfolio/tokens/UserTokens";
import UserWallet from "~/components/portfolio/tokens/UserWallet";
import UserInfo from "~/components/portfolio/user/UserInfo";

export default function WalletsScreen() {
  const account = useAccount();
  return (
    <PageContent className="flex h-full gap-6">
      <View className="h-24">
        <UserInfo />
      </View>
      <CardWarper>
        <ScrollView
          className="h-full w-full"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex w-full gap-6">
            {account && <UserWallet />}
            {account?.address && <UserTokens address={account?.address} />}
            {account?.address && <CommunityTokens address={account?.address} />}
          </View>
        </ScrollView>
      </CardWarper>
    </PageContent>
  );
}

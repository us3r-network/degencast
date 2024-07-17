import { ScrollView, View } from "react-native";
import { useAccount } from "wagmi";
import { PageContent } from "~/components/layout/content/Content";
import CommunityTokens from "~/components/portfolio/tokens/UserCommunityTokens";
import UserTokens from "~/components/portfolio/tokens/UserTokens";
import UserWallet from "~/components/portfolio/tokens/UserWallet";
import UserInfo from "~/components/portfolio/user/UserInfo";
import { PortfolioPageContent } from ".";

export default function WalletsScreen() {
  const account = useAccount();
  return (
    <View className="flex h-full gap-6">
      <PageContent className="flex-none">
        <UserInfo />
      </PageContent>
      <PortfolioPageContent>
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
      </PortfolioPageContent>
    </View>
  );
}
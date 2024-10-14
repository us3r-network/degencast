import { ScrollView, View } from "react-native";
import { useAccount } from "wagmi";
import { CardWarper, PageContent } from "~/components/layout/content/Content";
import CommunityNFTs from "~/components/portfolio/tokens/UserCommunityNFTs";
import CommunityTokens from "~/components/portfolio/tokens/UserCommunityTokens";
import UserTokens from "~/components/portfolio/tokens/UserTokens";
import UserWallet from "~/components/portfolio/tokens/UserWallet";

export default function MyWalletScreen() {
  const account = useAccount();
  return (
    <PageContent>
      <CardWarper>
        <ScrollView
          className="h-full w-full"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex w-full gap-6">
            {account?.address && <UserWallet />}
            {account?.address && <UserTokens address={account?.address} />}
            {account?.address && (
              <CommunityNFTs address={account?.address} isSelf={true} />
            )}
            {account?.address && <CommunityTokens address={account?.address} />}
          </View>
        </ScrollView>
      </CardWarper>
    </PageContent>
  );
}

import { ScrollView, View } from "react-native";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { CardWarper, PageContent } from "~/components/layout/content/Content";
import CommunityNFTs from "~/components/portfolio/tokens/UserCommunityNFTs";
import CommunityTokens from "~/components/portfolio/tokens/UserCommunityTokens";
import UserTokens from "~/components/portfolio/tokens/UserTokens";
import UserWallet from "~/components/portfolio/tokens/UserWallet";
import useWalletAccount from "~/hooks/user/useWalletAccount";

export default function MyWalletScreen() {
  const {
    getActualUseWalletAddress,
  } = useWalletAccount();
  const walletAddress: Address = getActualUseWalletAddress();
  return (
    <PageContent>
      <CardWarper>
        <ScrollView
          className="h-full w-full"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex w-full gap-6">
            {walletAddress && <UserWallet />}
            {walletAddress && <UserTokens address={walletAddress} />}
            {walletAddress && (
              <CommunityNFTs address={walletAddress} isSelf={true} />
            )}
            {walletAddress && <CommunityTokens address={walletAddress} />}
          </View>
        </ScrollView>
      </CardWarper>
    </PageContent>
  );
}

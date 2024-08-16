import { useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Address } from "viem";
import { CardWarper, PageContent } from "~/components/layout/content/Content";
import CommunityNFTs from "~/components/portfolio/tokens/UserCommunityNFTs";
import CommunityTokens from "~/components/portfolio/tokens/UserCommunityTokens";
import UserTokens from "~/components/portfolio/tokens/UserTokens";
import { Text } from "~/components/ui/text";
import useUserBulk from "~/hooks/user/useUserBulk";

export default function UserWalletScreen({ fid }: { fid: number }) {
  const { userInfo, load } = useUserBulk();

  useEffect(() => {
    if (Number(fid)) load(Number(fid));
    console.log("WalletsScreen", fid);
  }, [fid]);

  const address = useMemo(() => {
    console.log("WalletsScreen", userInfo);
    if (!userInfo) return undefined;
    if (userInfo?.verified_addresses?.eth_addresses?.length > 0)
      return userInfo.verified_addresses.eth_addresses[0];
  }, [userInfo]);
  console.log("WalletsScreen", address);
  return (
    <PageContent>
      <CardWarper>
        <ScrollView
          className="h-full w-full"
          showsVerticalScrollIndicator={false}
        >
          {address ? (
            <View className="flex w-full gap-6">
              <UserTokens address={address as Address} />
              <CommunityNFTs address={address as Address} />
              <CommunityTokens address={address as Address} />
            </View>
          ) : (
            <View>
              <Text>No Verified Address</Text>
            </View>
          )}
        </ScrollView>
      </CardWarper>
    </PageContent>
  );
}

import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useCommunityCtx } from "./_layout";
import { Image } from "react-native";
import useLoadCommunityDetail from "~/hooks/community/useLoadCommunityDetail";
import { Loading } from "~/components/common/Loading";
import useUserHostChannels from "~/hooks/user/useUserHostChannels";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import CommunityAttentionTokenInfo from "~/components/community/CommunityAttentionTokenInfo";
import { Card } from "~/components/ui/card";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import { CreateTokenButton } from "~/components/onchain-actions/att/ATTCreateButton";

export default function AttentionTokenScreen() {
  const { community } = useCommunityCtx();
  const id = community?.channelId || "";
  const { communityDetail, loading, loadCommunityDetail } =
    useLoadCommunityDetail(id);
  const { currFid } = useFarcasterAccount();
  const { channels } = useUserHostChannels(Number(currFid));
  const isChannelHost = !!id && !!channels.find((channel) => channel.id === id);
  if (!communityDetail && loading) {
    return (
      <View className="flex-1 flex-col items-center justify-center">
        <Loading />
      </View>
    );
  }
  const communityInfo = { ...(communityDetail || community) };
  const attentionTokenInfo = communityInfo.attentionTokenInfo;
  const attentionTokenAddress = attentionTokenInfo?.tokenContract;
  return (
    <Card className="box-border h-full w-full flex-1 flex-col rounded-[20px] rounded-b-none p-4 pb-0">
      {attentionTokenAddress ? (
        <>
          <View className="h-full">
            <CommunityAttentionTokenInfo
              channelId={id}
              attentionTokenInfo={{
                ...attentionTokenInfo!,
                name: communityInfo.channelId || communityInfo.name,
                logo: communityInfo.logo,
                tokenStandard: "DN-420",
                chain: ATT_CONTRACT_CHAIN.name,
              }}
            />
          </View>
        </>
      ) : (
        <>
          <ScrollView
            className="mx-auto max-w-[350px] flex-1"
            contentContainerClassName="flex-col items-center justify-center"
            showsHorizontalScrollIndicator={false}
          >
            <Image
              source={require("~/assets/images/no-token.png")}
              style={{ width: 280, height: 280 }}
            />
            <Text className=" mt-7 text-center text-xl font-bold text-primary">
              Coming Soon
            </Text>
            <Text className="mt-7 text-center text-base leading-8 text-secondary">
              Onchain Channel Pass for {`\n`}
              Governance, Moderation and Monetisation
            </Text>
          </ScrollView>
          <View className=" py-5">
            <CreateTokenButton
              channelId={id}
              onComplete={() => {
                loadCommunityDetail();
              }}
              className="h-14 w-full"
              renderButtonContent={({ loading }) => {
                return loading ? (
                  <Text className="text-lg font-bold">
                    {isChannelHost ? "Launching..." : "Activating..."}
                  </Text>
                ) : (
                  <Text className="text-lg font-bold">
                    {isChannelHost ? "Launch" : "Activate"}
                  </Text>
                );
              }}
            />
          </View>
        </>
      )}
    </Card>
  );
}

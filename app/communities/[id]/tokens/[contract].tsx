import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import CommunityTokenInfo from "~/components/community/CommunityTokenInfo";
import { Card } from "~/components/ui/card";
import { useCommunityCtx } from "../_layout";

export default function TokensScreen({ route }: { route: any }) {
  const { community, tokens } = useCommunityCtx();
  const { contract } = route.params;
  const token = tokens!.find((token) => token.contract === contract);

  return (
    <Card className="box-border h-full w-full flex-1 flex-col rounded-[20px] rounded-b-none p-4 pb-0">
      {token && token?.tradeInfo ? (
        <ScrollView className="flex-1" showsHorizontalScrollIndicator={false}>
          <CommunityTokenInfo
            tokenInfo={{
              standard: token.tokenStandard,
              contract: token.contract,
              chain: token.tradeInfo.chain,
            }}
            tradeInfo={token.tradeInfo}
          />
        </ScrollView>
      ) : null}
    </Card>
  );
}

import { round } from "lodash";
import React from "react";
import { Pressable, View } from "react-native";
import { CommunityInfo } from "~/components/common/CommunityInfo";
import { ChevronDown, ChevronUp } from "~/components/common/Icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Text } from "~/components/ui/text";
import useUserCommunityShares from "~/hooks/user/useUserCommunityShares";
import { ShareInfo } from "~/services/trade/types";
import { SHARE_INFO, SHARE_TITLE, SellButton } from "../../trade/ShareButton";
import { Link } from "expo-router";
import { InfoButton } from "~/components/common/InfoButton";

const DEFAULT_ITEMS_NUM = 3;
export default function Share({ address }: { address: `0x${string}` }) {
  const { loading, items } = useUserCommunityShares(address);
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible
      className="flex w-full gap-2"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="font-interBold text-lg">
            Channel Share {loading ? "" : `(${items.length})`}
          </Text>
          <InfoButton title={SHARE_TITLE} info={SHARE_INFO} />
        </View>
        {items?.length > DEFAULT_ITEMS_NUM &&
          (open ? <ChevronUp /> : <ChevronDown />)}
      </CollapsibleTrigger>
      <View className="flex w-full gap-2">
        {items?.length > 0 &&
          items
            .slice(0, DEFAULT_ITEMS_NUM)
            .map((item) => <Item key={item.name} {...item} />)}
      </View>
      <CollapsibleContent className="flex w-full gap-2">
        {items?.length > DEFAULT_ITEMS_NUM &&
          items
            .slice(DEFAULT_ITEMS_NUM)
            .map((item) => <Item key={item.name} {...item} />)}
      </CollapsibleContent>
    </Collapsible>
  );
}

function Item(item: ShareInfo) {
  return (
    <View className="flex-row items-center justify-between">
      <Link href={`/communities/${item.channelId}/shares`} asChild>
        <Pressable>
          <CommunityInfo {...item} />
        </Pressable>
      </Link>
      <View className="flex-row items-center gap-2">
        <Text className="text-sm">{round(Number(item.amount), 2)}</Text>
        <SellButton
          logo={item.logo}
          name={item.name}
          sharesSubject={item.sharesSubject}
        />
      </View>
    </View>
  );
}

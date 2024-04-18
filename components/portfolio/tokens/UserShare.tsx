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
import useUserShares from "~/hooks/user/useUserShares";
import { ShareInfo } from "~/services/user/types";
import { SellButton } from "../ShareButton";
import { Link } from "expo-router";

const DEFAULT_ITEMS_NUM = 3;
export default function Share({ address }: { address: `0x${string}` }) {
  const { loading, items } = useUserShares(address);
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible
      className="flex w-full gap-2"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold">Share ({loading?'loading...':items.length})</Text>
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
        <Text>{round(Number(item.amount), 2)}</Text>
        <SellButton
          logo={item.logo}
          name={item.name}
          sharesSubject={item.sharesSubject}
        />
      </View>
    </View>
  );
}

import { round } from "lodash";
import React from "react";
import { Text, View } from "react-native";
import { ChevronDown, ChevronUp } from "~/components/common/Icons";
import useUserTips from "~/hooks/user/useUserTips";
import { TipsInfo } from "~/services/user/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import { CommunityInfo } from "../../common/CommunityInfo";
import { Button } from "~/components/ui/button";

const DEFAULT_ITEMS_NUM = 1;
export default function Tips() {
  const { items } = useUserTips();
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible
      className="flex w-full gap-2"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-primary">
            Tips ({items.length})
          </Text>
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

function Item(item: TipsInfo) {
  return (
    <View className="flex-row items-center justify-between">
      <CommunityInfo {...item} />
      <View className="flex-row items-center gap-2">
        <Text>{round(Number(item.amount), 2)}</Text>
        <Button
          disabled
          className="w-14 bg-secondary"
          onPress={() => {
            // console.log("Claim button pressed");
          }}
        >
          <Text className="text-xs font-bold text-secondary-foreground">
            Claim
          </Text>
        </Button>
      </View>
    </View>
  );
}

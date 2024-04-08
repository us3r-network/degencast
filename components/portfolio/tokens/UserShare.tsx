import { round } from "lodash";
import React from "react";
import { Text, View } from "react-native";
import { ChevronDown, ChevronUp } from "~/components/common/Icons";
import useUserShares from "~/hooks/user/useUserShares";
import { ShareInfo } from "~/services/user/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import { SellButton } from "../ShareButton";
import { CommunityInfo } from "../../common/CommunityInfo";

const DEFAULT_ITEMS_NUM = 3;
export default function Share() {
  const { items } = useUserShares();
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
            Share ({items.length})
          </Text>
        </View>
        {items?.length > DEFAULT_ITEMS_NUM &&
          (open ? <ChevronUp /> : <ChevronDown />)}
      </CollapsibleTrigger>
      <View className="flex w-full gap-2">
        {items?.length > 0 &&
          items
            .slice(0, DEFAULT_ITEMS_NUM)
            .map((item) => (
              <ShareItem key={item.name} {...item} />
            ))}
      </View>
      <CollapsibleContent className="flex w-full gap-2">
        {items?.length > DEFAULT_ITEMS_NUM &&
          items
            .slice(DEFAULT_ITEMS_NUM)
            .map((item) => (
              <ShareItem key={item.name} {...item} />
            ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function ShareItem(item: ShareInfo) {
  return (
    <View className="flex-row items-center justify-between">
      <CommunityInfo {...item} />
      <View className="flex-row items-center gap-2">
        <Text>{round(Number(item.amount), 2)}</Text>
        <SellButton logo={""} name={""} assetId={item.assetId}  />
      </View>
    </View>
  );
}

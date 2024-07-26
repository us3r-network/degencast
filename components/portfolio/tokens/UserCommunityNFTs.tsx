import React from "react";
import { View } from "react-native";
import { Address } from "viem";
import { ChevronDown, ChevronUp } from "~/components/common/Icons";
import { NFTImage } from "~/components/trade/ATTButton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Text } from "~/components/ui/text";
import useUserCommunityNFTs from "~/hooks/user/useUserCommunityNFTs";

const DEFAULT_ITEMS_NUM = 2;
export default function CommunityNFTs({ address }: { address: Address }) {
  const { loading, items } = useUserCommunityNFTs(address);

  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible
      className="flex w-full gap-2"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-medium text-secondary">
            NFTs {loading ? "" : `(${items.length})`}
          </Text>
        </View>
        {items?.length > DEFAULT_ITEMS_NUM &&
          (open ? <ChevronUp /> : <ChevronDown />)}
      </CollapsibleTrigger>
      <View className="grid grid-cols-2 w-full gap-2">
        {items?.length > 0 &&
          items
            .slice(0, DEFAULT_ITEMS_NUM)
            .map((item) => (
              <NFTImage
                key={`${item.contractAddress}-${item.tokenId}`}
                tokenAddress={item.contractAddress}
                tokenId={item.tokenId}
              />
            ))}
      </View>
      <CollapsibleContent className="grid grid-cols-2 w-full gap-2">
        {items?.length > DEFAULT_ITEMS_NUM &&
          items
            .slice(DEFAULT_ITEMS_NUM)
            .map((item) => (
              <NFTImage
                key={`${item.contractAddress}-${item.tokenId}`}
                tokenAddress={item.contractAddress}
                tokenId={item.tokenId}
              />
            ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

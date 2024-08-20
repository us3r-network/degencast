import React from "react";
import { View } from "react-native";
import { Address } from "viem";
import { ChevronDown, ChevronUp } from "~/components/common/Icons";
import NFTImage from "~/components/common/NFTImage";
import { SellButton } from "~/components/trade/ATTSellButton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Text } from "~/components/ui/text";
import useUserCommunityNFTs from "~/hooks/user/useUserCommunityNFTs";
import { ERC42069Token } from "~/services/trade/types";

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
            Curation NFTs {loading ? "" : `(${items.length})`}
          </Text>
        </View>
        {items?.length > DEFAULT_ITEMS_NUM &&
          (open ? <ChevronUp /> : <ChevronDown />)}
      </CollapsibleTrigger>
      <View className="grid w-full grid-cols-2 gap-2">
        {items?.length > 0 &&
          items
            .slice(0, DEFAULT_ITEMS_NUM)
            .map((item) => (
              <NFTItem
                key={`${item.contractAddress}-${item.tokenId}`}
                nft={item}
              />
            ))}
      </View>
      <CollapsibleContent className="grid w-full grid-cols-2 gap-2">
        {items?.length > DEFAULT_ITEMS_NUM &&
          items
            .slice(DEFAULT_ITEMS_NUM)
            .map((item) => (
              <NFTItem
                key={`${item.contractAddress}-${item.tokenId}`}
                nft={item}
              />
            ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function NFTItem({ nft }: { nft: ERC42069Token }) {
  return (
    <View className="relative w-full">
      <NFTImage nft={nft} />
      {Number(nft?.nftBalance) > 1 && (
        <View className="absolute bottom-2 left-2">
          <Text>{nft.nftBalance}</Text>
        </View>
      )}
      <View className="absolute bottom-2 right-2">
        <SellButton token={nft} />
      </View>
    </View>
  );
}

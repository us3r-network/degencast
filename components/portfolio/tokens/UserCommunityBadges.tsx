import { round } from "lodash";
import React, { useMemo } from "react";
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
import {
  BuyButton,
  SHARE_INFO,
  SHARE_TITLE,
  SellButton,
} from "../../trade/BadgeButton";
import { Link } from "expo-router";
import { InfoButton } from "~/components/common/InfoButton";
import { useATTContractInfo } from "~/hooks/trade/useATTContract";
import { useAccount } from "wagmi";

// const DEFAULT_ITEMS_NUM = 3;
// export default function CommunityBadges({
//   address,
// }: {
//   address: `0x${string}`;
// }) {
//   const { loading, items } = useUserCommunityShares(address);
//   const [open, setOpen] = React.useState(false);
//   return (
//     <Collapsible
//       className="flex w-full gap-2"
//       open={open}
//       onOpenChange={setOpen}
//     >
//       <CollapsibleTrigger className="flex-row items-center justify-between">
//         <View className="flex-row items-center gap-2">
//           <Text className="text-sm font-medium text-secondary">
//             Channel Share {loading ? "" : `(${items.length})`}
//           </Text>
//           <InfoButton title={SHARE_TITLE} info={SHARE_INFO} />
//         </View>
//         {items?.length > DEFAULT_ITEMS_NUM &&
//           (open ? <ChevronUp /> : <ChevronDown />)}
//       </CollapsibleTrigger>
//       <View className="flex w-full gap-2">
//         {items?.length > 0 &&
//           items
//             .slice(0, DEFAULT_ITEMS_NUM)
//             .map((item) => <CommunityBadge key={item.name} {...item} />)}
//       </View>
//       <CollapsibleContent className="flex w-full gap-2">
//         {items?.length > DEFAULT_ITEMS_NUM &&
//           items
//             .slice(DEFAULT_ITEMS_NUM)
//             .map((item) => <CommunityBadge key={item.name} {...item} />)}
//       </CollapsibleContent>
//     </Collapsible>
//   );
// }

export function CommunityBadge({ badge }: { badge: ShareInfo }) {
  const account = useAccount();
  const { balanceOf, UNIT } = useATTContractInfo(badge.tokenAddress);
  const { data: rawBalance } = balanceOf(account?.address);
  const { data: badgeUnit } = UNIT();
  const balance = useMemo(
    () => (rawBalance && badgeUnit ? Number(rawBalance / badgeUnit) : 0),
    [rawBalance, badgeUnit],
  );
  return (
    <View className="flex-row items-center justify-between">
      <Link href={`/communities/${badge.channelId}/shares`} asChild>
        <Pressable>
          <CommunityInfo {...badge} />
        </Pressable>
      </Link>
      <View className="flex-row items-center gap-2">
        <Text className="text-sm">{balance}</Text>
        {balance > 0 ? (
          <SellButton
            logo={badge.logo}
            name={badge.name}
            tokenAddress={badge.tokenAddress}
          />
        ) : (
          <BuyButton
            logo={badge.logo}
            name={badge.name}
            tokenAddress={badge.tokenAddress}
          />
        )}
      </View>
    </View>
  );
}

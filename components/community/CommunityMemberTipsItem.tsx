import { View, ViewProps } from "react-native";
import { Text } from "~/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "~/lib/utils";
import { CommunityMemberTipsRank } from "~/services/community/api/tips";
import { shortAddress } from "~/utils/shortAddress";

export default function CommunityMemberTipsItem({
  memberTips,
  className,
  ...props
}: ViewProps & {
  memberTips: CommunityMemberTipsRank;
}) {
  const name = memberTips?.displayName || shortAddress(memberTips?.evmAddress);
  const handle = memberTips?.username || "";
  const avatar =
    memberTips?.pfp ||
    `https://ui-avatars.com/api/?name=${memberTips?.evmAddress?.slice(-2) || ""}`;
  const tips = memberTips.tipsAmount || 0;
  return (
    <View className={cn("flex-row items-center gap-3", className)} {...props}>
      <Avatar alt={name || ""} className=" size-10">
        <AvatarImage source={{ uri: avatar || "" }} />
        <AvatarFallback className="border-primary bg-secondary">
          <Text className="font-interBold text-sm">{name}</Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex-1 flex-col gap-1">
        <Text className=" font-interMedium line-clamp-1 text-base leading-none">
          {name}
        </Text>
        <Text className=" line-clamp-1 text-xs leading-none text-[#A36EFE]">
          @{handle}
        </Text>
      </View>
      <View>
        <Text className=" text-base leading-none">{tips}</Text>
      </View>
    </View>
  );
}

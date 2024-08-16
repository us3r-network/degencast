import { View, ViewProps } from "react-native";
import { Text } from "~/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "~/lib/utils";
import { CommunityMemberShare } from "~/services/community/api/share";
import { shortAddress } from "~/utils/shortAddress";

export default function CommunityMemberShareItem({
  memberShare,
  className,
  ...props
}: ViewProps & {
  memberShare: CommunityMemberShare;
}) {
  const name =
    memberShare?.displayName || shortAddress(memberShare?.evmAddress);
  const handle = memberShare?.username || "";
  const avatar =
    memberShare?.pfp ||
    `https://ui-avatars.com/api/?name=${memberShare?.evmAddress?.slice(-2)}`;
  const share = memberShare.sharesAmount || 0;
  return (
    <View className={cn("flex-row items-center gap-3", className)} {...props}>
      <Avatar alt={name || ""} className=" size-10">
        <AvatarImage source={{ uri: avatar || "" }} />
        <AvatarFallback>
          <Text className="text-sm font-bold">{name}</Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex-1 flex-col gap-1">
        <Text className=" line-clamp-1 text-base font-medium leading-none">
          {name}
        </Text>
        {handle && (
          <Text className=" line-clamp-1 text-xs leading-none text-[#A36EFE]">
            @{handle}
          </Text>
        )}
      </View>
      <View>
        <Text className=" text-base leading-none">
          {share} {share > 1 ? "Shares" : "Share"}
        </Text>
      </View>
    </View>
  );
}

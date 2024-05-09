import { usePrivy } from "@privy-io/react-auth";
import React from "react";
import { View } from "react-native";
import { User } from "~/components/common/Icons";
import UserGlobalPoints from "~/components/point/UserGlobalPoints";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import {
  getUserAvatar,
  getUserFarcasterAccount,
  getUserHandle,
  getUserName,
} from "~/utils/privy";
import FarcasterStats from "./FarcasterStats";
import DegenTipsStats from "./DegenTipsStats";

export default function UserInfo() {
  const { ready, authenticated, user, logout } = usePrivy();

  const userAvatar = user ? getUserAvatar(user) : "";
  const userName = user ? getUserName(user) : "";
  const userHandle = user ? getUserHandle(user) : "";
  const farcasterAccount = getUserFarcasterAccount(user);
  // console.log("privy user info", user);
  if (!ready || !user || !authenticated) {
    return <Text>Loading...</Text>;
  }
  return (
    <View className="mx-8 w-full flex-row items-center gap-4">
      <Avatar alt={userHandle} className="size-20">
        <AvatarImage source={{ uri: userAvatar }} />
        <AvatarFallback className="bg-white">
          <User className="font-interBold size-12 fill-primary/80 text-primary" />
        </AvatarFallback>
      </Avatar>
      <View className="flex w-full gap-2">
        <View className="inline-block w-full space-x-2">
          {userName && (
            <Text className="font-interBold text-lg text-white">
              {userName}
            </Text>
          )}
          {userHandle && (
            <Text className="text-sm text-white">@{userHandle}</Text>
          )}
        </View>
        {farcasterAccount?.fid && (
          <FarcasterStats fid={farcasterAccount.fid} fname={userHandle} />
        )}
        {farcasterAccount?.ownerAddress && (
          <DegenTipsStats
            address={farcasterAccount?.ownerAddress as `0x${string}`}
          />
        )}
        {/* <UserGlobalPoints /> */}
      </View>
    </View>
  );
}

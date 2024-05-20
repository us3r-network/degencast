import { usePrivy } from "@privy-io/react-auth";
import React from "react";
import { View } from "react-native";
import { User } from "~/components/common/Icons";
// import UserGlobalPoints from "~/components/point/UserGlobalPoints";
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
    <View className="flex-1 flex-row items-center gap-4">
      <Avatar alt={userHandle} className="size-24">
        <AvatarImage source={{ uri: userAvatar }} />
        <AvatarFallback className="bg-white">
          <User className="size-16 fill-primary/80 font-medium text-primary" />
        </AvatarFallback>
      </Avatar>
      <View className="flex w-full gap-1">
        <View className="w-full">
          {userName && (
            <Text className="line-clamp-1 font-bold text-white">
              {userName}
            </Text>
          )}
          {userHandle && (
            <Text className="line-clamp-1 text-secondary">@{userHandle}</Text>
          )}
        </View>
        {farcasterAccount?.fid && (
          <FarcasterStats fid={farcasterAccount.fid} fname={userHandle} />
        )}
        {farcasterAccount?.fid && (
          <View className="flex-row gap-1 items-center">
            <DegenTipsStats fid={farcasterAccount.fid} />
            <Text className="text-sm text-secondary">Degen allowance</Text>
          </View>
        )}
        {/* <UserGlobalPoints /> */}
      </View>
    </View>
  );
}

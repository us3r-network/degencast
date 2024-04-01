import { usePrivy } from "@privy-io/react-auth";
import React from "react";
import { Text, View } from "react-native";
import {
  getUserAvatar,
  getUserFarcasterAccount,
  getUserHandle,
  getUserName,
} from "~/utils/privy";
import PointBadge from "../point/PointBadge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import FarcasterStats from "./FarcasterStats";

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
    <View className="w-full flex-row items-center gap-2 ">
      <Avatar alt={userHandle} className="size-20">
        <AvatarImage source={{ uri: userAvatar }} />
        <AvatarFallback>
          <Text>{userName}</Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex w-full gap-2">
        <View className="inline-block w-full space-x-2 ">
          {userName && (
            <Text className="text-lg font-bold text-primary-foreground">
              {userName}
            </Text>
          )}
          {userHandle && (
            <Text className="text-sm text-primary-foreground">
              @{userHandle}
            </Text>
          )}
        </View>
        {farcasterAccount?.fid && <FarcasterStats fid={farcasterAccount.fid} />}
        <PointBadge value={11234} />
      </View>
    </View>
  );
}

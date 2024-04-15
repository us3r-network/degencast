import { usePrivy } from "@privy-io/react-auth";
import React from "react";
import { Text, View } from "react-native";
import {
  getUserAvatar,
  getUserFarcasterAccount,
  getUserHandle,
  getUserName,
} from "~/utils/privy";
import UserGlobalPoints from "../../point/UserGlobalPoints";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import FarcasterStats from "./FarcasterStats";
import { User } from "~/components/common/Icons";

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
          <User className="size-12 fill-primary/80 font-bold text-primary"/>
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
        <UserGlobalPoints />
      </View>
    </View>
  );
}

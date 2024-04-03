import { OwnedToken } from "alchemy-sdk";
import React from "react";
import { Text, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

export function TokenInfo(token: OwnedToken) {
    return (
      <View className="flex-row items-center gap-2">
        <Avatar alt={token.name || token.symbol || ""} className="size-8">
          <AvatarImage source={{ uri: token.logo || "" }} />
          <AvatarFallback className="border-primary bg-secondary">
            <Text className="text-sm font-bold">
              {token.name?.slice(0, 2).toUpperCase()}
            </Text>
          </AvatarFallback>
        </Avatar>
        <Text className="text-lg font-bold text-primary">{token.name}</Text>
      </View>
    );
  }
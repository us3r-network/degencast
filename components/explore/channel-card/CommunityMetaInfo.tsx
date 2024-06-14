import { Pressable, View, ViewProps } from "react-native";
import { Text } from "~/components/ui/text";
import { CommunityData } from "~/services/community/api/community";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import CommunityJoinButton from "~/components/community/CommunityJoinButton";
import { userDataObjFromArr } from "~/utils/farcaster/user-data";
import { Link } from "expo-router";

const displayValue = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(Number(value));
};
export default function CommunityMetaInfo({
  communityInfo,
  className,
  ...props
}: ViewProps & {
  communityInfo: CommunityData;
}) {
  const { name, logo, description, memberInfo } = communityInfo;
  // const hostUserData = communityInfo?.hostUserData || [];

  // TODO remove this mock data
  const hostUserData = [
    {
      fid: "528",
      type: 6,
      value: "999999999",
    },
    {
      fid: "528",
      type: 2,
      value: "999999999 🎩",
    },
    {
      fid: "528",
      type: 1,
      value:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/254e8cd6-7e4d-47b9-8aeb-49bebf2dbf00/original",
    },
    {
      fid: "528",
      type: 3,
      value:
        "icebreaker.xyz/0xen |\nhttps://gallery.so/Oxen/galleries | https://opensea.io/collection/farcats",
    },
  ];
  const { totalNumber, newPostNumber } = memberInfo || {};
  const fid = hostUserData?.[0]?.fid;
  const hostUserDataObjArr = hostUserData?.length
    ? userDataObjFromArr(hostUserData)
    : null;
  const hostUserDataObj = hostUserDataObjArr
    ? hostUserDataObjArr[fid as string]
    : null;

  const hosts = hostUserDataObj ? [hostUserDataObj] : [];
  return (
    <View className={cn("w-full flex-col gap-4", className)} {...props}>
      <View className={cn("w-full flex-row gap-3")}>
        <Avatar
          alt={name || ""}
          className=" size-[50px] border border-secondary"
        >
          <AvatarImage source={{ uri: logo || "" }} />
          <AvatarFallback className="border-primary bg-secondary">
            <Text className="text-sm font-bold">{name}</Text>
          </AvatarFallback>
        </Avatar>
        <View className="flex-1 flex-col justify-between">
          <Text className="text-base font-bold leading-none">{name}</Text>
          <View className="flex-row items-end gap-3">
            <Text className="text-sm font-normal leading-none text-secondary">
              {displayValue(totalNumber || 0)} Members
            </Text>
            <Text className="text-sm font-normal leading-none text-secondary">
              {displayValue(newPostNumber || 0)} New Casts
            </Text>
          </View>
        </View>
        <View className=" flex h-[50px] flex-col justify-center">
          <CommunityJoinButton communityInfo={communityInfo} />
        </View>
      </View>
      <Text className="line-clamp-2 text-sm font-normal leading-6">
        {description}
      </Text>
      {hosts.length > 0 && (
        <>
          <Text className=" text-base font-bold">Hosts</Text>
          <View className="grid w-full grid-cols-2 gap-4">
            {hosts.map((host) => {
              return (
                <HostUserInfo
                  key={host.fid}
                  data={{
                    fid: host.fid,
                    avatar: host.pfp,
                    username: host.userName,
                    displayName: host.display,
                  }}
                />
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

function HostUserInfo({
  data,
  className,
}: {
  className?: string;
  data: {
    fid: string | number;
    avatar: string;
    username: string;
    displayName: string;
  };
}) {
  const { fid, avatar, username, displayName } = data;
  return (
    <Link className={cn("w-full", className)} href={`/u/${fid}`} asChild>
      <Pressable className="w-full">
        <View className={cn("w-full flex-row gap-1")}>
          <Avatar
            alt={displayName || ""}
            className=" size-[40px] border border-secondary"
          >
            <AvatarImage source={{ uri: avatar || "" }} />
            <AvatarFallback className="border-primary bg-secondary">
              <Text className="text-sm font-bold">{displayName}</Text>
            </AvatarFallback>
          </Avatar>
          <View className="flex-1 flex-col gap-3">
            <Text className="line-clamp-1 text-base font-medium leading-none">
              {displayName}
            </Text>
            <Text className="text-sm font-medium leading-none text-secondary">
              @{username}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

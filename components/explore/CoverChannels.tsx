import { Pressable, View } from "react-native";
import { CoverChannelsData } from "~/services/community/api/community";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { Link } from "expo-router";
import { Card } from "../ui/card";
import { TrendingDown, TrendingUp } from "../common/Icons";

export default function CoverChannels({ data }: { data: CoverChannelsData }) {
  return (
    <Card className="box-border h-full w-full  overflow-hidden rounded-[20px] border-none p-1">
      <View className="grid h-full w-full grid-cols-3 grid-rows-3 gap-1 overflow-hidden rounded-[20px]">
        {data.map((channel, idx) => {
          return (
            <View
              key={idx.toString()}
              className={cn(
                " overflow-hidden bg-secondary ",
                idx === 0 ? `col-start-1 col-end-2 row-start-1 row-end-2` : "",
                idx === 1 ? `col-start-2 col-end-3 row-start-1 row-end-2` : "",
                idx === 2 ? `col-start-3 col-end-4 row-start-1 row-end-2` : "",
                idx === 3 ? `col-start-1 col-end-2 row-start-2 row-end-3` : "",
                idx === 4 ? `col-start-2 col-end-3 row-start-2 row-end-3` : "",
                idx === 5 ? `col-start-3 col-end-4 row-start-2 row-end-3` : "",
                idx === 6 ? `col-start-1 col-end-2 row-start-3 row-end-4` : "",
                idx === 7 ? `col-start-2 col-end-3 row-start-3 row-end-4` : "",
                idx === 8 ? `col-start-3 col-end-4 row-start-3 row-end-4` : "",
              )}
            >
              <CoverChannelItem data={channel} />
            </View>
          );
        })}
      </View>
    </Card>
  );
}

function CoverChannelItem({ data: channel }: { data: CoverChannelsData[0] }) {
  const symbol = channel?.tokenSymbol;
  const priceChange24 = channel?.tokenPriceChangePercentag?.h24;
  const priceChange = Number(priceChange24);
  const showPriceChange = priceChange24 !== undefined && priceChange24 !== null;
  return (
    <Link className="h-full w-full" href={`/communities/${channel.id}`} asChild>
      <Pressable className="flex h-full w-full flex-col">
        <Avatar
          alt={channel.name || ""}
          className="h-full w-full flex-1 rounded-none transition-transform duration-300 ease-in-out hover:scale-110"
        >
          <AvatarImage source={{ uri: channel.imageUrl || "" }} />
          <AvatarFallback className="flex h-full w-full items-center justify-center bg-secondary">
            <Text className="text-sm font-bold">{channel.name}</Text>
          </AvatarFallback>
        </Avatar>
        <View className="w-full flex-1 flex-col justify-between bg-[#1E293B] p-1">
          <Text className=" text-xs font-medium text-[#718096]">
            {channel.name}
          </Text>
          <View className=" flex-col gap-1">
            <Text className=" line-clamp-1 text-base font-bold text-white">
              {symbol}
            </Text>
            {showPriceChange && (
              <View className=" flex-row items-center justify-between">
                {priceChange >= 0 ? (
                  <TrendingUp className=" size-5 color-[#00D1A7]" />
                ) : (
                  <TrendingDown className=" size-5 color-[#FF5C5C]" />
                )}
                <Text
                  className={cn(
                    " text-base font-medium ",
                    priceChange >= 0 ? " text-[#00D1A7]" : "text-[#FF5C5C]",
                  )}
                >
                  {priceChange}%
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

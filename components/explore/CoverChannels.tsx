import { Pressable, View } from "react-native";
import { CoverChannelsData } from "~/services/community/api/community";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { Link } from "expo-router";
import { Card } from "../ui/card";

export default function CoverChannels({ data }: { data: CoverChannelsData }) {
  return (
    <Card className="box-border h-full w-full  overflow-hidden rounded-[20px] border-none p-1">
      <View className="grid-rows-24 grid-cols-24 grid h-full w-full gap-1 overflow-hidden rounded-[20px]">
        {data.map((channel, idx) => {
          return (
            <View
              key={idx.toString()}
              className={cn(
                " overflow-hidden bg-secondary ",
                idx === 0
                  ? `col-start-1 col-end-9 row-start-1 row-end-5 sm:row-end-7`
                  : "",
                idx === 1
                  ? `col-end-17 col-start-9 row-start-1 row-end-5 sm:row-end-7`
                  : "",
                idx === 2
                  ? `col-start-17 col-end-25 row-start-1 row-end-5  sm:row-end-7`
                  : "",
                idx === 3
                  ? `col-end-25 col-start-1 row-start-5 row-end-10  sm:row-start-7 sm:row-end-13`
                  : "",
                idx === 4
                  ? `row-end-18 col-end-16 sm:col-end-17 sm:row-end-19 col-start-1 row-start-10 sm:row-start-13`
                  : "",
                idx === 5
                  ? `row-end-25 row-start-18 col-end-16 sm:col-end-17  sm:row-start-19  col-start-1`
                  : "",
                idx === 6
                  ? `row-end-15 col-start-16 col-end-25 sm:col-start-17 sm:row-end-17  row-start-10  sm:row-start-13`
                  : "",
                idx === 7
                  ? `row-end-20 col-start-16 col-end-25 row-start-15 sm:col-start-17  sm:row-start-17  sm:row-end-21`
                  : "",
                idx === 8
                  ? `row-end-25 row-start-20 col-start-16 col-end-25 sm:col-start-17  sm:row-start-21  sm:row-end-25`
                  : "",
              )}
            >
              <Link
                className="h-full w-full"
                href={`/communities/${channel.id}`}
                asChild
              >
                <Pressable className="h-full w-full">
                  <Avatar
                    alt={channel.name || ""}
                    className="h-full w-full rounded-none transition-transform duration-300 ease-in-out hover:scale-110"
                  >
                    <AvatarImage source={{ uri: channel.imageUrl || "" }} />
                    <AvatarFallback className="flex h-full w-full items-center justify-center bg-secondary">
                      <Text className="text-sm font-bold">{channel.name}</Text>
                    </AvatarFallback>
                  </Avatar>
                </Pressable>
              </Link>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

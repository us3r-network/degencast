import { Pressable, View } from "react-native";
import { CoverChannelsData } from "~/services/community/api/community";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { Link } from "expo-router";

export default function CoverChannels({ data }: { data: CoverChannelsData }) {
  // gridCols = 6; gridRows = 12;
  return (
    <View className="z-10 grid h-full w-full">
      {data.map((channel, idx) => {
        return (
          <View
            key={idx.toString()}
            className={cn(
              " bg-secondary ",
              idx === 0 ? `col-start-1 col-end-3 row-start-1 row-end-3` : "",
              idx === 1 ? `col-start-3 col-end-5 row-start-1 row-end-3` : "",
              idx === 2 ? `col-start-5 col-end-7 row-start-1 row-end-3` : "",
              idx === 3 ? `col-start-1 col-end-7 row-start-3 row-end-7` : "",
              idx === 4 ? `col-start-1 col-end-5 row-start-7 row-end-10` : "",
              idx === 5 ? `col-start-1 col-end-5 row-start-10 row-end-13` : "",
              idx === 6 ? `col-start-5 col-end-7 row-start-7 row-end-9 ` : "",
              idx === 7 ? `col-start-5 col-end-7 row-start-9 row-end-11` : "",
              idx === 8 ? `col-start-5 col-end-7 row-start-11 row-end-13` : "",
            )}
          >
            <Link
              className="flex-1"
              href={`/communities/${channel.id}`}
              asChild
            >
              <Pressable>
                <Avatar
                  alt={channel.name || ""}
                  className="h-full w-full rounded-none"
                >
                  <AvatarImage source={{ uri: channel.imageUrl || "" }} />
                  <AvatarFallback className="bg-secondary">
                    <Text className="text-sm font-bold">{channel.name}</Text>
                  </AvatarFallback>
                </Avatar>
              </Pressable>
            </Link>
          </View>
        );
      })}
    </View>
  );
}

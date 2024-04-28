import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

import { View, Image, Pressable } from "react-native";
import { cn } from "~/lib/utils";
import { Text } from "../ui/text";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import useWarpcastChannels from "~/hooks/community/useWarpcastChannels";
import { WarpcastChannel } from "~/services/community/api/community";
import { ScrollView } from "react-native-gesture-handler";
import { X } from "../common/Icons";

export default function WarpcastChannelPicker({
  channel,
  setChannel,
}: {
  channel: WarpcastChannel;
  setChannel: (channel: WarpcastChannel) => void;
}) {
  const { warpcastChannels } = useWarpcastChannels();
  const [open, setOpen] = useState(false);

  const [filter, setFilter] = useState("");

  const filteredChannels = useMemo(() => {
    if (!filter) {
      return warpcastChannels.slice(0, 150).sort((a, b) => {
        return a.createdAt - b.createdAt;
      });
    }
    return warpcastChannels
      .filter((item) =>
        item.name.toLocaleLowerCase().includes(filter.toLowerCase()),
      )
      .sort((a, b) => {
        return a.createdAt - b.createdAt;
      })
      .slice(0, 150);
  }, [filter, warpcastChannels]);

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="rounded-md bg-[#a36efe1a]"
          onPress={() => {
            setOpen(true);
          }}
        >
          <Text>{channel?.name || "Home"}</Text>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full bg-white md:w-[600px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-row gap-2">
            <Input
              className={cn(
                "bg-inherit",
                "web:ring-0 web:ring-offset-0 web:focus:ring-0 web:focus:ring-offset-0 web:focus-visible:ring-0  web:focus-visible:ring-offset-0",
              )}
              value={filter}
              onChangeText={(text) => setFilter(text)}
            />
            <Button
              variant={"ghost"}
              size={"icon"}
              className="rounded-md bg-[#a36efe1a]"
              onPress={() => {
                setOpen(false);
              }}
            >
              <X />
            </Button>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription id="alert-dialog-desc">
          <ScrollView className="flex max-h-80 w-full flex-col gap-2">
            {[...filteredChannels].map((item) => {
              return (
                <Pressable
                  key={item.id}
                  onPress={async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setChannel(item);
                    setOpen(false);
                    setFilter("");
                  }}
                >
                  <View className="mt-2 flex flex-row items-center gap-2">
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={{ width: 30, height: 30, borderRadius: 15 }}
                    />
                    <Text>{item.name}</Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
}

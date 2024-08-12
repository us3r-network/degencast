import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Pressable, View } from "react-native";
import { Text } from "../ui/text";
import { PropsWithChildren, useState } from "react";
import { Input } from "../ui/input";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { Copy } from "./Icons";

export function CopyTextContainer({
  copyText,
  dialogTitle,
  dialogDescription,
  children,
}: PropsWithChildren<{
  copyText: string;
  dialogTitle?: string;
  dialogDescription?: string;
}>) {
  const [open, setOpen] = useState(false);
  const onCopy = async () => {
    if (copyText) {
      await Clipboard.setStringAsync(copyText);
      Toast.show({
        type: "success",
        text1: "Link copied to clipboard!",
      });
    }
  };
  return (
    <Dialog
      onOpenChange={(open) => {
        setOpen(open);
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Pressable>{children}</Pressable>
      </DialogTrigger>
      <DialogContent className="w-screen">
        <DialogHeader>
          <Text>{dialogTitle || "Copy to clipboard"}</Text>
        </DialogHeader>
        {dialogDescription && (
          <Text className="mb-2 block text-sm font-medium">
            {dialogDescription}
          </Text>
        )}

        <View className="flex flex-row items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-500">
          <Input
            aria-disabled
            value={copyText}
            className="border-none bg-transparent outline-none"
          />
          <Pressable onPress={onCopy}>
            <Copy />
          </Pressable>
        </View>
      </DialogContent>
    </Dialog>
  );
}

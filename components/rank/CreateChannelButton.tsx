import { useState } from "react";
import { View, Image } from "react-native";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import ImageSelector from "../common/ImageSelector";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Image as ImageIcon } from "~/components/common/Icons";

export default function CreateChannelButton({
  renderButton,
}: {
  renderButton?: (props: { onPress: () => void }) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {renderButton ? (
        renderButton({ onPress: () => setOpen(true) })
      ) : (
        <Button variant={"secondary"} onPress={() => setOpen(true)}>
          <Text>Create Channel</Text>
        </Button>
      )}
      <CreateChannelDialog open={open} setOpen={setOpen} />
    </>
  );
}

export function CreateChannelDialog({
  open,
  setOpen,
  onSuccess,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: (mintNum: number) => void;
}) {
  const [channelName, setChannelName] = useState("");
  const [channelId, setChannelId] = useState("");
  const [channelImage, setChannelImage] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!channelName || !channelId || !channelImage) {
      return;
    }
    setLoading(true);
    console.log(
      "submit",
      channelName,
      channelId,
      channelImage,
      channelDescription,
    );
    setLoading(false);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
      }}
    >
      <DialogContent
        className="w-screen"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className={cn("flex gap-2")}>
          <DialogTitle>Create Channel</DialogTitle>
        </DialogHeader>
        <View className="flex gap-6">
          <View className="flex gap-4">
            <Text>Channel Name</Text>
            <Input
              className="text-secondary"
              placeholder="Input Channel Name"
              value={channelName}
              onChangeText={(text) => setChannelName(text)}
            ></Input>
          </View>
          <View className="flex gap-4">
            <Text>Channel ID</Text>
            <Input
              className="text-secondary"
              placeholder="Input Channel ID"
              value={channelId}
              onChangeText={(text) => setChannelId(text)}
            ></Input>
          </View>
          <View className="flex gap-4">
            <Text>Channel Image</Text>
            <View className="flex-row items-center gap-4">
              {channelImage && (
                <Image
                  resizeMode="contain"
                  className="rounded-xl"
                  style={{ height: 100, width: 100 }}
                  source={{
                    uri: channelImage,
                  }}
                />
              )}
              <ImageSelector
                imageUrlCallback={setChannelImage}
                renderButton={({ onPress, loading }) => (
                  <Button
                    onPress={onPress}
                    disabled={loading}
                    variant={"secondary"}
                    className="flex-row items-center gap-2"
                  >
                    <ImageIcon color="white" />
                    {loading ? (
                      <Text>Uploading...</Text>
                    ) : channelImage ? (
                      <Text>Change Image</Text>
                    ) : (
                      <Text>Upload Image</Text>
                    )}
                  </Button>
                )}
              />
            </View>
          </View>
          <View className="flex gap-4">
            <Text>Channel Description</Text>
            <Textarea
              className="text-secondary"
              placeholder="Input Channel Description"
              value={channelDescription}
              onChangeText={(text) => setChannelDescription(text)}
            ></Textarea>
          </View>
          <Button
            variant="secondary"
            disabled={
              loading || !channelName || !channelId || !channelDescription
            }
            onPress={() => submit()}
          >
            <Text>Create Channel & Activate </Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
}

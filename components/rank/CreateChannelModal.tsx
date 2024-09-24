import { useRouter } from "expo-router";
import { debounce, throttle } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { Image, View } from "react-native";
import { Image as ImageIcon } from "~/components/common/Icons";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import useFarcasterSigner from "~/hooks/social-farcaster/useFarcasterSigner";
import useFarcasterWrite from "~/hooks/social-farcaster/useFarcasterWrite";
import { cn } from "~/lib/utils";
import {
  createDegencastChannel,
  fetchCommunity,
} from "~/services/community/api/community";
import ImageSelector from "../common/ImageSelector";
import { PercentPrograssText } from "../common/PercentPrograssText";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function CreateChannelDialog({
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
  const [channelImageUrl, setChannelImageUrl] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const { hasSigner, requestSigner } = useFarcasterSigner();
  const { submitCast } = useFarcasterWrite();
  const router = useRouter();
  const submit = async () => {
    if (!channelName || !channelId || !channelImageUrl) {
      return;
    }
    setLoading(true);
    console.log(
      "submit",
      channelName,
      channelId,
      channelImageUrl,
      channelDescription,
    );
    const res = await createDegencastChannel({
      name: channelName,
      id: channelId,
      imageUrl: channelImageUrl,
      description: channelDescription,
    });
    console.log("res", res);
    const cast = await submitCast({
      text: `Degencast Channel ${channelName} created!`,
      embeds: [
        {
          url: channelImageUrl,
        },
      ],
      parentUrl: `https://warpcast.com/~/channel/${channelId}`,
    });
    console.log("cast", cast);
    setLoading(false);
    router.navigate(`/communities/${channelId}/casts`);
    setOpen(false);
    // reset();
  };
  const reset = () => {
    setChannelName("");
    setChannelId("");
    setChannelImageUrl("");
    setChannelDescription("");
    setLoading(false);
    setValidated(false);
  };
  const validate = async () => {
    // console.log("validate", channelId);
    setValidated(false);
    try {
      const channel = await fetchCommunity(channelId);
      if (!channel?.data?.data?.id) {
        setValidated(true);
      }
    } catch (e) {
      console.log("validate error", e);
      setValidated(true);
    }
  };
  const debouncedValidate = useCallback(
    throttle(debounce(validate, 500), 1000), // 0x api rate limit 1/second
    [channelId],
  );
  useEffect(() => {
    setValidated(false);
    if (channelId) {
      debouncedValidate();
    }
  }, [channelId]);

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
              blurOnSubmit={true}
              onChangeText={(text) => setChannelId(text)}
              onSubmitEditing={debouncedValidate}
            ></Input>
          </View>
          <View className="flex gap-4">
            <Text>Channel Image</Text>
            <View className="flex-row items-center gap-4">
              {channelImageUrl && (
                <Image
                  resizeMode="contain"
                  className="rounded-xl"
                  style={{ height: 100, width: 100 }}
                  source={{
                    uri: channelImageUrl,
                  }}
                />
              )}
              <ImageSelector
                imageUrlCallback={setChannelImageUrl}
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
                    ) : channelImageUrl ? (
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
          {hasSigner ? (
            <Button
              variant="secondary"
              disabled={
                loading ||
                !validated ||
                !channelName ||
                !channelId ||
                !channelDescription
              }
              onPress={() => submit()}
            >
              {loading ? (
                <PercentPrograssText duration={8000} divisor={100} />
              ) : (
                <Text>Create Channel & Launch Contribution Token</Text>
              )}
            </Button>
          ) : (
            <Button variant={"secondary"} onPress={requestSigner}>
              <Text>Request Farcaster signer</Text>
            </Button>
          )}
        </View>
      </DialogContent>
    </Dialog>
  );
}

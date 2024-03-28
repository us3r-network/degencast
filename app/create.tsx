import { useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import useFarcasterWrite from "~/hooks/social-farcaster/useFarcasterWrite";

export default function CreateScreen() {
  const { submitCast } = useFarcasterWrite();
  const [value, setValue] = useState("");
  return (
    <View className="flex w-full gap-2 p-2">
      <Textarea
        className="h-32 w-full rounded-md border border-input bg-background p-2 text-foreground"
        placeholder="Write some stuff..."
        value={value}
        onChangeText={setValue}
        aria-labelledby="textareaLabel"
      />
      <Button
        className="bg-primary text-primary-foreground"
        disabled={value.length === 0}
        onPress={() =>
          submitCast(value).then(() => {
            console.log("Cast submitted");
            setValue("");
          })
        }
      >
        Submit Cast
      </Button>
    </View>
  );
}

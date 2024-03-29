import { useState } from "react";
import { View, Text } from "react-native";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import useFarcasterWrite from "~/hooks/social-farcaster/useFarcasterWrite";

export default function CreateScreen() {
  const { submitCast, writing } = useFarcasterWrite();
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
        disabled={value.length === 0 && writing}
        onPress={() =>
          submitCast(value).then(() => {
            console.log("Cast submitted");
            setValue("");
          })
        }
      >
        <Text className="bg-primary text-primary-foreground">Submit Cast</Text>
      </Button>
    </View>
  );
}

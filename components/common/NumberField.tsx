import { useState } from "react";
import { TextInput, View } from "react-native";
import { Button } from "../ui/button";
import { Minus, Plus } from "./Icons";

type NumberFieldProps = React.ComponentPropsWithoutRef<typeof View> & {
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
};

export default function NumberField({
  defaultValue,
  minValue,
  maxValue,
}: NumberFieldProps) {
  const [value, setValue] = useState(defaultValue || 0);
  return (
    <View className="flex-row gap-2">
      <Button
        className="h-8 w-8 bg-secondary rounded-full"
        disabled={Boolean(minValue && value <= minValue)}
        onPress={() => {
          if (!minValue || value > minValue) setValue(value - 1);
        }}
      >
        <Minus />
      </Button>
      <TextInput className="w-6 text-center" value={String(value)} onChange={(v) => setValue(Number(v))} />
      <Button
        className="h-8 w-8 bg-secondary rounded-full"
        disabled={Boolean(maxValue && value >= maxValue)}
        onPress={() => {
          if (!maxValue || value < maxValue) setValue(value + 1);
        }}
      >
        <Plus />
      </Button>
    </View>
  );
}

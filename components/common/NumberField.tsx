import { useState } from "react";
import { TextInput, View } from "react-native";
import { Button } from "../ui/button";
import { Minus, Plus } from "./Icons";

type NumberFieldProps = React.ComponentPropsWithoutRef<typeof View> & {
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  onChange?: (value: number) => void;
};

export default function NumberField({
  defaultValue,
  minValue = 0,
  maxValue = 999,
  onChange,
}: NumberFieldProps) {
  const [value, setValue] = useState(defaultValue || 0);
  // onChange && defaultValue && onChange(defaultValue);
  return (
    <View className="flex-row gap-2">
      <Button
        className="size-8 rounded-full"
        variant={"secondary"}
        disabled={Boolean(value <= minValue)}
        onPress={() => {
          const newValue = value - 1;
          if (!minValue || value > minValue) setValue(newValue);
          onChange && onChange(newValue);
        }}
      >
        <Minus />
      </Button>
      <TextInput
        inputMode="numeric"
        editable={true}
        className="w-6 text-center font-bold text-foreground"
        value={String(value)}
      />
      <Button
        className="size-8 rounded-full"
        variant={"secondary"}
        disabled={Boolean(value >= maxValue)}
        onPress={() => {
          const newValue = value + 1;
          if (!maxValue || value < maxValue) setValue(newValue);
          onChange && onChange(newValue);
        }}
      >
        <Plus />
      </Button>
    </View>
  );
}

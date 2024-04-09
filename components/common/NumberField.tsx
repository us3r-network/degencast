import { useState } from "react";
import { TextInput, View } from "react-native";
import { Button } from "../ui/button";
import { Minus, Plus } from "./Icons";
import { fontScaleSelect } from "nativewind/dist/theme";

type NumberFieldProps = React.ComponentPropsWithoutRef<typeof View> & {
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  onChange?: (value: number) => void;
};

export default function NumberField({
  defaultValue,
  minValue,
  maxValue,
  onChange,
}: NumberFieldProps) {
  const [value, setValue] = useState(defaultValue || 0);
  // onChange && defaultValue && onChange(defaultValue);
  return (
    <View className="flex-row gap-2">
      <Button
        className="h-8 w-8 rounded-full bg-secondary"
        disabled={Boolean(minValue && value <= minValue)}
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
        editable={fontScaleSelect}
        focusable={false}
        className="w-6 text-center"
        value={String(value)}
      />
      <Button
        className="h-8 w-8 rounded-full bg-secondary"
        disabled={Boolean(maxValue && value >= maxValue)}
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

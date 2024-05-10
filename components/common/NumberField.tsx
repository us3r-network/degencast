import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "../ui/button";
import { Minus, Plus } from "./Icons";
import { Input } from "../ui/input";
import { cn } from "~/lib/utils";
import { debounce } from "lodash";

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
  const [value, setValue] = useState<string>(String(defaultValue || 0));
  const debouncedChange = useCallback(
    debounce(onChange ? onChange : () => {}, 500),
    [],
  );
  useEffect(() => {
    if (!Number(value) || !onChange) {
      return;
    }
    debouncedChange(Number(value));
  }, [value]);

  // onChange && defaultValue && onChange(defaultValue);
  return (
    <View className="flex-row gap-2">
      <Button
        className="size-8 rounded-full"
        variant={"secondary"}
        disabled={Boolean(Number(value) <= minValue)}
        onPress={() => {
          const newValue = Number(value) - 1;
          if (!minValue || Number(value) > minValue) setValue(String(newValue));
        }}
      >
        <Minus />
      </Button>
      <Input
        inputMode="numeric"
        editable={true}
        className={cn("max-w-16 text-center font-medium text-white")}
        value={value}
        onChangeText={(text) => setValue(text)}
      />
      <Button
        className="size-8 rounded-full"
        variant={"secondary"}
        disabled={Boolean(Number(value) >= maxValue)}
        onPress={() => {
          const newValue = Number(value) + 1;
          if (!maxValue || Number(value) < maxValue) setValue(String(newValue));
        }}
      >
        <Plus />
      </Button>
    </View>
  );
}

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { useState } from "react";
import { View } from "react-native";
import { ChevronDown, ChevronUp } from "~/components/common/Icons";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { UnorderedList } from "../common/UnorderedList";

export default function About({
  title,
  info,
}: {
  title: string;
  info: string[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible
      className="w-full space-y-4"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger
        className={cn("w-full")}
      >
        <View className="w-full flex-row items-center justify-between">
        <Text className="font-medium">{title}</Text>
        <View>
          {open ? (
            <ChevronUp color={"white"} />
          ) : (
            <ChevronDown color={"white"} />
          )}
          </View>
        </View>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex w-full gap-2">
        <UnorderedList texts={info} />
      </CollapsibleContent>
    </Collapsible>
  );
}

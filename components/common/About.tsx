import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { UnorderedList } from "../common/UnorderedList";
import { cn } from "~/lib/utils";

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
        <Text className="font-bold">{title}</Text>
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

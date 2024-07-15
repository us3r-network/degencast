import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import useAppSettings from "~/hooks/useAppSettings";
import { ExploreActivatedViewName } from "~/features/appSettingsSlice";
import { Separator } from "../ui/separator";

const options = [
  { label: "Trending", value: ExploreActivatedViewName.trending },
  { label: "Following", value: ExploreActivatedViewName.following },
];

export default function ExploreViewSwitch() {
  const { exploreActivatedViewName, setExploreActivatedViewName } =
    useAppSettings();
  return (
    <View className="flex flex-row items-center">
      {options.map((item, index) => (
        <View key={index} className="flex flex-row items-center">
          {index > 0 && (
            <Separator className="mx-4 h-[12px] w-[1px] bg-white" />
          )}
          <Pressable
            onPress={() => {
              setExploreActivatedViewName(
                item?.value as ExploreActivatedViewName,
              );
            }}
          >
            <Text
              className={cn(
                " text-base font-medium text-secondary-foreground ",
                exploreActivatedViewName === item.value
                  ? "text-secondary"
                  : "text-secondary-foreground",
              )}
            >
              {item.label}
            </Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

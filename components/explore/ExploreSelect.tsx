import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import useAppSettings from "~/hooks/useAppSettings";
import { ExploreActivatedViewName } from "~/features/appSettingsSlice";

const options = [
  { label: "Trending", value: ExploreActivatedViewName.trending },
  { label: "Following", value: ExploreActivatedViewName.following },
  { label: "Hosting", value: ExploreActivatedViewName.hosting },
];

export default function ExploreViewSelect() {
  const { exploreActivatedViewName, setExploreActivatedViewName } =
    useAppSettings();
  const selectOption = options.find(
    (option) => option.value === exploreActivatedViewName,
  );
  return (
    <Select
      defaultValue={selectOption}
      value={selectOption}
      onValueChange={(item) => {
        setExploreActivatedViewName(item?.value as ExploreActivatedViewName);
      }}
    >
      <SelectTrigger
        className={cn(
          " h-auto w-[94px] gap-2 border-none p-0",
          "web:focus-visible:outline-none web:focus-visible:ring-0",
          "focus-visible:outline-none focus-visible:ring-0",
        )}
      >
        <Text className=" text-primary-foreground">{selectOption?.label}</Text>
      </SelectTrigger>
      <SelectContent
        side="bottom"
        className={cn("mt-3 rounded-lg border-none bg-white p-0 shadow-md")}
      >
        <View className="flex-col p-0">
          {options.map((item) => (
            <SelectItem
              className={cn("p-3 hover:cursor-pointer")}
              key={item.value}
              label={item.label}
              value={item.value}
            >
              <Text className=" text-xl font-medium text-[#1E293B] ">
                {item.label}
              </Text>
            </SelectItem>
          ))}
        </View>
      </SelectContent>
    </Select>
  );
}

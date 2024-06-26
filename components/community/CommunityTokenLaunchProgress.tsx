import { View, ViewProps } from "react-native";
import { Text } from "~/components/ui/text";
import StaticProgressBar from "../common/StaticProgressBar";

export default function CommunityTokenLaunchProgress({
  data,
  ...props
}: ViewProps & {
  data: any;
}) {
  return (
    <View {...props}>
      <View>
        <Text className="text-base font-medium">
          Token Launch Progress:{" "}
          <Text className=" text-base font-bold">99.99%</Text>
        </Text>
        <View className=" mt-5 w-full">
          <StaticProgressBar progress={0.9999} />
        </View>

        <Text className="ml-auto mt-3 text-xs leading-none text-[#A36EFE]">
          $99,999/$99,999 Capital Pool
        </Text>
      </View>
      <View>
        <Text className="text-base font-medium">
          Capital Pool: <Text className=" text-base font-bold">$99,999</Text>
        </Text>
        <Text className="mt-3 text-center text-xs leading-none text-[#A36EFE]">
          The channel token launch progress hasn’t started yet.
        </Text>
      </View>
    </View>
  );
}

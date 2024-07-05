import { View } from "react-native";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";
import { Link } from "expo-router";
import { Button } from "../ui/button";

export default function NotFoundChannel() {
  return (
    <View className="flex w-full flex-col items-center justify-center ">
      <View className="flex w-72 flex-col items-center justify-center gap-8">
        <Image
          source={require("~/assets/images/default-search.png")}
          className="h-72 w-72"
          contentFit="fill"
          style={{ width: 280, height: 280 }}
        />

        <Text className="text-lg font-bold color-[#4C2896]">
          Channel Not Found
        </Text>
        <Text className="text-center text-base leading-8 color-[#A36EFE]">
          The channel you’re looking for does not seem to exist.
        </Text>

        <Link href="/ranks" asChild>
          <Button className="w-72 rounded-md  web:bg-[#A36EFE] web:hover:bg-[#A36EFE] web:active:bg-[#A36EFE]">
            <Text className="color-white">Explore channels in rank</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}

import {
  Stack,
  useRouter,
  useLocalSearchParams,
  useSegments,
} from "expo-router";
import { View, Text, SafeAreaView } from "react-native";
import { Card } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";

const initialRouteName = "tokens";

const TABS = [
  { label: "Tokens", value: "tokens" },
  { label: "Shares", value: "shares" },
  { label: "Tips Rank", value: "tips-rank" },
  { label: "Casts", value: "casts" },
];

export default function CommunityDetail() {
  const params = useLocalSearchParams();
  const { id } = params;
  const segments = useSegments();
  const activeScreen = segments[2] || initialRouteName;
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: id as string,
          headerRight: () => (
            <View className="mr-5 flex flex-row items-center gap-3">
              <Text>Join</Text>
              <Text>Share</Text>
            </View>
          ),
        }}
      />
      <View className=" flex-1 p-5">
        <View className="box-border w-full flex-1 pt-7">
          <Tabs
            value={activeScreen}
            onValueChange={(value) => {
              router.push(`/communities/${id}/${value}` as any);
            }}
            className=" absolute left-1/2 top-0 z-10 box-border w-full -translate-x-1/2"
          >
            <TabsList className="flex-row rounded-full bg-white shadow-lg">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  className={cn("flex-1 flex-row rounded-full")}
                  value={tab.value}
                >
                  <Text
                    className={cn(
                      "text-primary",
                      activeScreen === tab.value && "text-primary-foreground",
                    )}
                  >
                    {tab.label}
                  </Text>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Card className="box-border h-full w-full p-5">
            <Stack
              initialRouteName={initialRouteName}
              screenOptions={{
                header: () => null,
              }}
            />
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}

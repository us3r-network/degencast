import { View, SafeAreaView } from "react-native";
import {
  headerHeight,
  itemPaddingTop,
} from "~/components/explore/ExploreStyled";
import FollowingScreen from "~/components/explore/following";
import HostingScreen from "~/components/explore/hosting";
import TrendingScreen from "~/components/explore/trending";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import useAppSettings from "~/hooks/useAppSettings";

const TABS = [
  { label: "Trending", value: "trending", screenComponent: <TrendingScreen /> },
  {
    label: "Following",
    value: "following",
    screenComponent: <FollowingScreen />,
  },
  { label: "Hosting", value: "hosting", screenComponent: <HostingScreen /> },
];

export default function ExploreLayout() {
  const { exploreActivatedViewName } = useAppSettings();
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: headerHeight - itemPaddingTop }}
      className="bg-background"
    >
      <View className=" m-auto w-full flex-1 max-sm:px-4 sm:w-full sm:max-w-screen-sm">
        <Tabs
          value={exploreActivatedViewName}
          onValueChange={(value) => {
            // setExploreActivatedViewName(value);
          }}
          className="flex h-full w-full flex-col"
        >
          {/* <TabsList className="m-0 h-auto flex-row justify-start gap-[30px] p-0">
            {TABS.map((tab) => {
              if (tab.value === "hosting" && !showHosting) {
                return null;
              }
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="m-0 h-auto p-0"
                >
                  <Text
                    className={cn(
                      "text-base font-bold leading-[20px] text-secondary",
                      activeScreen === tab.value &&
                        " text-secondary-foreground",
                    )}
                  >
                    {tab.label}
                  </Text>
                </TabsTrigger>
              );
            })}
          </TabsList> */}
          <View className="w-full flex-1">
            {TABS.map((tab) => {
              return (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="h-full w-full"
                >
                  {tab.screenComponent}
                </TabsContent>
              );
            })}
          </View>
        </Tabs>
      </View>
    </SafeAreaView>
  );
}

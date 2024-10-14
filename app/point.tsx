import Constants from "expo-constants";
import { Stack, useNavigation } from "expo-router";
import { PropsWithChildren, useState } from "react";
import { SafeAreaView, View, Image, ScrollView } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import { GoBackButtonBgPrimary } from "~/components/common/GoBackButton";
import { WandSparklesIcon } from "~/components/common/SvgIcons";
import DefaultTabBar from "~/components/layout/tab-view/TabBar";
import { PointsRules } from "~/components/point/PointsRules";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";
import useUserTotalPoints from "~/hooks/user/useUserTotalPoints";

const headerHeight = DEFAULT_HEADER_HEIGHT;
function ComingSoon() {
  return (
    <View className=" mx-auto h-full max-w-[350px] flex-col items-center justify-center gap-7">
      <Image
        source={require("~/assets/images/no-shares.png")}
        style={{ width: 280, height: 280 }}
      />
      <Text className=" text-center text-xl font-bold text-primary">
        Coming Soon
      </Text>
    </View>
  );
}

function SceneWrapper({ children }: PropsWithChildren) {
  return (
    <ScrollView
      horizontal={false}
      showsVerticalScrollIndicator={false}
      className="flex-1 pb-4 pt-8"
    >
      {children}
    </ScrollView>
  );
}

export default function cast() {
  const { totalPoints } = useUserTotalPoints();
  const navigation = useNavigation();
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: headerHeight }}
      className="bg-background"
    >
      <Stack.Screen
        options={{
          headerTransparent: true,
          header: () => (
            <View
              style={{
                height: headerHeight,
                paddingLeft: 15,
                paddingRight: 15,
                marginTop: Constants.statusBarHeight, // 确保顶部与状态栏不重叠
              }}
              className="flex-row items-center justify-between bg-primary"
            >
              <View className="flex flex-row items-center gap-3">
                <GoBackButtonBgPrimary
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
                <Text className=" font-bold text-primary-foreground">
                  $CAST
                </Text>
              </View>
            </View>
          ),
        }}
      />
      <View className=" m-auto  w-full flex-1 flex-col gap-4 p-4 py-0 sm:w-full sm:max-w-screen-sm">
        <View className="flex-row items-center gap-4">
          <WandSparklesIcon width={32} height={32} />
          <Text className="text-[32px] font-bold text-primary-foreground">
            {totalPoints}
          </Text>
        </View>
        <View className="box-border w-full flex-1">
          <Card className="relative mx-auto box-border h-full w-full max-w-screen-sm rounded-2xl rounded-b-none p-4 pb-0">
            <CardContent className="h-full w-full p-0">
              <PointsRules />
            </CardContent>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}

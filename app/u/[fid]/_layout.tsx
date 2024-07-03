import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  Stack,
  useLocalSearchParams,
  useNavigation,
  useSegments,
} from "expo-router";
import { useEffect, useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoBackButtonBgPrimary } from "~/components/common/GoBackButton";
import DefaultTabBar from "~/components/layout/material-top-tabs/TabBar";
import { PortfolioSharingButton } from "~/components/platform-sharing/PlatformSharingButton";
import UserInfo from "~/components/portfolio/user/UserInfo";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";
import useUserBulk from "~/hooks/user/useUserBulk";
import UserCastsScreen from "./casts";
import UserChannelsScreen from "./channels";
import UserTokensScreen from "./tokens";

const Tab = createMaterialTopTabNavigator();
const TABS = [
  { label: "Tokens", value: "tokens", component: UserTokensScreen },
  { label: "Channels", value: "channels", component: UserChannelsScreen },
  { label: "Casts", value: "casts", component: UserCastsScreen },
];

export default function UserPortfolioScreen() {
  const segments = useSegments();
  const navigation = useNavigation();
  const { fid } = useLocalSearchParams<{ fid: string }>();
  const { userInfo, load } = useUserBulk();

  useEffect(() => {
    if (Number(fid)) load(Number(fid));
  }, [fid]);

  const username = useMemo(() => {
    if (!userInfo) return undefined;
    if (userInfo?.username) return userInfo.username;
    return "User Portfolio";
  }, [userInfo]);

  if (Number(fid))
    return (
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: DEFAULT_HEADER_HEIGHT + 20,
          paddingBottom: 20,
        }}
        className="flex-1 bg-background p-2"
      >
        <Stack.Screen
          options={{
            headerTransparent: true,
            header: () => (
              <View
                style={{
                  height: DEFAULT_HEADER_HEIGHT,
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
                className="flex-row items-center justify-between bg-primary"
              >
                <View className="flex flex-row items-center gap-3">
                  <GoBackButtonBgPrimary
                    onPress={() => {
                      navigation.goBack();
                    }}
                  />
                  <Text className=" text-xl font-bold text-primary-foreground">
                    {username || "User Portfolio"}
                  </Text>
                </View>
                <View className="flex flex-row items-center gap-[10px]">
                  {fid && (
                    <PortfolioSharingButton
                      fid={Number(fid)}
                      fname={username || ""}
                    />
                  )}
                </View>
              </View>
            ),
          }}
        />
        <View className="mx-auto box-border w-full max-w-screen-sm flex-1 px-4">
          <View className="flex h-full w-full items-center gap-4 ">
            <View className="h-24 w-full">
              <UserInfo fid={Number(fid)} />
            </View>
            <Card className="box-border h-full w-full rounded-[20px] rounded-b-none p-4 pb-0">
              <Tab.Navigator
                initialRouteName={segments?.[2]}
                tabBar={(props) => <DefaultTabBar {...props} />}
                sceneContainerStyle={{
                  backgroundColor: "white",
                  paddingTop: 15,
                }}
              >
                {TABS.map((tab) => {
                  const Component = tab.component;
                  return (
                    <Tab.Screen
                      key={tab.value}
                      name={tab.value}
                      component={()=><Component fid={fid!}/>}
                      options={{
                        title: tab.label,
                      }}
                    />
                  );
                })}
              </Tab.Navigator>
            </Card>
          </View>
        </View>
      </SafeAreaView>
    );
}

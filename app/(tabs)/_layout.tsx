import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "@react-navigation/native";
import { Link, Tabs } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import UserLogout from "~/components/portfolio/UserLogout";
import UserWallets from "~/components/portfolio/UserWallets";
import { useClientOnlyValue } from "~/components/useClientOnlyValue";
import { useColorScheme } from "~/lib/useColorScheme";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  console.log("colorScheme", theme);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarLabelPosition: "below-icon",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="compass" color={color} />
          ),
          headerTransparent: true,
          headerTitleStyle: {
            color: "white",
          },
          headerRight: () => (
            <View className="flex-row items-center gap-2">
              <Link href="/search" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="search"
                      size={25}
                      color="white"
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
              <Link href="/create" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="edit"
                      size={25}
                      color="white"
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="trade"
        options={{
          title: "Trade",
          tabBarLabelPosition: "below-icon",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="bar-chart" color={color} />
          ),
          headerTransparent: true,
          headerTitleStyle: {
            color: "white",
          },
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: "Portfolio",
          tabBarLabelPosition: "below-icon",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerTransparent: true,
          headerTitleStyle: {
            color: "white",
          },
          headerRight: () => (
            <View className="flex-row items-center gap-4 p-4">
              <UserWallets />
              <UserLogout />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

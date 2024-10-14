import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Link, Stack, useNavigation } from "expo-router";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoBackButton, {
  GoBackButtonBgPrimary,
} from "~/components/common/GoBackButton";
import { Search } from "~/components/common/Icons";
import NotFoundChannel from "~/components/community/NotFoundChannel";
import { headerHeight } from "~/components/explore/ExploreStyled";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { PRIMARY_COLOR } from "~/constants";
import useAllJoinedCommunities from "~/hooks/community/useAllJoinedCommunities";
import useLoadTrendingCommunities from "~/hooks/community/useLoadTrendingCommunities";
import { cn } from "~/lib/utils";
import { getSearchResult } from "~/services/farcaster/api";

type Community = {
  name: string;
  logo: string;
  channelId: string;
};

export default function SearchScreen() {
  // const navigation = useNavigation();
  const [value, onChangeText] = useState("");
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState<Community[]>([]);
  const [recommend, setRecommend] = useState<Community[]>([]);
  const { joinedCommunities } = useAllJoinedCommunities();
  const { trendingCommunities, loadTrendingCommunities } =
    useLoadTrendingCommunities();

  const saveHistory = async ({ name, logo, channelId }: Community) => {
    try {
      const data = await AsyncStorage.getItem("searchHistory");
      let historyData: Community[] = data ? JSON.parse(data) : [];
      if (historyData.some((item) => item.channelId === channelId)) {
        return;
      }
      historyData.push({ name, logo, channelId });
      historyData = historyData.slice(-6);
      AsyncStorage.setItem("searchHistory", JSON.stringify(historyData));
    } catch (error) {
      console.error(error);
    }
  };

  const getHistory = async () => {
    try {
      const data = await AsyncStorage.getItem("searchHistory");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(error);
    }
    return [];
  };

  const fetchSearchResult = async (text: string) => {
    const searchText = text.trim();
    if (!searchText) {
      return;
    }
    // console.log("searching for", searchText);
    try {
      setLoading(true);
      const resp = await getSearchResult(searchText);
      const data = resp.data;
      // console.log("search result", data);
      if (data.code === 0) setRecommend(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const debouncedSearch = useCallback(debounce(fetchSearchResult, 500), []);

  useEffect(() => {
    debouncedSearch(value);
    getHistory().then(setHistory);
  }, [value]);

  useEffect(() => {
    if (trendingCommunities.length === 0) {
      loadTrendingCommunities();
    }
  }, [trendingCommunities]);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: headerHeight, backgroundColor: PRIMARY_COLOR }}
    >
      <Stack.Screen
        options={{
          headerTransparent: true,
          header: () => (
            <View
              style={{
                paddingLeft: 15,
                paddingRight: 15,
                marginTop: Constants.statusBarHeight, // 确保顶部与状态栏不重叠
              }}
            >
              <SearchHeader
                value={value}
                setValue={(data) => {
                  if (data) setLoading(true);
                  else setLoading(false);
                  setRecommend([]);
                  onChangeText(data);
                }}
                searchAction={() => fetchSearchResult(value)}
              />
            </View>
          ),
        }}
      />
      <ScrollView
        className="m-auto flex w-full flex-1 gap-4 p-4 py-0 sm:max-w-screen-sm"
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View className="flex items-center justify-center">
            <Text className=" text-primary-foreground ">Loading...</Text>
          </View>
        )}

        {(value && recommend.length > 0 && (
          <View className="m-auto w-full space-y-2 p-3 md:w-[500px]">
            <SearchTitle title={"Search result"} />
            <View className="flex flex-wrap gap-2">
              {recommend.map((item, i) => {
                return (
                  <Link
                    key={i}
                    href={`/communities/${item.channelId}`}
                    onPress={() => {
                      saveHistory(item);
                      setRecommend([]);
                      onChangeText("");

                      return true;
                    }}
                  >
                    <RecommendItem icon={item.logo} name={item.name} />
                  </Link>
                );
              })}
            </View>
          </View>
        )) ||
          null}

        {(!value && history.length > 0 && (
          <View className="m-auto mb-3 w-full space-y-2 px-3 md:w-[500px]">
            <SearchTitle title={"History"} />
            <View className="flex flex-row flex-wrap gap-2">
              {history.map((item, i) => {
                return (
                  <Link key={i} href={`/communities/${item.channelId}`}>
                    <SearchItem icon={item.logo} name={item.name} />
                  </Link>
                );
              })}
            </View>
          </View>
        )) ||
          null}

        {(!value && joinedCommunities.length > 0 && (
          <CommunityGroup
            title="Joined"
            communities={joinedCommunities
              .flatMap((item) => (item.channelId ? [item] : []))
              .map((item) => ({
                name: item.name,
                logo: item.logo,
                channelId: item.channelId!,
              }))}
          />
        )) ||
          null}

        {(!value && trendingCommunities.length > 0 && (
          <CommunityGroup
            title="Trending Communities"
            communities={trendingCommunities
              .flatMap((item) => (item.channelId ? [item] : []))
              .map((item) => ({
                name: item.name,
                logo: item.logo,
                channelId: item.channelId!,
              }))}
          />
        )) ||
          null}

        {(value && loading === false && recommend.length === 0 && (
          <NotFoundChannel />
        )) ||
          null}
      </ScrollView>
    </SafeAreaView>
  );
}

function CommunityGroup({
  communities,
  title,
}: {
  communities: Community[];
  title: string;
}) {
  return (
    <View className="m-auto w-full gap-2">
      <SearchTitle title={title} />

      <View className="flex flex-row flex-wrap gap-2">
        {communities.map((item, i) => {
          return (
            <Link key={i} href={`/communities/${item.channelId}`}>
              <SearchItem icon={item.logo} name={item.name} />
            </Link>
          );
        })}
      </View>
    </View>
  );
}

function SearchItem({ icon, name }: { icon: string; name: String }) {
  return (
    <View className="inline-flex w-fit flex-row items-center gap-2 rounded-lg bg-[#ffffff66] p-2.5 text-sm">
      <Avatar alt="" className="h-6 w-6">
        <AvatarImage source={{ uri: icon }} />
      </Avatar>

      <Text className="text-primary-foreground">{name}</Text>
    </View>
  );
}

function RecommendItem({ icon, name }: { icon: string; name: String }) {
  return (
    <View className="flex flex-row items-center gap-2 rounded-lg p-2 text-sm">
      <Avatar alt="" className="h-6 w-6">
        <AvatarImage source={{ uri: icon }} />
      </Avatar>

      <Text className="text-primary-foreground">{name}</Text>
    </View>
  );
}

function SearchTitle({ title }: { title: string }) {
  return <Text className="text-primary-foreground">{title}</Text>;
}

function SearchHeader({
  value,
  setValue,
  searchAction,
}: {
  value: string;
  setValue: (value: string) => void;
  searchAction: () => void;
}) {
  const navigation = useNavigation();
  const searchInputRef = useRef<TextInput>(null);
  return (
    <View className="flex w-full flex-row items-center gap-2 py-2">
      <GoBackButtonBgPrimary
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Text className=" text-xl font-bold text-primary-foreground max-sm:hidden">
        Search Channel
      </Text>
      <View className="hidden flex-grow md:block" />

      <View className="relative flex-grow md:w-96 md:flex-grow-0">
        <Input
          className={cn(
            "color-primary-foreground",
            "border-0 bg-[#ffffff66] text-[12px] text-sm  placeholder:color-[#4c2896]",
            "w-full rounded-full  px-4  outline-none md:w-96",
            "web:ring-0 web:ring-offset-0 web:focus:ring-0 web:focus:ring-offset-0 web:focus-visible:ring-0  web:focus-visible:ring-offset-0",
          )}
          ref={searchInputRef}
          placeholder="Search channel"
          value={value}
          autoFocus={true}
          onChangeText={(text) => setValue(text)}
        />
      </View>
      <Button
        size={"icon"}
        variant={"ghost"}
        onPress={() => {
          searchAction();
        }}
      >
        <Search color="white" />
      </Button>
    </View>
  );
}

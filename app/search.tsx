import { Text, TextInput, View, ScrollView } from "react-native";
import { Stack, useNavigation, Link } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { debounce } from "lodash";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import { getSearchResult } from "~/services/farcaster/api";

import useAllJoinedCommunities from "~/hooks/community/useAllJoinedCommunities";

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

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          header: () => (
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
          ),
        }}
      />
      {loading && (
        <View className="flex items-center justify-center">
          <Text>Loading...</Text>
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
        <View className="m-auto w-full space-y-2 p-3 md:w-[500px]">
          <SearchTitle title={"Joined"} />

          <View className="flex flex-row flex-wrap gap-2">
            {joinedCommunities.map((item, i) => {
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

      {(value && loading === false && recommend.length === 0 && (
        <DefaultSearchIcon />
      )) ||
        null}
    </ScrollView>
  );
}

function SearchItem({ icon, name }: { icon: string; name: String }) {
  return (
    <View className="inline-flex w-fit flex-row items-center gap-2 rounded-lg bg-[#a36efe1a] p-2.5 text-sm">
      <Avatar alt="" className="h-6 w-6">
        <AvatarImage source={{ uri: icon }} />
      </Avatar>

      <Text>{name}</Text>
    </View>
  );
}

function RecommendItem({ icon, name }: { icon: string; name: String }) {
  return (
    <View className="flex flex-row items-center gap-2 rounded-lg p-2 text-sm">
      <Avatar alt="" className="h-6 w-6">
        <AvatarImage source={{ uri: icon }} />
      </Avatar>

      <Text>{name}</Text>
    </View>
  );
}

function SearchTitle({ title }: { title: string }) {
  return <Text className="text-base">{title}</Text>;
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
    <View className="flex w-full flex-row items-center">
      <View className="w-fit p-3 ">
        <Button
          className="rounded-full bg-[#a36efe1a]"
          size={"icon"}
          variant={"ghost"}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <BackArrowIcon />
        </Button>
      </View>

      <View className="hidden flex-grow md:block" />

      <View className="relative flex-grow md:w-96 md:flex-grow-0">
        <Input
          className={cn(
            "border-0 bg-[#a36efe1a] text-[12px] text-sm color-[#4c2896] placeholder:color-[#4c2896]",
            "w-full rounded-full  px-4  outline-none md:w-96",
            "web:ring-0 web:ring-offset-0 web:focus:ring-0 web:focus:ring-offset-0 web:focus-visible:ring-0  web:focus-visible:ring-offset-0",
          )}
          ref={searchInputRef}
          placeholder="Search communities"
          value={value}
          autoFocus={true}
          onChangeText={(text) => setValue(text)}
        />

        <Button
          className="absolute bottom-0 right-1 top-0 flex items-center justify-center"
          size={"icon"}
          variant={null}
          onPress={() => {
            setValue("");
          }}
        >
          <CrossIcon />
        </Button>
      </View>
      <View className="w-fit p-3 ">
        <Button
          className="rounded-full web:bg-[#4C2896] web:hover:bg-[#4C2896] web:active:bg-[#4C2896]"
          size={"icon"}
          variant={"ghost"}
          onPress={() => {
            searchAction();
          }}
        >
          <SearchIcon />
        </Button>
      </View>
    </View>
  );
}

function BackArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M2.10347 8.88054C1.61698 8.39405 1.61698 7.60586 2.10347 7.11937L7.88572 1.33713C8.11914 1.10371 8.43573 0.972572 8.76583 0.972572C9.09594 0.972572 9.41252 1.10371 9.64594 1.33713C9.87936 1.57055 10.0105 1.88713 10.0105 2.21724C10.0105 2.54734 9.87936 2.86393 9.64594 3.09735L4.74334 7.99996L9.64594 12.9026C9.87936 13.136 10.0105 13.4526 10.0105 13.7827C10.0105 14.1128 9.87936 14.4294 9.64594 14.6628C9.41252 14.8962 9.09594 15.0273 8.76583 15.0273C8.43573 15.0273 8.11914 14.8962 7.88572 14.6628L2.10347 8.88054Z"
        fill="#4C2896"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M8.73676 2.53748C5.24323 2.53748 2.41113 5.36958 2.41113 8.86315C2.41113 12.3567 5.24323 15.1888 8.73676 15.1888C12.2303 15.1888 15.0624 12.3567 15.0624 8.86315C15.0624 5.36958 12.2303 2.53748 8.73676 2.53748ZM8.73676 13.9397C5.93756 13.9397 3.66029 11.6623 3.66029 8.86315C3.66029 6.06394 5.93756 3.78663 8.73676 3.78663C11.536 3.78663 13.8133 6.06394 13.8133 8.86315C13.8133 11.6623 11.5359 13.9397 8.73676 13.9397Z"
        fill="white"
      />
      <path
        d="M17.4136 16.4075L14.614 13.6074C14.3516 13.9321 14.0599 14.2307 13.748 14.5078L16.5304 17.2906C16.6524 17.4126 16.8122 17.4736 16.972 17.4736C17.1319 17.4736 17.2916 17.4126 17.4136 17.2906C17.6576 17.0467 17.6576 16.6514 17.4136 16.4075Z"
        fill="white"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M15 5L5 15"
        stroke="#4C2896"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 5L15 15"
        stroke="#4C2896"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DefaultSearchIcon() {
  return (
    <View className="flex w-full flex-col items-center justify-center ">
      <View className="flex w-72 flex-col items-center justify-center gap-8">
        <Image
          source={require("../assets/images/default-search.png")}
          className="h-72 w-72"
          contentFit="fill"
          style={{ width: 280, height: 280 }}
        />

        <Text className="text-lg font-bold color-[#4C2896]">
          Community Not Found
        </Text>
        <Text className="text-center text-base leading-8 color-[#A36EFE]">
          The community you’re looking for does not seem to exist.
        </Text>

        <Link href="/(tabs)/trade" asChild>
          <Button className="w-72 rounded-md  web:bg-[#A36EFE] web:hover:bg-[#A36EFE] web:active:bg-[#A36EFE]">
            <Text className="color-white">Explore more communities</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}

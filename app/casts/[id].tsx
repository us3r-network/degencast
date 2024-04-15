import {
  Stack,
  useRouter,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { createContext, useContext, useEffect } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { Share2 } from "~/components/common/Icons";
import FCast from "~/components/social-farcaster/FCast";
import { Button } from "~/components/ui/button";
import useLoadCastDetail from "~/hooks/social-farcaster/useLoadCastDetail";
import { cn } from "~/lib/utils";
import { CommunityData } from "~/services/community/api/community";

const CommunityContext = createContext<{
  community: CommunityData | null;
  loading: boolean;
}>({
  community: null,
  loading: false,
});

export function useCommunityCtx() {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunityCtx must be used within CommunityContext");
  }
  return context;
}

export default function CommunityDetail() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { id } = params;
  const router = useRouter();
  const { cast, loading, loadCastDetail } = useLoadCastDetail();
  useEffect(() => {
    loadCastDetail(id as string);
  }, [id]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          header: () => (
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center">
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
                <Text className=" ml-2 text-xl font-bold  leading-none text-primary-foreground">
                  Cast
                </Text>
              </View>
              <View className="mr-5 flex flex-row items-center gap-3">
                <Button
                  className="size-10 rounded-full bg-white"
                  onPress={async () => {
                    alert("TODO");
                  }}
                >
                  <Share2 className={cn(" fill-primary stroke-primary")} />
                </Button>
              </View>
            </View>
          ),
        }}
      />
      <View className=" m-auto w-full flex-col gap-7 p-5 sm:w-full sm:max-w-screen-sm">
        {cast && <FCast cast={cast} />}
      </View>
    </SafeAreaView>
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
        fill="#fff"
      />
    </svg>
  );
}

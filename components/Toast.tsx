import { View } from "react-native";
import Toast, { ToastConfigParams } from "react-native-toast-message";
import { Text } from "~/components/ui/text";
import { Link, Stack } from "expo-router";

const toastConfig = {
  postToast: ({
    props,
  }: ToastConfigParams<{
    hash: string;
    fid: string;
  }>) => (
    <View className="flex flex-row items-center gap-3 rounded-xl bg-secondary p-3 px-4">
      <Text className="font-bold text-white">Cast created successfully!</Text>
      <Link href={`/casts/${props.hash}?fid=${props.fid}`}>
        <Text className="break-all font-bold text-primary">View</Text>
      </Link>
    </View>
  ),
  postPreviewToast: ({ props }: ToastConfigParams<{}>) => (
    <View className="flex flex-row items-center gap-3 rounded-xl bg-secondary p-3 px-4">
      <Text className="font-bold text-white">Cast created successfully!</Text>
      <Link href={`/casts/preview`}>
        <Text className="break-all font-bold text-primary">View</Text>
      </Link>
    </View>
  ),
  success: ({ text1 }: ToastConfigParams<{}>) => (
    <View className="flex max-w-[80vw] flex-row items-center gap-3 rounded-xl bg-secondary p-3 px-4">
      <Text className="break-all font-bold text-white">{text1}</Text>
    </View>
  ),
  error: ({ text1 }: ToastConfigParams<{}>) => (
    <View className="flex max-w-[80vw] flex-row items-center gap-3 rounded-xl bg-secondary p-3 px-4">
      <Text className="break-all font-bold text-white">{text1}</Text>
    </View>
  ),
  info: ({ text1 }: ToastConfigParams<{}>) => (
    <View className="flex max-w-[80vw] flex-row items-center gap-3 rounded-xl bg-secondary p-3 px-4">
      <Text className="break-all font-bold text-white">{text1}</Text>
    </View>
  ),
};

export default function DefaultToast() {
  return <Toast config={toastConfig} />;
}

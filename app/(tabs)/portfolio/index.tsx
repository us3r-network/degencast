import { View } from "react-native";
import UserSignin from "~/components/portfolio/user/UserSignin";

export default function LoginScreen() {
  return (
    <View className="flex h-full items-center justify-center">
      <View>
        <UserSignin
          onSuccess={() => {
            console.log("login successful!");
          }}
          onFail={(error: unknown) => {
            console.log("Failed to login", error);
          }}
        />
      </View>
    </View>
  );
}
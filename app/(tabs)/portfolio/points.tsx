import { ScrollView, View } from "react-native";
import { useAccount } from "wagmi";
import { PointsRules } from "~/components/point/PointsRulesModal";

export default function UserTokens() {
  const { address } = useAccount();
  return (
    <View className="p-2">
      <PointsRules />
    </View>
  );
}

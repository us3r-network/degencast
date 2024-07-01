import { useEffect } from "react";
import { View } from "react-native";
import { ExternalLink } from "~/components/common/ExternalLink";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useUserDegenAllowance from "~/hooks/user/useUserDegenAllowance";
// import useFarcasterUserDegenAllowance from "~/hooks/user/useFarcasterUserDegenAllowance";

const DEGENTIPS_URL = "https://www.degen.tips/airdrop2/season4";
export default function DegenTipsStats({
  fid,
  address,
}: {
  fid?: number;
  address?: `0x${string}`;
}) {
  // const {
  //   totalDegenAllowance,
  //   remainingDegenAllowance,
  //   loadDegenAllowance,
  //   loading,
  // } = useFarcasterUserDegenAllowance(fid);

  const {
    totalDegenAllowance,
    remainingDegenAllowance,
    loadDegenAllowance,
    loading,
  } = useUserDegenAllowance({
    fid: fid || "",
    address: address || "",
  });
  // } = useUserDegenAllowance("0xee3ca4dd4ceb3416915eddc6cdadb4a6060434d4");
  useEffect(() => {
    loadDegenAllowance();
  }, [loadDegenAllowance]);
  if (loading) {
    return null;
  }
  return (
    // <ExternalLink href={`${DEGENTIPS_URL}`} target="_blank">
      <View variant="link" className="h-6 flex-row items-center gap-1 p-0">
        <Text className="text-sm font-medium text-white">
          {new Intl.NumberFormat("en-US", {
            notation: "compact",
          }).format(remainingDegenAllowance)}
        </Text>
        <Text className="text-sm text-secondary">/</Text>
        <Text className="text-sm font-medium text-white">
          {new Intl.NumberFormat("en-US", {
            notation: "compact",
          }).format(totalDegenAllowance)}
        </Text>
      </View>
    // </ExternalLink>
  );
}

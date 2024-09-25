import { kebabCase } from "lodash";
import { Image } from "react-native";
import { ExternalLink } from "~/components/common/ExternalLink";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import useATTNftInfo from "~/hooks/trade/useATTNftInfo";
import { cn } from "~/lib/utils";

export default function ATTExternalLink({
  contractAddress,
  tokenId,
  className,
}: {
  contractAddress: string;
  tokenId?: string | number;
  className?: string;
}) {
  const { totalNFTSupply } = useATTNftInfo({
    tokenContract: contractAddress as `0x${string}`,
  });
  if (!totalNFTSupply) return null;
  return (
    <ExternalLink
      href={`https://${ATT_CONTRACT_CHAIN.testnet ? "testnets." : ""}opensea.io/assets/${kebabCase(ATT_CONTRACT_CHAIN.name)}/${contractAddress}/${tokenId === undefined ? "" : tokenId}`}
      target="_blank"
    >
      <Button
        variant={"secondary"}
        className={cn(
          "absolute bottom-0 w-full flex-row items-center gap-2",
          className,
        )}
      >
        <Text>View</Text>
        <Image
          source={{
            uri: "https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png",
          }}
          style={{
            width: 24,
            height: 24,
            resizeMode: "contain",
          }}
        />
        <Text>Opensea</Text>
      </Button>
    </ExternalLink>
  );
}

import { Image } from "react-native";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import { ExternalLink } from "../common/ExternalLink";
import { kebabCase } from "lodash";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
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
  return (
    <ExternalLink
      href={`https://${ATT_CONTRACT_CHAIN.testnet ? "testnets.":""}opensea.io/assets/${kebabCase(ATT_CONTRACT_CHAIN.name)}/${contractAddress}/${tokenId === undefined ? "" : tokenId}`}
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

import { View } from "react-native";
import { Text } from "~/components/ui/text";
import TextWithTag from "./TextWithTag";

type UnorderedListProps = React.ComponentPropsWithoutRef<typeof View> & {
  texts: string[];
};

export const UnorderedList = ({ texts }: UnorderedListProps) => {
  return (
    <View className="w-full gap-2">
      {texts.map((item, index) => (
        <View key={index} className="w-full flex-row gap-2">
          <Text>{"\u2022"}</Text>
          <TextWithTag>{item}</TextWithTag>
        </View>
      ))}
    </View>
  );
};

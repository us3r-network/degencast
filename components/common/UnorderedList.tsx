import { View } from "react-native";
import { Text, TextClassContext } from "~/components/ui/text";
import TextWithTag from "./TextWithTag";

type UnorderedListProps = React.ComponentPropsWithoutRef<typeof View> & {
  texts: string[];
};

export const UnorderedList = ({ texts }: UnorderedListProps) => {
  return (
    <View className="w-full gap-2">
      <TextClassContext.Provider value="text-xs font-medium text-white">
        {texts.map((item, index) => (
          <View key={index} className="w-full flex-row gap-2">
            <Text>{"\u2022"}</Text>
            <TextWithTag>{item}</TextWithTag>
          </View>
        ))}
      </TextClassContext.Provider>
    </View>
  );
};

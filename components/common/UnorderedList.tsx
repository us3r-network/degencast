import { View } from "react-native";
import { Text } from "~/components/ui/text";

type UnorderedListProps = React.ComponentPropsWithoutRef<typeof View> & {
  texts: string[];
};

export const UnorderedList = ({ texts }: UnorderedListProps) => {
  return (
    <View className="w-full gap-4">
      {texts.map((item, index) => (
        <View className="w-full flex-row gap-4">
          <Text>{"\u2022"}</Text>
          <Text>{item}</Text>
        </View>
      ))}
    </View>
  );
};

import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { PRIMARY_COLOR } from "~/constants";
import { uploadImage } from "~/services/upload";
import { ImageIcon } from "./SvgIcons";

export default function ImageSelector({
  renderButton,
  imageUrlCallback,
}: {
  renderButton?: (props: {
    onPress: () => void;
    loading: boolean;
  }) => React.ReactNode;
  imageUrlCallback: (url: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const pickImage = async () => {
    setLoading(true);
    try {
      // No permissions request is necessary for launching the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log("launchImageLibraryAsync", result);
      const { assets, canceled } = result;
      if (!canceled && assets?.[0]) {
        const formData = new FormData();

        const response = await fetch(assets[0].uri);
        const blob = await response.blob();

        formData.append("file", blob);

        const resp = await uploadImage(formData);
        console.log("uploaded image: ", resp.data);
        imageUrlCallback(resp.data.url);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <View>
      {renderButton ? (
        renderButton({ onPress: pickImage, loading })
      ) : (
        <Button
          onPress={pickImage}
          disabled={loading}
          className="rounded-md bg-[#a36efe1a]"
          size={"icon"}
        >
          {loading ? <ImageIcon /> : <ImageIcon />}
        </Button>
      )}
    </View>
  );
}

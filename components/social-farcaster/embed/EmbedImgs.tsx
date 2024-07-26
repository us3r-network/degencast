import { Embeds } from "~/utils/farcaster/getEmbeds";
import { View, Image } from "react-native";
import { useEffect, useState } from "react";
import { AspectRatio } from "~/components/ui/aspect-ratio";
// import { Image } from "expo-image";

export default function EmbedImgs({
  imgs,
  maxHeight,
}: {
  imgs: Embeds["imgs"];
  maxHeight?: number;
}) {
  const [imgsInfo, setImgsInfo] = useState<
    Array<{
      ratio: number;
    }>
  >([]);
  useEffect(() => {
    imgs.forEach((img, idx) => {
      Image.getSize(img.url, (width, height) => {
        setImgsInfo((prev) => {
          prev[idx] = { ratio: width / height };
          return prev;
        });
      });
    });
  }, [imgs]);
  return (
    <>
      {imgs.map((img, idx) => {
        if (!imgsInfo[idx]) {
          return null;
        }
        return (
          <AspectRatio ratio={imgsInfo[idx].ratio} key={img.url}>
            <Image
              source={{ uri: img.url }}
              style={{
                borderRadius: 10,
                width: "100%",
                height: "100%",
                resizeMode: "contain",
                ...(maxHeight ? { maxHeight } : {}),
              }}
            />
          </AspectRatio>
        );
      })}
    </>
  );
}

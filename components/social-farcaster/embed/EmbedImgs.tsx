import { Embeds } from "~/utils/farcaster/getEmbeds";
import { Image } from "react-native";
import { AspectRatio } from "~/components/ui/aspect-ratio";

export default function EmbedImgs({
  imgs,
  maxHeight,
}: {
  imgs: Embeds["imgs"];
  maxHeight?: number;
}) {
  return (
    <>
      {imgs.map((img, idx) => {
        const { url, metadata } = img;
        const { width_px, height_px } = metadata.image;
        const ratio = width_px / height_px;
        return (
          <AspectRatio ratio={ratio} key={url}>
            <Image
              source={{ uri: url }}
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

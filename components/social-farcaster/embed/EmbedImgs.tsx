import { Embeds } from "~/utils/farcaster/getEmbeds";
import { Image } from "react-native";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { useEffect, useState } from "react";

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
        if (!metadata?.image?.width_px || !metadata?.image?.height_px) {
          return <EmbedImg img={img} maxHeight={maxHeight} key={url} />;
        }
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

function EmbedImg({
  img,
  maxHeight,
}: {
  img: Embeds["imgs"][0];
  maxHeight?: number;
}) {
  const [imgsInfo, setImgsInfo] = useState<{
    ratio: number;
  } | null>(null);
  useEffect(() => {
    Image.getSize(img.url, (width, height) => {
      setImgsInfo({ ratio: width / height });
    });
  }, [img]);
  if (!imgsInfo) {
    return null;
  }
  return (
    <AspectRatio ratio={imgsInfo.ratio} key={img.url}>
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
}

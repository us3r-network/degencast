import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { useATTContractInfo } from "~/hooks/trade/useATTContract";
import { ERC42069Token } from "~/services/trade/types";
import { AspectRatio } from "../ui/aspect-ratio";

export default function NFTImage({
    nft,
    image,
  }: {
    nft: ERC42069Token;
    image?: string;
  }) {
    const { uri } = useATTContractInfo(nft);
    const { data: tokenURI } = uri();
    const [imageURI, setimageURI] = useState("");
  
    useEffect(() => {
      // console.log("tokenURI", tokenAddress, tokenId, tokenURI, image);
      if (image) {
        setimageURI(image);
      } else if (tokenURI) {
        fetch(tokenURI)
          .then((response) => response.json())
          .then((json) => setimageURI(json.image as string))
          .catch((err) => console.log("Request NFT Metadata Failed", err));
      }
    }, [tokenURI, image]);
  
    return (
      <AspectRatio ratio={1}>
        <Image
          source={{
            uri: imageURI,
          }}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 10,
            resizeMode: "contain",
          }}
        />
      </AspectRatio>
    );
  }
  
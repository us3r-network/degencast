import Carousel from "react-native-reanimated-carousel";
import { Dimensions, Image, Pressable, View } from "react-native";
import { isMobile } from "react-device-detect";
import React from "react";

const banners = [
  { img: "images/explore-banner-1.png", tab: "vote" },
  { img: "images/explore-banner-2.png", tab: "collect" },
];
const ratio = 358 / 190;
const pcImgWidth = 640;
const pcImgHeight = pcImgWidth / ratio;
const mobileWindowWidth = Dimensions.get("window").width;
const mobileImgWidth = mobileWindowWidth - 15 * 2;
const mobileImgHeight = mobileImgWidth / ratio;
const imgWidth = isMobile ? mobileImgWidth : pcImgWidth;
const imgHeight = isMobile ? mobileImgHeight : pcImgHeight;
function ExploreHeader({ jumpTo }: { jumpTo?: (key: string) => void }) {
  return (
    <View className="mb-4 w-full">
      <Carousel
        vertical={false}
        width={imgWidth}
        height={imgHeight}
        loop
        autoPlay={true}
        autoPlayInterval={5000}
        data={banners}
        renderItem={({ index, item }) => (
          <View>
            <Pressable
              onPress={(e) => {
                jumpTo?.(item.tab);
              }}
            >
              <Image
                key={index}
                source={{
                  uri: item.img,
                }}
                resizeMode="center"
                style={{ width: imgWidth, height: imgHeight }}
              />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
export default React.memo(ExploreHeader);

import { useEffect, useState } from "react";
import useLoadCastFeeds from "~/hooks/explore/useLoadCastFeeds";
import CastListWithChannel from "../social-farcaster/proposal/CastListWithChannel";
import Carousel from "react-native-reanimated-carousel";
import { Image, Pressable, View } from "react-native";

export default function CastFeeds({
  jumpTo,
}: {
  jumpTo?: (key: string) => void;
}) {
  const { loadItems, loading, items } = useLoadCastFeeds();
  useEffect(() => {
    loadItems();
  }, []);

  return (
    <CastListWithChannel
      renderHeaderComponent={() => {
        return <ExploreHeader jumpTo={jumpTo} />;
      }}
      items={items}
      loading={loading}
      onEndReached={() => {
        if (loading || (!loading && items?.length === 0)) return;
        loadItems();
        return;
      }}
    />
  );
}

const banners = [
  { img: "images/explore-banner-1.png", tab: "vote" },
  { img: "images/explore-banner-2.png", tab: "collect" },
];
function ExploreHeader({ jumpTo }: { jumpTo?: (key: string) => void }) {
  const [itemWidth, setItemWidth] = useState<number>(0);
  const [ratio, setRatio] = useState<number>(0);
  useEffect(() => {
    Image.getSize("images/explore-banner-1.png", (width, height) => {
      setRatio(width / height);
    });
  }, []);
  const itemHeight = itemWidth / ratio;
  return (
    <View
      className="mb-4 w-full"
      onLayout={(e) => {
        const layout = e.nativeEvent.layout;
        if (layout.width === 0 && layout.height === 0) return;
        setItemWidth(layout.width);
      }}
    >
      {itemWidth && itemHeight ? (
        <Carousel
          vertical={false}
          width={itemWidth}
          height={itemHeight}
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
                  style={{ width: itemWidth, height: itemHeight }}
                />
              </Pressable>
            </View>
          )}
        />
      ) : null}
    </View>
  );
}

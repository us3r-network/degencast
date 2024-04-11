import { createChart, ColorType, AreaData, Time } from "lightweight-charts";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { Text } from "../ui/text";

export default function TradingViewChart({
  prices,
  price,
  priceChange,
}: {
  prices: Array<AreaData<Time>>;
  price: number;
  priceChange: number;
}) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef?.current) return;
    chartContainerRef.current.style.width = "100%";
    chartContainerRef.current.style.height = "100%";
    const backgroundColor = "white",
      lineColor = "#A471F6",
      textColor = "black",
      areaTopColor = "#A471F6",
      areaBottomColor = "rgba(209, 186, 247, 0.38)";
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
      rightPriceScale: {
        visible: false,
        ticksVisible: true,
      },
      timeScale: {
        borderVisible: false,
      },
      autoSize: true,
    });

    const newSeries = chart.addAreaSeries({
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
      lineColor,
      lineType: 2,
    });

    newSeries.setData(prices || []);
    chart.timeScale().fitContent();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [prices]);
  return (
    <View className="h-44 w-full">
      <View className="h-32 w-full">
        <div ref={chartContainerRef} />
      </View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1">
          <Text className=" line-clamp-1 text-sm leading-none text-[#A36EFE]">
            Price
          </Text>
          <Text className=" text-2xl font-semibold">${price}</Text>
        </View>
        <View className=" flex-row gap-1 rounded bg-[#00D1A7] px-2 py-1">
          <Text className=" leading-none text-white ">+</Text>
          <Text className=" leading-none text-white ">{priceChange}</Text>
        </View>
      </View>
    </View>
  );
}

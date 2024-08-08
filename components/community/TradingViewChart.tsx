import { createChart, ColorType, AreaData, Time } from "lightweight-charts";
import { useEffect, useMemo, useRef } from "react";
import { Linking, Platform, TouchableOpacity, View } from "react-native";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";
import { TrendingDown, TrendingUp } from "../common/Icons";
import WebView from "react-native-webview";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import dayjs from "dayjs";

export default function TradingViewChart({
  prices,
  price,
  priceChange,
  img,
  name,
}: {
  prices: Array<AreaData<Time>>;
  price: number;
  priceChange: number;
  img: string;
  name: string;
}) {
  return (
    <View className="w-full">
      <View className="flex-row items-center gap-3">
        <Avatar alt={name || ""} className=" size-9">
          <AvatarImage source={{ uri: img || "" }} />
          <AvatarFallback className="border-primary bg-secondary">
            <Text className="text-sm font-bold leading-none">
              {name.slice(0, 2)}
            </Text>
          </AvatarFallback>
        </Avatar>
        <Text className=" text-base font-medium">{name}</Text>
      </View>
      <View className="h-32 w-full">
        {Platform.OS === "web" ? (
          <WebChart prices={prices} />
        ) : (
          <WebViewChart prices={prices} />
        )}
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <View className=" flex-1 flex-row items-center gap-1">
          <Text className=" text-sm leading-none text-secondary">Price</Text>
          <Text className=" text-2xl font-bold">${price.toFixed(6)}</Text>
        </View>

        <View
          className={cn(
            " flex-row gap-1 rounded px-2 py-1",
            priceChange > 0 ? "bg-[#00D1A7]" : "bg-[#FF5C5C]",
          )}
        >
          {priceChange > 0 ? (
            <TrendingUp size="16px" color="white" />
          ) : (
            <TrendingDown size="16px" color="white" />
          )}
          <Text className=" leading-none text-white ">{priceChange}</Text>
        </View>
      </View>
    </View>
  );
}

function WebChart({ prices }: { prices: Array<AreaData<Time>> }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const createTokenChart = (
    container: HTMLDivElement,
    data: Array<AreaData<Time>>,
  ) => {
    container.style.width = "100%";
    container.style.height = "100%";
    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: "white" },
        textColor: "black",
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
        // visible: false,
        ticksVisible: true,
      },
      timeScale: {
        // visible: false,
        timeVisible: true,
        secondsVisible: false,
        borderVisible: false,
        tickMarkFormatter: (time: number) => {
          return dayjs(time * 1000).format("MMM DD");
        },
      },
      handleScale: {
        mouseWheel: false,
        pinch: false,
        axisPressedMouseMove: false,
      },
      handleScroll: {
        vertTouchDrag: false,
        horzTouchDrag: false,
        mouseWheel: false,
      },
      localization: {
        locale: "en-US",
      },
      autoSize: true,
    });

    const newSeries = chart.addAreaSeries({
      topColor: "#A471F6",
      bottomColor: "rgba(209, 186, 247, 0.38)",
      lineColor: "#A471F6",
      lineType: 0,
      priceFormat: {
        type: "price",
        precision: 6,
        minMove: 0.000001,
      },
    });

    newSeries.setData(data || []);
    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({ width: container?.clientWidth });
    };

    return { chart, handleResize };
  };
  useEffect(() => {
    if (!chartContainerRef?.current) return;
    const { chart, handleResize } = createTokenChart(
      chartContainerRef.current,
      prices,
    );

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [prices]);
  return <div ref={chartContainerRef} />;
}

function WebViewChart({ prices }: { prices: Array<AreaData<Time>> }) {
  const chartHtml = useMemo(() => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <script src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script>
    </head>
    <body>
        <div id="chart-container"></div>
        <script>
            const container = document.getElementById('chart-container');
            const createChart = LightweightCharts.createChart;

            container.style.width = "100%";
            container.style.height = "100%";
            const chart = createChart(container, {
              layout: {
                background: { type: "solid", color: 'white' },
                textColor: "black",
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
                ticksVisible: true,
              },
              timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderVisible: false,
                tickMarkFormatter: (time: number) => {
                  return dayjs(time * 1000).format("MMM DD");
                },
              },
              handleScale: {
                mouseWheel: false,
                pinch: false,
                axisPressedMouseMove: false,
              },
              handleScroll: {
                vertTouchDrag: false,
                horzTouchDrag: false,
                mouseWheel: false,
              },
              localization: {
                locale: "en-US",
              },
              autoSize: true,
            });

            const newSeries = chart.addAreaSeries({
              topColor: "#A471F6",
              bottomColor: "rgba(209, 186, 247, 0.38)",
              lineColor:"#A471F6",
              lineType: 0,
              priceFormat: {
                type: "price",
                precision: 6,
                minMove: 0.000001,
              }
            });

            newSeries.setData(${JSON.stringify(prices)});
            chart.timeScale().fitContent();

        </script>
    </body>
    </html>
  `;
  }, [prices]);
  return (
    <WebView
      originWhitelist={["*"]}
      source={{
        html: chartHtml,
      }}
    />
  );
}

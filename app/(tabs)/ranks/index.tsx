import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
} from "~/components/common/Icons";
import { RadioGroup, RadioGroupItemButton } from "~/components/ui/radio-group";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { OrderParams, RankOrderBy } from "~/services/rank/types";

export default function RanksScreen() {
  return <Redirect href="/ranks/channels" />;
}

export const RankOrderList = [
  { icon: <ArrowDownNarrowWide size="14" color="white" />, value: "DESC" },
  { icon: <ArrowUpNarrowWide size="14" color="white" />, value: "ASC" },
];

export function OrderSelect({
  rankOrderByList,
  defaultOrder,
  setOrderParams,
}: {
  rankOrderByList: {
    label: string;
    value: RankOrderBy;
  }[];
  defaultOrder?: OrderParams;
  setOrderParams: (orderParams: OrderParams) => void;
}) {
  const [order, setOrder] = useState(defaultOrder?.order || "DESC");
  const [orderBy, setOrderBy] = useState(
    defaultOrder?.orderBy || rankOrderByList[0].value,
  );
  useEffect(() => {
    setOrderParams({ order, orderBy });
  }, [order, orderBy]);
  return (
    <View className="flex-row items-center gap-2">
      <RadioGroup value={order} onValueChange={(v: any) => setOrder(v)}>
        <View className="flex-row items-center gap-2 rounded-lg border border-secondary bg-secondary/10 px-2 py-1">
          {RankOrderList.map((item) => (
            <RadioGroupItemButton
              key={item.value}
              value={item.value}
              aria-labelledby={item.value}
              className="border-none p-1"
            >
              <Text
                className={
                  item.value === order ? "text-white" : "text-secondary"
                }
              >
                {item.icon}
              </Text>
            </RadioGroupItemButton>
          ))}
        </View>
      </RadioGroup>
      <RadioGroup
        value={orderBy}
        onValueChange={(v: any) => setOrderBy(v)}
        className="no-scrollbar flex-1 overflow-x-auto"
      >
        <View className="flex-row items-center gap-2">
          {rankOrderByList.map((item) => (
            <RadioGroupItemButton
              key={item.value}
              value={item.value}
              aria-labelledby={item.value}
            >
              <Text
                className={
                  item.value === orderBy ? "text-white" : "text-secondary"
                }
              >
                {item.label}
              </Text>
            </RadioGroupItemButton>
          ))}
        </View>
      </RadioGroup>
    </View>
  );
}

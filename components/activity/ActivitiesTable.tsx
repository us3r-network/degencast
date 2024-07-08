import * as React from "react";
import { FlatList, View } from "react-native";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { Loading } from "../common/Loading";
import {
  ActivityItemUser,
  ActivityItemChannel,
  ActivityItemDegenAmount,
  ActivityItemOperation,
} from "./ActivityItem";

export default function ActivitiesTable({
  items,
  loading,
  onEndReached,
}: {
  items: any[];
  loading: boolean;
  onEndReached: () => void;
}) {
  return (
    <Table className="mt-0 h-full w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="flex-1 items-start px-0 sm:px-3">
            <Text className="text-sm font-bold text-card-foreground">User</Text>
          </TableHead>
          <TableHead className="flex-1 items-center px-0 sm:px-3">
            <Text className="text-sm font-bold text-card-foreground">TXN</Text>
          </TableHead>
          <TableHead className="flex-1 items-center px-0 sm:px-3">
            <Text className="text-sm font-bold text-card-foreground">
              Channel
            </Text>
          </TableHead>
          <TableHead className="flex-1 items-end px-0 sm:px-3">
            <Text className="text-sm font-bold text-card-foreground">
              DEGEN
            </Text>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <FlatList
          style={{
            flex: 1,
          }}
          showsHorizontalScrollIndicator={false}
          data={items}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.1}
          renderItem={({ item, index }) => {
            return (
              <TableRow
                key={index.toString()}
                className={cn(
                  "active:bg-secondary",
                  index % 2 && "bg-muted/40 ",
                )}
              >
                <TableCell className="flex-1 items-start px-0 sm:px-3">
                  <ActivityItemUser
                    userAddr={item?.userAddr}
                    userData={item.user}
                    timestamp={item.timestamp}
                  />
                </TableCell>
                <TableCell className="flex-1 items-center px-0 sm:px-3">
                  <ActivityItemOperation data={item} />
                </TableCell>
                <TableCell className="flex-1 items-center px-0 sm:px-3">
                  <ActivityItemChannel data={item} />
                </TableCell>
                <TableCell className="flex-1 items-end px-0 sm:px-3">
                  <ActivityItemDegenAmount data={item} />
                </TableCell>
              </TableRow>
            );
          }}
          ListFooterComponent={() => {
            if (loading) {
              return (
                <>
                  <View className="ios:pb-0 items-center py-3">
                    <Text
                      nativeID="invoice-table"
                      className="items-center text-sm text-muted-foreground"
                    >
                      <Loading />
                    </Text>
                  </View>
                </>
              );
            }
          }}
        />
      </TableBody>
    </Table>
  );
}

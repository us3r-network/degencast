/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ComponentPropsWithRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CastId } from "@farcaster/hub-web";
import { FarCast, SocialPlatform } from "~/services/farcaster/types";
import { UserData } from "~/utils/farcaster/user-data";
import { getEmbeds } from "~/utils/farcaster/getEmbeds";
import getCastId from "~/utils/farcaster/getCastId";
import { View } from "react-native";

export default function FCast({
  cast,
  cardClickAction,
  castClickAction,
  ...wrapperProps
}: ComponentPropsWithRef<"div"> & {
  cast: FarCast;
  cardClickAction?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  castClickAction?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    castHex: string,
  ) => void;
}) {
  const castId: CastId = getCastId({ cast });

  const embeds = useMemo(() => getEmbeds(cast), [cast]);

  const castHex = Buffer.from(castId.hash).toString("hex");
  return <View>TODO</View>;
}

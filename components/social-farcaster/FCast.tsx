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
import { PostCardMainWrapper, PostCardWrapper } from "../post/PostCard";

export default function FCast({
  cast,
  farcasterUserData,
  farcasterUserDataObj,
  showMenuBtn,
  cardClickAction,
  castClickAction,
  disableRenderUrl,
  shareLink,
  ...wrapperProps
}: ComponentPropsWithRef<"div"> & {
  cast: FarCast;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  farcasterUserDataObj?: { [key: string]: UserData } | undefined;
  isDetail?: boolean;
  showMenuBtn?: boolean;
  disableRenderUrl?: boolean;
  simpleLayout?: boolean;
  cardClickAction?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  castClickAction?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    castHex: string,
  ) => void;
  isV2Layout?: boolean;
  shareLink?: string;
}) {
  const castId: CastId = getCastId({ cast });

  const embeds = useMemo(() => getEmbeds(cast), [cast]);

  const castHex = Buffer.from(castId.hash).toString("hex");
  return (
    <PostCardWrapper
      id={castHex}
      onClick={(e) => {
        castClickAction?.(e, castHex);
      }}
      {...wrapperProps}
    >
      <PostCardMainWrapper>
        <div className="flex items-center gap-[5px]">
          <div className="flex-grow" />
        </div>
      </PostCardMainWrapper>
    </PostCardWrapper>
  );
}

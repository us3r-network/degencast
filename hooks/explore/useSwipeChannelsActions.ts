import { useEffect, useRef } from "react";
import useUserAction from "../user/useUserAction";
import { UserActionName } from "~/services/user/types";
import { CommunityEntity } from "~/services/community/types/community";

export default function useSwipeChannelsActions(opts: {
  channels: Array<CommunityEntity>;
  currentIndex: number;
  swipeDataRefValue: any;
  onViewActionSubmited?: () => void;
}) {
  const { submitUserAction, reportedActions, unreportedActions } =
    useUserAction();
  const { channels, currentIndex, swipeDataRefValue, onViewActionSubmited } =
    opts || {};

  // 停留1秒再上报用户行为加积分
  const submitedViewActionCastsRef = useRef<string[]>([]);
  const currentIndexRef = useRef(currentIndex);
  useEffect(() => {
    const reportedViewChannels = reportedActions
      .filter(
        (item) =>
          item.action === UserActionName.ViewChannel && item.data.channelId,
      )
      .map((item) => item.data.channelId) as string[];
    const unreportedViewChannels = unreportedActions
      .filter(
        (item) =>
          item.action === UserActionName.ViewChannel && item.data.channelId,
      )
      .map((item) => item.data.channelId) as string[];
    const viewedChannels = Array.from(
      new Set([
        ...reportedViewChannels,
        ...unreportedViewChannels,
        ...submitedViewActionCastsRef.current,
      ]),
    );
    submitedViewActionCastsRef.current = viewedChannels;
  }, [reportedActions, unreportedActions]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
    const channel = channels?.[currentIndex];
    const timer = setTimeout(() => {
      if (
        currentIndexRef.current !== 0 &&
        channel?.channelId &&
        currentIndexRef.current === currentIndex
      ) {
        submitUserAction({
          action: UserActionName.ViewChannel,
          data: {
            channelId: channel.channelId,
            swipeData: swipeDataRefValue,
          },
        });
        submitedViewActionCastsRef.current.push(channel?.channelId);
        onViewActionSubmited && onViewActionSubmited();
      }
    }, 500);

    // 如果已经上报过了，就不再上报
    if (
      !channel?.channelId ||
      submitedViewActionCastsRef.current.includes(channel?.channelId)
    ) {
      clearTimeout(timer);
      onViewActionSubmited && onViewActionSubmited();
    }

    return () => {
      clearTimeout(timer);
    };
  }, [currentIndex, channels, submitUserAction]);
}

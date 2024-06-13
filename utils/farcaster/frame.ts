import {
  Frame,
  FrameButtonsType,
  FrameVersion,
  ImageAspectRatio,
} from "frames.js";
import { cloneDeep } from "lodash";
import { NeynarFrame } from "~/services/farcaster/types/neynar";

export function neynarFrameDataToFrameJsData(frame: NeynarFrame): Frame {
  const frameData = cloneDeep(frame);
  return {
    version: frameData.version as FrameVersion,
    postUrl: frameData.post_url,
    buttons: frameData.buttons
      .sort((a, b) => a.index - b.index)
      .map((button) => ({
        label: button.title,
        action: button.action_type,
        target: button.target,
        post_url: button.post_url,
      })) as FrameButtonsType,
    image: frameData.image,
    imageAspectRatio: frameData.image_aspect_ratio as ImageAspectRatio,
    ogImage: frameData.image,
    inputText: frameData.input.text,
    state: frameData.state.serialized,
    accepts: [],
  };
}

export function frameJsDataToNeynarFrameData(
  frameData: Frame,
  framesUrl: string,
): NeynarFrame {
  return {
    version: frameData.version,
    title: "",
    image: frameData.image,
    image_aspect_ratio: frameData.imageAspectRatio || "",
    buttons:
      frameData?.buttons?.map((button, idx) => ({
        index: idx + 1,
        title: button.label,
        action_type: button.action,
        target: button.target,
        post_url: button.post_url,
      })) || [],
    input: {
      text: frameData.inputText,
    },
    state: {
      serialized: frameData.state,
    },
    post_url: frameData.postUrl,
    frames_url: framesUrl,
  };
}

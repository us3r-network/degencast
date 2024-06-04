export enum SwipeType {
  scroll = "scroll",
  gesture = "gesture",
}

export type SwipeEventData = {
  start: any;
  move: Array<any>;
  end: any;
  scrollNativeEventList: Array<any>;
  type: string;
};

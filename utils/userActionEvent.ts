export enum SwipeType {
  scroll = "scroll",
  gesture = "gesture",
}

export type SwipeEventData = {
  start: any;
  move: Array<any>;
  end: any;
  type: string;
};

export const defaultSwipeData = {
  start: null,
  move: [],
  end: null,
  type: "",
};

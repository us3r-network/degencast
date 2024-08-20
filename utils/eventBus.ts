import { Subject } from "rxjs";

export const eventBus = new Subject();

export enum EventTypes {
  NATIVE_TOKEN_BALANCE_CHANGE = "NATIVE_TOKEN_BALANCE_CHANGE",
  ERC20_TOKEN_BALANCE_CHANGE = "ERC20_TOKEN_BALANCE_CHANGE",
}
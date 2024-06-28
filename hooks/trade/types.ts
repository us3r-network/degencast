export type ReadContractReturnType =
  | {
      error?: undefined;
      result: unknown;
      status: "success";
    }
  | {
      error: Error;
      result?: undefined;
      status: "failure";
    };

export enum UnitStringCriticalNumber {
  w = 100000,
  k = 1000,
}
export const formatNumberToUnitString = (
  num: number,
  onlyUnit?: UnitStringCriticalNumber,
): string | number => {
  const toFixed = (number: number) => number.toFixed(1);
  if (onlyUnit) {
    if (num > onlyUnit) {
      if (onlyUnit === UnitStringCriticalNumber.w) {
        return `${toFixed(num / 10000)}w`;
      }
      if (onlyUnit === UnitStringCriticalNumber.k) {
        return `${toFixed(num / 1000)}k`;
      }
    }
    return num;
  }

  if (num > UnitStringCriticalNumber.w) {
    return `${toFixed(num / 10000)}w`;
  }
  if (num > UnitStringCriticalNumber.k) {
    return `${toFixed(num / 1000)}k`;
  }

  return num;
};

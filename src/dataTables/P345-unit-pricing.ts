import { PercentAmi } from "../interfaces/IBuilding";
import { BedroomsKeyEnum } from "../types/enumTypes";

export const p345UnitPricing: Record<
  BedroomsKeyEnum,
  Partial<Record<PercentAmi, number>>
> = {
  [BedroomsKeyEnum.MICRO]: {
    30: 825,
    40: 1100,
    50: 1375,
    60: 1650,
    65: 1787,
    70: 1925,
    75: 2062,
    80: 2200,
    85: 2337,
    90: 2475,
  },

  [BedroomsKeyEnum.STUDIO]: {
    30: 825,
    40: 1100,
    50: 1375,
    60: 1650,
    65: 1787,
    70: 1925,
    75: 2062,
    80: 2200,
    85: 2337,
    90: 2475,
  },

  [BedroomsKeyEnum.ONE_BED]: {
    30: 883,
    40: 1178,
    50: 1473,
    60: 1767,
    65: 1915,
    70: 2062,
    75: 2209,
    80: 2357,
    85: 2504,
    90: 2651,
  },

  [BedroomsKeyEnum.TWO_BED]: {
    30: 1060,
    40: 1414,
    50: 1767,
    60: 2121,
    65: 2297,
    70: 2474,
    75: 2651,
    80: 2828,
    85: 3004,
    90: 3181,
  },

  [BedroomsKeyEnum.THREE_PLUS]: {
    30: 1225,
    40: 1634,
    50: 2042,
    60: 2451,
    65: 2655,
    70: 2859,
    75: 3063,
    80: 3268,
    85: 3472,
    90: 3676,
  },
};

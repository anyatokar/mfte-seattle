import { PercentAmi } from "../interfaces/IBuilding";
import { BedroomsKeyEnum } from "../types/enumTypes";

export const archNewUnitPricing: Partial<
  Record<BedroomsKeyEnum, Partial<Record<PercentAmi, number>>>
> = {
  [BedroomsKeyEnum.STUDIO]: {
    30: 825,
    35: 962,
    40: 1100,
    45: 1237,
    50: 1375,
    55: 1512,
    60: 1650,
    65: 1787,
    70: 1924,
    75: 2062,
    80: 2199,
    85: 2337,
    90: 2474,
    95: 2612,
    100: 2749,
    105: 2887,
    110: 3024,
    120: 3299,
  },
  [BedroomsKeyEnum.ONE_BED]: {
    30: 943,
    35: 1100,
    40: 1257,
    45: 1414,
    50: 1571,
    55: 1728,
    60: 1885,
    65: 2042,
    70: 2199,
    75: 2357,
    80: 2514,
    85: 2671,
    90: 2828,
    95: 2985,
    100: 3142,
    105: 3299,
    110: 3456,
    120: 3770,
  },
  [BedroomsKeyEnum.TWO_BED]: {
    30: 1060,
    35: 1237,
    40: 1414,
    45: 1591,
    50: 1767,
    55: 1944,
    60: 2121,
    65: 2298,
    70: 2474,
    75: 2651,
    80: 2828,
    85: 3005,
    90: 3181,
    95: 3358,
    100: 3535,
    105: 3711,
    110: 3888,
    120: 4242,
  },
  [BedroomsKeyEnum.THREE_PLUS]: {
    30: 1178,
    35: 1375,
    40: 1571,
    45: 1767,
    50: 1964,
    55: 2160,
    60: 2357,
    65: 2553,
    70: 2749,
    75: 2946,
    80: 3142,
    85: 3338,
    90: 3535,
    95: 3731,
    100: 3928,
    105: 4124,
    110: 4320,
    120: 4713,
  },
};

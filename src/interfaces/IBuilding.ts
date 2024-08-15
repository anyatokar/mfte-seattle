import { Timestamp } from "firebase/firestore";

export type percentBreakdownType = {
  30: number | null;
  40: number | null;
  50: number | null;
  60: number | null;
  65: number | null;
  70: number | null;
  75: number | null;
  80: number | null;
  85: number | null;
  90: number | null;
};

export type amiDataType = {
  micro: percentBreakdownType;
  studio: percentBreakdownType;
  oneBed: percentBreakdownType;
  twoBed: percentBreakdownType;
  threePlusBed: percentBreakdownType;
};

export default interface IBuilding {
  buildingID: string;
  dateCode: string;
  IDWithDateCode: string;
  buildingName: string;
  phone: string | null;
  phone2: string | null;
  residentialTargetedArea: string;
  totalRestrictedUnits: 0 | string;
  sedu: 0 | string;
  studioUnits: 0 | string;
  oneBedroomUnits: 0 | string;
  twoBedroomUnits: 0 | string;
  threePlusBedroomUnits: 0 | string;
  urlForBuilding: string;
  lat: number;
  lng: number;
  streetNum: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  updatedTimestamp: Timestamp;

  streetAddress: string;
  amiData: amiDataType;
}

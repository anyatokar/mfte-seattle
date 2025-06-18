import { Timestamp } from "firebase/firestore";
import IListing from "./IListing";
import { BedroomsKeyEnum } from "../types/enumTypes";

export type PercentAmi =
  | "30"
  | "35"
  | "40"
  | "45"
  | "50"
  | "55"
  | "60"
  | "65"
  | "70"
  | "75"
  | "80"
  | "85"
  | "90"
  | "95"
  | "100"
  | "105"
  | "110"
  | "120"
  | "150"
  | "200"
  | "250";

export type AmiData = { [key in BedroomsKeyEnum]: PercentAmi[] };

export type Address = {
  streetNum: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  neighborhood: string;
  streetAddress: string;
  lat: number;
  lng: number;
};

export type Contact = {
  phone: string | null;
  phone2: string | null;
  urlForBuilding: string;
};

export type SearchFields = {
  buildingName: string;
  neighborhood: string;
  streetAddress: string;
  zip: string;
};

export default interface IBuilding {
  buildingID: string;
  dateCode: string;
  buildingName: string;
  updatedTimestamp: Timestamp;
  amiData: AmiData;
  address: Address;
  contact: Contact;
  listing: IListing;
  searchFields: SearchFields;
  isEnding: boolean;
  isAgeRestricted: boolean;
}

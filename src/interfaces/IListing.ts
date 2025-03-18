import { Timestamp } from "firebase/firestore";
import {
  BedroomsKeyEnum,
  listingStatusEnum,
  ProgramKeyEnum,
} from "../types/enumTypes";
import { Address, AmiData, Contact, PercentAmi } from "./IBuilding";
import { PartialWithRequired } from "../types/partialWithRequiredType";

export type ListingWithRequired = PartialWithRequired<
  IListing,
  | "availDataArray"
  | "url"
  | "expiryDate"
  | "listingID"
  | "buildingID"
  | "description"
  | "feedback"
  | "program"
>;

export type PartialAddress = PartialWithRequired<
  Address,
  "streetAddress" | "zip" | "neighborhood" | "neighborhood"
>;

export type PartialContact = PartialWithRequired<
  Contact,
  "phone" | "urlForBuilding"
>;

export type SelectedBuilding = {
  buildingName: string;
  buildingID: string;
  address: PartialAddress;
  contact: PartialContact;
  amiData: AmiData;
};

export type UnitAvailData = {
  unitSize: BedroomsKeyEnum | undefined;
  /** This is a string because it is always a date in Pacific Time, no matter where the user is located. Think of it as move in date */
  dateAvailString: string;
  /** String when in form, gets converted to number before sent to Firestore */
  maxRent: string | number;
  percentAmi: PercentAmi | undefined;
  rowId: string;
  aptNum: string;
};

export type AvailDataArray = UnitAvailData[];

export default interface IListing {
  listingID: string;
  listingStatus: listingStatusEnum;
  buildingName: string;
  url: string;
  description: string;
  availDataArray: AvailDataArray;
  buildingID: string;
  dateCreated: Timestamp;
  dateUpdated: Timestamp;
  /** This is a string because it is always a date in Pacific Time, no matter where the user is located. Think of it as move in date */
  expiryDate: string;
  managerID: string;
  feedback: string;
  program: ProgramKeyEnum | undefined;
  // When adding listing for a building not in the buildings collection.
  amiData?: AmiData;
  address?: PartialAddress;
  contact?: PartialContact;
}
